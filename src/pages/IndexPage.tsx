import { useEffect } from "react";
import { useLocation } from "wouter";
import { BellRing, ReceiptText, Sparkles } from "lucide-react";

const IndexPage = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/bill-center");
    }, 1200);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-[#15221b]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <div className="relative mb-7 flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#0fb85d] shadow-xl shadow-[#0fb85d]/20">
          <BellRing className="h-14 w-14 text-white" strokeWidth={2.4} />
          <div className="absolute -right-3 -top-3 rounded-2xl bg-white p-2 shadow-lg">
            <ReceiptText className="h-5 w-5 text-[#0b7f45]" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0b7f45] shadow-sm">
          <Sparkles className="h-4 w-4" />
          LINE bill collection demo
        </div>

        <h1 className="mt-5 text-center text-4xl font-black tracking-tight">
          Khun Ngern
        </h1>
        <p className="mt-2 text-center text-sm font-medium leading-6 text-[#526158]">
          ผู้ช่วยสร้างบิล หารเงิน และเตือนเพื่อนจ่ายในแชท
        </p>

        <div className="mt-7 flex gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#0fb85d]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#49c5b6] [animation-delay:160ms]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#f4b740] [animation-delay:320ms]" />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
