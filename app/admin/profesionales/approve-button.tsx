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
      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Aprobar"}
    </button>
  );
}
