"use client";

import { useState } from "react";
import { suspendProfessional } from "@/server/actions/profile.actions";
import { useRouter } from "next/navigation";

export function SuspendButton({ profileId }: { profileId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSuspend = async () => {
    if (!confirm("Suspender este profesional? No aparecera en busquedas.")) return;
    setLoading(true);
    const result = await suspendProfessional(profileId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleSuspend}
      disabled={loading}
      className="flex-1 py-2 rounded-lg bg-red-50 border border-red-200 text-center text-[11px] font-bold text-red-600 disabled:opacity-50 active:scale-[0.97] transition-transform"
    >
      {loading ? "..." : "Suspender"}
    </button>
  );
}