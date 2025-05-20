export interface Alert {
  id: string;
  timestamp: Date;
  severity: 'High' | 'Medium' | 'Low' | 'Critical';
  description: string;
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  ruleId?: string;
}

export interface SnortRule {
  id: string;
  rawRule: string;
  description?: string;
  isEnabled: boolean;
}
