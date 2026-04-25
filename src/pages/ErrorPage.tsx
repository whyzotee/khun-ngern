import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorPage: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-muted/30 px-4 text-center">
      <Card className="border-none shadow-xl rounded-[2.5rem] max-w-sm w-full p-6 bg-background">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Oops!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base leading-relaxed">
            {message || "กรุณาใช้งานผ่านแอปพลิเคชัน LINE เท่านั้น เพื่อประสิทธิภาพสูงสุดในการใช้งานระบบเรียกเก็บเงิน"}
          </p>
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            onClick={() => window.location.reload()}
            className="w-full h-12 rounded-2xl font-bold text-lg flex gap-2 shadow-lg shadow-primary/20"
          >
            <RefreshCw className="w-5 h-5" />
            ลองใหม่อีกครั้ง
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-8 text-xs text-muted-foreground/50 uppercase tracking-widest font-semibold">Khun Ngern Security System</p>
    </div>
  );
};

export default ErrorPage;
