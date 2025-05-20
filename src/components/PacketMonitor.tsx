"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, PauseCircle, Activity, DatabaseZap } from 'lucide-react';

const generateMockPacket = (): string => {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'DNS'];
  const randomProtocol = protocols[Math.floor(Math.random() * protocols.length)];
  const srcIp = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  const dstIp = `10.0.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  const srcPort = Math.floor(Math.random() * 64512) + 1024;
  const dstPort = randomProtocol === 'HTTP' ? 80 : randomProtocol === 'DNS' ? 53 : Math.floor(Math.random() * 64512) + 1024;
  const length = Math.floor(Math.random() * 1400) + 60;
  const timestamp = new Date().toLocaleTimeString();

  return `${timestamp} ${randomProtocol} ${srcIp}:${srcPort} -> ${dstIp}:${dstPort} Len: ${length}`;
};

export function PacketMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [packets, setPackets] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isClient && isMonitoring) {
      intervalRef.current = setInterval(() => {
        setPackets(prevPackets => {
          const newPackets = [generateMockPacket(), ...prevPackets];
          return newPackets.slice(0, 200); // Keep last 200 packets
        });
        // Auto-scroll to bottom
        if (scrollAreaRef.current?.firstChild) {
            const scrollableViewport = scrollAreaRef.current.firstChild as HTMLElement;
            if (scrollableViewport) {
                 // Only scroll if user is near the bottom or at the top (initial load)
                const isScrolledToBottom = scrollableViewport.scrollHeight - scrollableViewport.clientHeight <= scrollableViewport.scrollTop + 20;
                const isAtTop = scrollableViewport.scrollTop === 0;
                if (isScrolledToBottom || isAtTop && packets.length > 0) {
                    scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
                }
            }
        }
      }, 1000); // New packet every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMonitoring, isClient, packets.length]); // Added packets.length to re-evaluate scroll condition

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const clearPackets = () => {
    setPackets([]);
  }

  if (!isClient) {
    return <Card><CardHeader><CardTitle>Loading Packet Monitor...</CardTitle></CardHeader><CardContent><div className="h-96"></div></CardContent></Card>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Live Packet Monitor (Simulated)
        </CardTitle>
        <CardDescription>
          Displays simulated live network traffic. Actual packet capture requires system-level permissions and is not implemented.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Button onClick={toggleMonitoring} className="w-full sm:w-auto">
            {isMonitoring ? (
              <><PauseCircle className="mr-2 h-4 w-4" /> Stop Monitoring</>
            ) : (
              <><PlayCircle className="mr-2 h-4 w-4" /> Start Monitoring</>
            )}
          </Button>
          <Button onClick={clearPackets} variant="outline" className="w-full sm:w-auto">
            <DatabaseZap className="mr-2 h-4 w-4" /> Clear Packets
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-26rem)] border rounded-md bg-muted/20 p-1" ref={scrollAreaRef}>
          <div className="p-3 font-mono text-xs space-y-1">
            {packets.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                {isMonitoring ? "Capturing packets..." : "Monitoring paused. Click Start Monitoring to see simulated traffic."}
              </p>
            ) : (
              packets.map((packet, index) => (
                <p key={index} className="whitespace-nowrap overflow-x-auto no-scrollbar">{packet}</p>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
