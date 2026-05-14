import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-main">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
