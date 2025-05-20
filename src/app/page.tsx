"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertViewer } from "@/components/AlertViewer";
import { RulesEditor } from "@/components/RulesEditor";
import { SmartRules } from "@/components/SmartRules";
import { PacketMonitor } from "@/components/PacketMonitor";
import { BellRing, FilePenLine, BrainCircuit, Network } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full">
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 mb-6 p-1.5 sm:p-2 rounded-lg">
          <TabsTrigger value="alerts" className="py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-2">
            <BellRing className="h-4 w-4 sm:h-5 sm:w-5" /> Alert Viewer
          </TabsTrigger>
          <TabsTrigger value="rules" className="py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-2">
            <FilePenLine className="h-4 w-4 sm:h-5 sm:w-5" /> Rules Editor
          </TabsTrigger>
          <TabsTrigger value="smart-rules" className="py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 sm:h-5 sm:w-5" /> Smart Rules
          </TabsTrigger>
          <TabsTrigger value="monitor" className="py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-2">
            <Network className="h-4 w-4 sm:h-5 sm:w-5" /> Packet Monitor
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts">
          <AlertViewer />
        </TabsContent>
        <TabsContent value="rules">
          <RulesEditor />
        </TabsContent>
        <TabsContent value="smart-rules">
          <SmartRules />
        </TabsContent>
        <TabsContent value="monitor">
          <PacketMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
