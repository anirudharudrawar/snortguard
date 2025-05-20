
"use client";

import React, { useState, useEffect } from 'react';
import type { SnortRule } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { FilePenLine, Trash2, PlusCircle, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const initialRules: SnortRule[] = [
  { id: '1', rawRule: 'alert tcp any any -> any 80 (msg:"HTTP Traffic Detected"; sid:1000001; rev:1;)', description: "Detects any HTTP traffic", isEnabled: true },
  { id: '2', rawRule: 'alert icmp any any -> any any (msg:"ICMP Packet Detected"; sid:1000002; rev:1;)', description: "Detects any ICMP packet", isEnabled: true },
];

const LOCAL_STORAGE_KEY = 'snortGuardRules';

export function RulesEditor() {
  const [rules, setRules] = useState<SnortRule[]>([]);
  const [newRule, setNewRule] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load rules from localStorage on initial render
  useEffect(() => {
    try {
      const storedRules = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedRules) {
        setRules(JSON.parse(storedRules));
      } else {
        setRules(initialRules);
      }
    } catch (error) {
      console.error("Failed to parse stored rules:", error);
      toast({
        title: "Error Loading Rules",
        description: "Could not load rules from local storage. Using defaults.",
        variant: "destructive",
      });
      setRules(initialRules);
    }
    setIsLoading(false);
  }, [toast]); // toast is stable, initialRules is stable.

  // Save rules to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) { // Only save after initial load
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rules));
      } catch (error) {
        console.error("Failed to save rules to local storage:", error);
        toast({
          title: "Error Saving Rules",
          description: "Could not save rules to local storage.",
          variant: "destructive",
        });
      }
    }
  }, [rules, isLoading, toast]);

  const handleAddRule = (): void => {
    if (newRule.trim() === '') {
      toast({
        title: "Invalid Rule",
        description: "Rule content cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    const ruleToAdd: SnortRule = {
      id: Date.now().toString(), // Simple unique ID
      rawRule: newRule.trim(),
      description: newRuleDescription.trim() || undefined,
      isEnabled: true,
    };
    setRules(prevRules => [ruleToAdd, ...prevRules]);
    setNewRule('');
    setNewRuleDescription('');
    toast({
      title: "Rule Added",
      description: "The new Snort rule has been successfully added.",
    });
  };

  const handleDeleteRule = (id: string): void => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: "The Snort rule has been deleted.",
      variant: "destructive",
    });
  };

  const handleToggleRule = (id: string): void => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === id ? { ...rule, isEnabled: !rule.isEnabled } : rule
      )
    );
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePenLine className="h-6 w-6 text-primary" />
            Loading Rules Editor...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <p className="text-muted-foreground">Loading rules...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilePenLine className="h-6 w-6 text-primary" />
          Snort Rules Editor
        </CardTitle>
        <CardDescription>Manage your custom Snort rules for signature-based detection.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4 p-4 border rounded-lg shadow-sm bg-muted/30">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Add New Rule
          </h3>
          <Textarea
            placeholder="Enter Snort rule (e.g., alert tcp any any -> any any (msg:...))"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="font-mono text-sm min-h-[80px]"
            rows={3}
          />
          <Input
            placeholder="Optional: Rule description"
            value={newRuleDescription}
            onChange={(e) => setNewRuleDescription(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleAddRule} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-primary" />
          Existing Rules ({rules.length})
        </h3>
        {rules.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No custom rules defined yet. Add some above!</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-35rem)] pr-3">
            <div className="space-y-4">
              {rules.map((rule) => (
                <Card key={rule.id} className={`transition-opacity duration-300 ${rule.isEnabled ? 'opacity-100' : 'opacity-60 bg-muted/50'}`}>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow min-w-0"> {/* Added min-w-0 for flex child truncation */}
                        <CardTitle className="text-sm font-mono break-all">
                          {rule.rawRule}
                        </CardTitle>
                        {rule.description && (
                          <CardDescription className="text-xs mt-1">
                            {rule.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="flex items-center space-x-2">
                           <Switch
                            id={`enable-${rule.id}`}
                            checked={rule.isEnabled}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                            aria-label={rule.isEnabled ? "Disable rule" : "Enable rule"}
                          />
                          <Label htmlFor={`enable-${rule.id}`} className="text-xs cursor-pointer">
                            {rule.isEnabled ? 'Enabled' : 'Disabled'}
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(rule.id)}
                          aria-label="Delete rule"
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
