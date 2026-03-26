"use client";

import { useState } from "react";
import { approveProfessional } from "@/server/actions/profile.actions";
import { useRouter } from "next/navigation";

export function ApproveButton({ profileId }: { profileId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    const result = await approveProfessional(profileId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="flex-1 py-2 rounded-lg bg-green-600 text-white text-[11px] font-bold disabled:opacity-50 active:scale-[0.97] transition-transform"
    >
      {loading ? "..." : "Aprobar"}
    </button>
  );
}