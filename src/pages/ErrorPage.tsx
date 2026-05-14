import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorPage = ({ message }: { message?: string }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#f5f7f5] px-4 text-center text-[#15221b]">
      <div className="w-full max-w-sm rounded-[22px] bg-white p-6 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-black">เปิดผ่าน LINE ก่อนนะ</h1>
        <p className="mt-2 text-sm leading-6 text-[#66736b]">
          {message ||
            "หน้านี้เป็น LIFF app สำหรับใช้งานใน LINE หากต้องการทดสอบบนเว็บ ให้เปิด VITE_DEBUG=true"}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 h-12 w-full rounded-2xl bg-[#0fb85d] font-bold hover:bg-[#0b9f50]"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          โหลดใหม่
        </Button>
      </div>
      <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-[#98a59d]">
        Khun Ngern LIFF Demo
      </p>
    </div>
  );
};

export default ErrorPage;
