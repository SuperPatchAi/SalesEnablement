"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Voice Agent page - redirects to Call Center (Campaign) with Quick Call tab
 * 
 * The Voice Agent functionality has been integrated into the unified Call Center.
 * This page now redirects to maintain backwards compatibility.
 */
export default function VoiceAgentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Campaign page with quick-call tab
    router.replace("/campaign?tab=quick-call");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to Call Center...</p>
      </div>
    </div>
  );
}
