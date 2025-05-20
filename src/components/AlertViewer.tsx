
"use client";

import type { Alert } from '@/types';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldAlert, Info, ShieldCheck, Network } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast"; // Added for toast notifications

const mockAlerts: Alert[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5), severity: 'High', description: 'Potential SQL Injection attempt detected.', sourceIp: '192.168.1.101', destinationIp: '10.0.0.5', protocol: 'TCP', ruleId: 'SID:2001219' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 10), severity: 'Medium', description: 'Unusual outbound traffic to known malicious C&C server.', sourceIp: '10.0.0.15', destinationIp: '203.0.113.45', protocol: 'UDP', ruleId: 'SID:2022050' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 12), severity: 'Low', description: 'ICMP Ping flood detected.', sourceIp: '172.16.0.50', destinationIp: '10.0.0.5', protocol: 'ICMP', ruleId: 'SID:1000001' },
];

const SeverityIcon: React.FC<{ severity: Alert['severity'] }> = ({ severity }) => {
  switch (severity) {
    case 'Critical':
    case 'High':
      return <ShieldAlert className="h-5 w-5 text-destructive" />;
    case 'Medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'Low':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
  }
};

const SeverityBadge: React.FC<{ severity: Alert['severity'] }> = ({ severity }) => {
  const variant = severity === 'High' || severity === 'Critical' ? 'destructive' : severity === 'Medium' ? 'secondary' : 'default';
  const className = severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-400 border-yellow-500/50' : '';
  return <Badge variant={variant} className={className}>{severity}</Badge>;
}


export function AlertViewer() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    setIsClient(true);
    // Load initial alerts
    setAlerts(mockAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

    // Simulate new alerts arriving
    const intervalId = setInterval(() => {
      const newAlert: Alert = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        severity: ['High', 'Medium', 'Low', 'Critical'][Math.floor(Math.random() * 4)] as Alert['severity'],
        description: `Simulated event: ${['Unauthorized access attempt', 'Malware signature detected', 'DDoS activity spike', 'Suspicious login'][Math.floor(Math.random() * 4)]}`,
        sourceIp: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        destinationIp: `10.0.0.${Math.floor(Math.random() * 254) + 1}`,
        protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
        ruleId: `SID:${Math.floor(Math.random() * 1000000) + 2000000}`
      };

      // Log new alert to console
      console.info(`[SnortGuard Event Log] New Alert:`, JSON.parse(JSON.stringify(newAlert)));


      // Show toast notification for High or Critical alerts
      if (newAlert.severity === 'High' || newAlert.severity === 'Critical') {
        toast({
          title: `${newAlert.severity} Severity Alert!`,
          description: newAlert.description,
          variant: newAlert.severity === 'Critical' ? 'destructive' : 'default',
        });
      }

      setAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 50)); // Keep max 50 alerts
    }, 5000); // Add new alert every 5 seconds

    return () => clearInterval(intervalId);
  }, [toast]); // Added toast to dependency array

  if (!isClient) {
    return <Card><CardHeader><CardTitle>Loading Alerts...</CardTitle></CardHeader><CardContent><div className="h-96"></div></CardContent></Card>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRingIcon className="h-6 w-6 text-primary" />
          Intrusion Alerts
        </CardTitle>
        <CardDescription>Real-time (simulated) view of network intrusion alerts. Check console for logs.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
          <AnimatePresence initial={false}>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.3 }}
                className="mb-4"
              >
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-base font-medium flex items-center gap-2">
                         <SeverityIcon severity={alert.severity} />
                         {alert.description}
                       </CardTitle>
                       <SeverityBadge severity={alert.severity} />
                    </div>
                    <CardDescription className="text-xs font-mono pt-1">
                      {alert.timestamp.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm font-mono bg-muted/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      <p><span className="font-semibold text-foreground/80">Source IP:</span> {alert.sourceIp}</p>
                      <p><span className="font-semibold text-foreground/80">Dest IP:</span> {alert.destinationIp}</p>
                      <p><span className="font-semibold text-foreground/80">Protocol:</span> {alert.protocol}</p>
                      {alert.ruleId && <p><span className="font-semibold text-foreground/80">Rule ID:</span> {alert.ruleId}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {alerts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Network className="h-12 w-12 mx-auto mb-2" />
              <p>No alerts to display yet. Monitoring active...</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Custom BellRingIcon to avoid lucide conflicts if any
function BellRingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

