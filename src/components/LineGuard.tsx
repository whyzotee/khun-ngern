import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useLiffStore } from "@/store/useLiffStore";

const LIFF_IDS = {
  ACCOUNT_MANAGEMENT: "2009825183-HTEPDBNd",
  BILL_CENTER: "2009825183-NIh7DEo0"
};

const LineGuard = ({ children }: { children: ReactNode }) => {
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
    if (isReady && !isInClient && !isLoggedIn && !isDebug) {
      navigate("/error");
    }
  }, [isReady, isInClient, isLoggedIn, navigate]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7f5]">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#0fb85d]" />
          <p className="font-medium text-[#66736b]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LineGuard;
