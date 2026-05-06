import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useLiffStore } from "../store/useLiffStore";

const LIFF_IDS = {
  ACCOUNT_MANAGEMENT: "2009825183-HTEPDBNd",
  BILL_CENTER: "2009825183-NIh7DEo0",
};

const LineGuard = ({ children }: { children: React.ReactNode }) => {
  const isReady = useLiffStore((state) => state.isReady);
  const isInClient = useLiffStore((state) => state.isInClient);
  const isLoggedIn = useLiffStore((state) => state.isLoggedIn);
  const initLiff = useLiffStore((state) => state.initLiff);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const targetLiffId = location.startsWith("/account-management")
      ? LIFF_IDS.ACCOUNT_MANAGEMENT
      : LIFF_IDS.BILL_CENTER;

    initLiff(targetLiffId);
  }, [location, initLiff]);

  useEffect(() => {
    const isDebug = import.meta.env.VITE_DEBUG === "true";
    // Allow if in LINE client OR if logged in (for safety) OR if debug mode
    if (isReady && !isInClient && !isLoggedIn && !isDebug) {
      navigate("/error");
    }
  }, [isReady, isInClient, isLoggedIn, navigate]);

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
