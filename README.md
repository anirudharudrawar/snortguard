🚨 SnortGuard: Real-time Intrusion Alert Viewer
Welcome to SnortGuard, a real-time (simulated) intrusion alert viewer built with React and Shadcn UI. This component provides a dynamic and visually intuitive way to monitor network security alerts, helping you stay on top of potential threats.

✨ Features
⚡ Real-time Alert Simulation: Watch as new alerts flow in, mimicking live network events.
⚠️ Severity-Based Visualization: Alerts are color-coded and icon-equipped based on their severity (Critical, High, Medium, Low) for quick threat assessment.
🔔 Toast Notifications: Get instant pop-up notifications for high-priority (High and Critical) alerts.
📜 Scrollable Alert Feed: Easily browse through a historical log of alerts within a dedicated scroll area.
✨ Smooth Animations: Powered by framer-motion for a fluid and engaging user experience when new alerts appear.
🔍 Detailed Alert Information: Each alert card provides essential details like source/destination IPs, protocol, and rule ID.
🚀 How to Use
Prerequisites
Node.js (LTS recommended)
npm or yarn
Installation
Clone the repository (or integrate the component into your existing project):

Bash

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install dependencies:

Bash

npm install
# or
yarn install
Ensure you have the necessary Shadcn UI components and framer-motion installed:

Bash

npx shadcn-ui@latest add card badge scroll-area sonner
npm install framer-motion
# or
yarn add framer-motion
(Note: The useToast hook implies a toast notification system, likely shadcn-ui's sonner or similar. Make sure it's set up in your layout.tsx or equivalent root file.)

Integrate the AlertViewer component:

You can simply drop the AlertViewer component into any of your React pages or components.

TypeScript

import { AlertViewer } from '@/components/AlertViewer'; // Adjust path as needed

function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <AlertViewer />
    </div>
  );
}

export default DashboardPage;
Run your development server:

Bash

npm run dev
# or
yarn dev
Open your browser and navigate to the appropriate page where you've included the AlertViewer component. You'll start seeing simulated alerts appear!

🛠️ Technologies Used
React
Next.js (or any React framework)
Shadcn UI - Beautifully designed components.
Tailwind CSS - For utility-first styling.
Lucide React - For icons.
Framer Motion - For smooth animations.
