import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  BellRing,
  CheckCircle2,
  CreditCard,
  ReceiptText,
  Send,
  User,
  Users,
  Wallet
} from "lucide-react";

const activeBills = [
  {
    title: "ชาบูหลังเลิกงาน",
    amount: 1840,
    paid: 3,
    total: 5,
    status: "รออีก 2 คน"
  },
  {
    title: "ค่าของกินทริปบางแสน",
    amount: 3260,
    paid: 6,
    total: 6,
    status: "ครบแล้ว"
  }
];

const BillCenter = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#f5f7f5] pb-24 text-[#15221b]">
      <header className="bg-[#10251a] px-5 pb-9 pt-6 text-white">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8ee6b5]">Khun Ngern</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">
                ศูนย์เรียกเก็บเงิน
              </h1>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-11 w-11 rounded-2xl bg-white/10 text-white hover:bg-white/15"
              onClick={() => setLocation("/account-management")}
              aria-label="จัดการบัญชีรับเงิน"
            >
              <Wallet className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/65">บิลเปิดอยู่</p>
              <p className="mt-1 text-xl font-black">2</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/65">รับแล้ว</p>
              <p className="mt-1 text-xl font-black">฿4,920</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/65">รอจ่าย</p>
              <p className="mt-1 text-xl font-black">2 คน</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-5 max-w-md px-4">
        <Tabs defaultValue="group" className="w-full">
          <TabsList className="grid h-13 w-full grid-cols-2 rounded-2xl bg-white p-1 shadow-sm">
            <TabsTrigger
              value="group"
              className="h-full rounded-xl data-[state=active]:bg-[#0fb85d] data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              กรุ๊ปไลน์
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="h-full rounded-xl data-[state=active]:bg-[#0fb85d] data-[state=active]:text-white"
            >
              <User className="mr-2 h-4 w-4" />
              แชทส่วนตัว
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="mt-4 space-y-4">
            <section className="rounded-[22px] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#0b7f45]">
                  <ReceiptText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-black">สร้างบิลเข้ากลุ่ม</h2>
                  <p className="mt-1 text-sm leading-6 text-[#66736b]">
                    ใส่รายการ เลือกคนหาร แล้วเตรียมข้อความสำหรับส่งเข้า LINE
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setLocation("/create-bill")}
                className="mt-5 h-13 w-full rounded-2xl bg-[#0fb85d] text-base font-bold text-white shadow-lg shadow-[#0fb85d]/20 hover:bg-[#0b9f50]"
              >
                <Send className="mr-2 h-5 w-5" />
                เริ่มสร้างบิล
              </Button>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-black">บิลล่าสุด</h2>
                <Badge className="rounded-xl bg-[#eef4f0] text-[#526158] hover:bg-[#eef4f0]">
                  Demo
                </Badge>
              </div>
              {activeBills.map((bill) => {
                const isDone = bill.paid === bill.total;
                return (
                  <article
                    key={bill.title}
                    className="rounded-[22px] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold">{bill.title}</p>
                        <p className="mt-1 text-sm text-[#66736b]">
                          ฿{bill.amount.toLocaleString()} · จ่ายแล้ว {bill.paid}/{bill.total}
                        </p>
                      </div>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                          isDone ? "bg-[#e9f8f1] text-[#0b7f45]" : "bg-[#fff7e4] text-[#a46b00]"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#edf1ee]">
                      <div
                        className="h-2 rounded-full bg-[#0fb85d]"
                        style={{ width: `${(bill.paid / bill.total) * 100}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-[#526158]">
                      {bill.status}
                    </p>
                  </article>
                );
              })}
            </section>
          </TabsContent>

          <TabsContent value="private" className="mt-4">
            <section className="rounded-[22px] bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf4ff] text-[#1673d1]">
                <CreditCard className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-lg font-black">ส่งบิลรายคน</h2>
              <p className="mt-2 text-sm leading-6 text-[#66736b]">
                โหมดนี้เตรียมไว้สำหรับเลือกเพื่อน 1:1 จาก LINE แล้วส่งลิงก์จ่ายเงินโดยตรง
              </p>
              <Button
                className="mt-5 h-12 w-full rounded-2xl bg-[#1673d1] font-bold text-white hover:bg-[#1264b7]"
                disabled
              >
                กำลังเตรียม Integration
              </Button>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BillCenter;
