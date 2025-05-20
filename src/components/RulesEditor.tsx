
"use client";

import React, { useState, useEffect } from 'react';
import type { SnortRule } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { FilePenLine, Trash2, PlusCircle } from 'lucide-react';
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
  }, []);

  useEffect(() => {
    if (!isLoading) {
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
      toast({ title: "Error", description: "Rule content cannot be empty.", variant: "destructive" });
      return;
    }
    if (!newRule.includes('msg:') || !newRule.includes('sid:')) {
        toast({ title: "Warning", description: "Rule might be malformed. Ensure it contains 'msg:' and 'sid:'.", variant: "destructive" });
    }

    const ruleToAdd: SnortRule = {
      id: Math.random().toString(36).substring(2, 9),
      rawRule: newRule,
      description: newRuleDescription || "User-defined rule",
      isEnabled: true,
    };
    setRules(prevRules => [ruleToAdd, ...prevRules]);
    setNewRule('');
    setNewRuleDescription('');
    toast({ title: "Rule Added", description: "New Snort rule has been successfully added." });
  };
  
  const handleDeleteRule = (id: string): void => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== id));
    toast({ title: "Rule Deleted", description: "Snort rule has been deleted.", variant: "destructive" });
  };
  
  const handleToggleRule = (id: string): void => {
    const updatedRulesArray = rules.map(rule =>
      rule.id === id ? { ...rule, isEnabled: !rule.isEnabled } : rule
    );
    setRules(updatedRulesArray);
    const ruleToggled = updatedRulesArray.find(r => r.id === id);
    if (ruleToggled) {
      toast({ title: `Rule ${ruleToggled.isEnabled ? "Enabled" : "Disabled"}`, description: `Rule SID:${ruleToggled.rawRule.match(/sid:(\d+)/)?.[1] || 'N/A'} status changed.` });
    }
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
        <CardDescription>Define and manage your custom Snort intrusion detection rules. Rules are saved in your browser.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6 pb-6 border-b">
          <Label htmlFor="new-rule-content">New Rule Content</Label>
          <Textarea
            id="new-rule-content"
            placeholder="Enter new Snort rule (e.g., alert tcp any any -> any any (msg:\"Test Rule\"; sid:2000000; rev:1;))"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="font-mono min-h-[80px] text-sm"
            rows={3}
          />
          <Label htmlFor="new-rule-description">Rule Description (Optional)</Label>
          <Input 
            id="new-rule-description"
            placeholder="Optional: Describe what this rule does"
            value={newRuleDescription}
            onChange={(e) => setNewRuleDescription(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleAddRule} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Rule
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-3">Current Rules ({rules.length})</h3>
        <ScrollArea className="h-[calc(100vh-34rem)] border rounded-md p-1 bg-muted/20">
          {rules.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                <p>No rules defined yet. Add a new rule above.</p>
             </div>
          ) : (
          <div className="space-y-3 p-3">
            {rules.map((rule) => (
              <Card key={rule.id} className={`transition-opacity ${!rule.isEnabled ? 'opacity-60 bg-card/70' : 'bg-card hover:shadow-md'}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-grow space-y-1">
                      <p className="font-mono text-xs break-all leading-relaxed">{rule.rawRule}</p>
                      {rule.description && <p className="text-xs text-muted-foreground italic mt-1">{rule.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                       <div className="flex items-center space-x-2">
                         <Switch
                           id={`enable-rule-${rule.id}`}
                           checked={rule.isEnabled}
                           onCheckedChange={() => handleToggleRule(rule.id)}
                           aria-label={rule.isEnabled ? "Disable rule" : "Enable rule"}
                         />
                         <Label htmlFor={`enable-rule-${rule.id}`} className="text-xs cursor-pointer">
                           {rule.isEnabled ? "Enabled" : "Disabled"}
                         </Label>
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)} className="text-destructive hover:bg-destructive/10 h-8 w-8">
                         <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete rule</span>
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
