import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, User, ReceiptText } from "lucide-react";

const BillCenter = () => {
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary p-6 rounded-b-[2rem] shadow-lg">
        <h1 className="text-primary-foreground text-2xl font-bold tracking-tight">
          สร้างบิล
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          ส่งบิลเรียกเก็บเงินไปยังแชทของคุณ
        </p>
      </div>

      <div className="px-4 -mt-6">
        <Tabs defaultValue="group" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 rounded-2xl shadow-sm bg-background">
            <TabsTrigger
              value="group"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2 h-full"
            >
              <Users className="w-4 h-4" />
              กรุ๊ปไลน์
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2 h-full"
            >
              <User className="w-4 h-4" />
              แชทส่วนตัว
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="mt-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-4 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <CardHeader className="pt-0">
                <CardTitle className="text-xl">เรียกเก็บเงินในกรุ๊ป</CardTitle>
                <CardDescription className="text-base">
                  สร้างบิลสำหรับหารค่าใช้จ่ายในกลุ่มเพื่อนที่กำลังคุยอยู่
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <div className="bg-muted/50 rounded-2xl p-4 text-left mb-6 flex gap-3 items-center">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <ReceiptText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">แชร์บิลเข้ากลุ่ม</p>
                    <p className="text-xs text-muted-foreground">
                      เพื่อนทุกคนในกลุ่มจะเห็นบิลนี้
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="w-full">
                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex gap-2">
                  <ReceiptText className="w-5 h-5" />
                  เริ่มสร้างบิล
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="private" className="mt-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-4 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-blue-500" />
              </div>
              <CardHeader className="pt-0">
                <CardTitle className="text-xl">เรียกเก็บเงินรายบุคคล</CardTitle>
                <CardDescription className="text-base">
                  ส่งบิลให้เพื่อนโดยตรงผ่านแชทส่วนตัวแบบ 1:1
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <div className="bg-blue-50/50 rounded-2xl p-4 text-left mb-6 flex gap-3 items-center border border-blue-100">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      ส่งตรงถึงเพื่อน
                    </p>
                    <p className="text-xs text-blue-500">
                      เลือกเพื่อนจากรายการแชทของคุณ
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="w-full">
                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 bg-blue-500 hover:bg-blue-600 flex gap-2 border-none">
                  เลือกเพื่อนที่ต้องการส่งบิล
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillCenter;
