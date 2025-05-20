"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { suggestSnortRulesAction } from '@/app/actions';
import type { SuggestSnortRulesOutput } from '@/ai/flows/suggest-snort-rules';

const formSchema = z.object({
  networkTrafficAnalysis: z.string().min(50, {
    message: "Network traffic analysis must be at least 50 characters.",
  }).max(5000, { message: "Network traffic analysis must be at most 5000 characters." }),
  existingRules: z.string().max(5000, { message: "Existing rules must be at most 5000 characters." }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SmartRules() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<SuggestSnortRulesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      networkTrafficAnalysis: "",
      existingRules: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const result = await suggestSnortRulesAction({
        networkTrafficAnalysis: data.networkTrafficAnalysis,
        existingRules: data.existingRules || undefined,
      });

      if ('error' in result) {
        toast({
          title: "Error Generating Suggestions",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setAiResponse(result);
        toast({
          title: "Suggestions Generated",
          description: "AI has provided Snort rule suggestions.",
        });
      }
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          Smart Rule Suggestions (AI-Powered)
        </CardTitle>
        <CardDescription>Get AI-driven suggestions for optimizing Snort rules based on network traffic analysis.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="networkTrafficAnalysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Traffic Analysis Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste or describe network traffic patterns, logs, or anomalies observed..."
                      className="min-h-[150px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed summary of network traffic. The more context, the better the suggestions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="existingRules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Existing Snort Rules (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your current Snort rules, if any. One rule per line."
                      className="min-h-[100px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Providing existing rules helps the AI avoid duplicates and suggest complementary rules.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
             <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Suggestions"
              )}
            </Button>
            {aiResponse && (
              <Card className="mt-6 bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Suggested Rules:</h4>
                    <ScrollArea className="h-48 border rounded-md p-2 bg-background">
                      <pre className="text-sm font-mono whitespace-pre-wrap">{aiResponse.suggestedRules}</pre>
                    </ScrollArea>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Explanation:</h4>
                    <ScrollArea className="h-32 border rounded-md p-2 bg-background">
                     <p className="text-sm whitespace-pre-wrap">{aiResponse.explanation}</p>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
