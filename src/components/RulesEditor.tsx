
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { FilePenLine, Save, Trash2, PlusCircle } from 'lucide-react';
import type { SnortRule } from '@/types';
import { Input } from '@/components/ui/input'; // Corrected import path

const initialRules: SnortRule[] = [
  { id: '1', rawRule: 'alert tcp any any -> any 80 (msg:"HTTP Traffic Detected"; sid:1000001; rev:1;)', description: "Detects any HTTP traffic", isEnabled: true },
  { id: '2', rawRule: 'alert icmp any any -> any any (msg:"ICMP Packet Detected"; sid:1000002; rev:1;)', description: "Detects any ICMP packet", isEnabled: true },
];

export function RulesEditor() {
  const [rules, setRules] = useState<SnortRule[]>([]);
  const [newRule, setNewRule] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load rules from local storage or use initial if not available
    const storedRules = localStorage.getItem('snortRules');
    if (storedRules) {
      try {
        setRules(JSON.parse(storedRules));
      } catch (error) {
        console.error("Failed to parse stored rules:", error);
        setRules(initialRules); // Fallback to initial rules if parsing fails
      }
    } else {
      setRules(initialRules);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('snortRules', JSON.stringify(rules));
    }
  }, [rules, isClient]);

  const handleAddRule = () => {
    if (newRule.trim() === '') {
      toast({ title: "Error", description: "Rule content cannot be empty.", variant: "destructive" });
      return;
    }
    const ruleToAdd: SnortRule = {
      id: Math.random().toString(36).substring(7),
      rawRule: newRule,
      description: newRuleDescription || "User-defined rule",
      isEnabled: true,
    };
    setRules(prevRules => [ruleToAdd, ...prevRules]);
    setNewRule('');
    setNewRuleDescription('');
    toast({ title: "Rule Added", description: "New Snort rule has been added." });
  };

  const handleDeleteRule = (id: string) => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== id));
    toast({ title: "Rule Deleted", description: "Snort rule has been deleted.", variant: "destructive" });
  };
  
  const handleToggleRule = (id: string) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === id ? { ...rule, isEnabled: !rule.isEnabled } : rule
      )
    );
  };

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Rules Editor...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96"></div>
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
        <CardDescription>Define and manage your Snort intrusion detection rules.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <Textarea
            placeholder="Enter new Snort rule (e.g., alert tcp any any -> any any (msg:\"Test Rule\"; sid:2000000; rev:1;))"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="font-mono min-h-[80px] text-sm"
            rows={3}
          />
          <Input 
            placeholder="Optional: Rule description"
            value={newRuleDescription}
            onChange={(e) => setNewRuleDescription(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleAddRule} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Rule
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-3">Current Rules ({rules.length})</h3>
        <ScrollArea className="h-[calc(100vh-30rem)] border rounded-md p-1">
          {rules.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                <p>No rules defined yet. Add a new rule above.</p>
             </div>
          ) : (
          <div className="space-y-3 p-3">
            {rules.map((rule) => (
              <Card key={rule.id} className={`transition-opacity ${!rule.isEnabled ? 'opacity-50 bg-muted/50' : 'bg-card'}`}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-grow">
                      <p className="font-mono text-xs break-all">{rule.rawRule}</p>
                      {rule.description && <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-center shrink-0">
                       <Button 
                         variant={rule.isEnabled ? "outline" : "secondary"} 
                         size="sm" 
                         onClick={() => handleToggleRule(rule.id)}
                         className="text-xs px-2 h-7"
                       >
                         {rule.isEnabled ? "Disable" : "Enable"}
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)} className="text-destructive h-7 w-7">
                         <Trash2 className="h-4 w-4" />
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
