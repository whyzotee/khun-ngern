import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useLiffStore } from "../store/useLiffStore";

const LineGuard = ({ children }: { children: React.ReactNode }) => {
  const isReady = useLiffStore((state) => state.isReady);
  const isInClient = useLiffStore((state) => state.isInClient);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isDebug = import.meta.env.VITE_DEBUG === "true";
    if (isReady && !isInClient && !isDebug) {
      setLocation("/error");
    }
  }, [isReady, isInClient, setLocation]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-line mb-4"></div>
          <p className="text-gray-500 font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LineGuard;
