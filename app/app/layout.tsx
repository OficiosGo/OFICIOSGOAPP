import { BottomTabBar } from "@/components/pwa/bottom-tab-bar";
import { InstallBanner } from "@/components/pwa/install-banner";
import { AnalyticsTracker } from "@/components/features/analytics-tracker";
import { UpdatePrompt } from "@/components/pwa/update-prompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative bg-[#F5F5F7]">
      <UpdatePrompt />
      {children}
      <BottomTabBar />
      <InstallBanner />
      <AnalyticsTracker />
    </div>
  );
}