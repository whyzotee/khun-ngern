import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBillStore } from "@/store/useBillStore";
import { useLiffStore } from "@/store/useLiffStore";
import { supabase } from "@/lib/supabase";
import {
  BellRing,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  ReceiptText,
  Send,
  Trash2,
  Users
} from "lucide-react";
import { useLocation } from "wouter";

const demoMembers = [
  { id: "mook", displayName: "มุก" },
  { id: "boss", displayName: "บอส" },
  { id: "ploy", displayName: "พลอย" },
  { id: "tan", displayName: "ตาล" },
  { id: "non", displayName: "นนท์" }
];

const CreateBill = () => {
  const [, setLocation] = useLocation();
  const profile = useLiffStore((state) => state.profile);
  const {
    step,
    setStep,
    title,
    setTitle,
    items,
    addItem,
    removeItem,
    members,
    addMember,
    removeMember,
    splitType,
    setSplitType,
    reset
  } = useBillStore();

  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.amount, 0),
    [items]
  );
  const peopleCount = Math.max(members.length, 1);
  const sharePerPerson = Math.ceil(totalAmount / peopleCount);

  const billMessage = [
    `ขุนเงินขอเรียกเก็บ: ${title || "บิลใหม่"}`,
    `ยอดรวม ${totalAmount.toLocaleString()} บาท`,
    `หาร ${peopleCount} คน คนละ ${sharePerPerson.toLocaleString()} บาท`,
    "",
    "รายการ:",
    ...items.map((item) => `- ${item.name} ${item.amount.toLocaleString()} บาท`),
    "",
    "โอนแล้วกดแจ้งจ่ายในแชทได้เลย"
  ].join("\n");

  const handleAddItem = () => {
    const amount = Number(itemAmount);
    if (!itemName.trim() || !Number.isFinite(amount) || amount <= 0) return;
    addItem(itemName.trim(), amount);
    setItemName("");
    setItemAmount("");
  };

  const toggleMember = (member: (typeof demoMembers)[number]) => {
    if (members.some((item) => item.id === member.id)) {
      removeMember(member.id);
      return;
    }
    addMember(member);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (profile?.userId && import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.functions.invoke("create-bill", {
          body: {
            title,
            total_amount: totalAmount,
            creator_id: profile.userId,
            split_type: splitType,
            members: members.map((member) => ({
              line_user_id: member.id,
              display_name: member.displayName
            })),
            items: items.map((item) => ({
              name: item.name,
              amount: item.amount
            }))
          }
        });

        if (error) throw error;
      }

      setStep(4);
    } catch (err) {
      console.error("Failed to create bill:", err);
      alert("สร้างบิลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(billMessage);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }
    setLocation("/bill-center");
  };

  return (
    <div className="min-h-screen bg-[#f5f7f5] pb-24 text-[#15221b]">
      <header className="bg-[#10251a] px-5 pb-9 pt-5 text-white">
        <div className="mx-auto max-w-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl bg-white/10 text-white hover:bg-white/15"
              onClick={goBack}
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <p className="text-sm font-semibold text-[#8ee6b5]">
                ขั้นตอนที่ {Math.min(step, 3)} จาก 3
              </p>
              <h1 className="text-2xl font-black tracking-tight">สร้างบิลใหม่</h1>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["รายการ", "ผู้ร่วมจ่าย", "ส่งบิล"].map((label, index) => {
              const active = step >= index + 1;
              return (
                <div
                  key={label}
                  className={`h-2 rounded-full ${active ? "bg-[#0fb85d]" : "bg-white/20"}`}
                />
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-5 max-w-md px-4">
        {step === 1 && (
          <section className="space-y-4">
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#0b7f45]">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">รายละเอียดบิล</h2>
                  <p className="text-sm text-[#66736b]">ตั้งชื่อให้เพื่อนจำได้ง่าย</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="bill-title">ชื่อบิล</Label>
                <Input
                  id="bill-title"
                  placeholder="เช่น ชาบูวันศุกร์, ค่าบ้านพักเขาใหญ่"
                  className="h-12 rounded-2xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-black">รายการค่าใช้จ่าย</h2>
                <Badge className="rounded-xl bg-[#eef4f0] text-[#526158] hover:bg-[#eef4f0]">
                  {items.length} รายการ
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_96px_44px] gap-2">
                <Input
                  placeholder="รายการ"
                  className="h-11 rounded-2xl"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="บาท"
                  className="h-11 rounded-2xl"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddItem();
                  }}
                />
                <Button
                  onClick={handleAddItem}
                  size="icon"
                  className="h-11 w-11 rounded-2xl bg-[#0fb85d] hover:bg-[#0b9f50]"
                  aria-label="เพิ่มรายการ"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl bg-[#f7f9f7] p-3"
                  >
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-[#66736b]">
                        ฿{item.amount.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                      aria-label={`ลบ ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#e8f8ef] p-4 text-[#0b7f45]">
                <span className="font-black">ยอดรวม</span>
                <span className="text-2xl font-black">
                  ฿{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              disabled={!title.trim() || items.length === 0}
              onClick={() => setStep(2)}
              className="h-13 w-full rounded-2xl bg-[#0fb85d] text-base font-bold hover:bg-[#0b9f50]"
            >
              เลือกผู้ร่วมจ่าย
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#0b7f45]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">เลือกคนในกลุ่ม</h2>
                  <p className="text-sm text-[#66736b]">
                    เดโมนี้ใช้รายชื่อจำลองสำหรับทดสอบ flow
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {demoMembers.map((member) => {
                  const selected = members.some((item) => item.id === member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        selected
                          ? "border-[#0fb85d] bg-[#e8f8ef]"
                          : "border-[#e7ece8] bg-white"
                      }`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10251a] text-sm font-black text-white">
                        {member.displayName.slice(0, 1)}
                      </span>
                      <span className="flex-1 font-bold">{member.displayName}</span>
                      {selected && <Check className="h-4 w-4 text-[#0b7f45]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <Label className="text-base font-black">วิธีหารเงิน</Label>
              <Tabs
                value={splitType}
                onValueChange={(value) => setSplitType(value as "equal" | "each")}
                className="mt-3"
              >
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-[#eef4f0] p-1">
                  <TabsTrigger value="equal" className="h-full rounded-xl">
                    หารเท่ากัน
                  </TabsTrigger>
                  <TabsTrigger value="each" className="h-full rounded-xl">
                    ระบุรายคน
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="mt-3 text-sm leading-6 text-[#66736b]">
                โหมดระบุรายคนยังใช้ยอดหารเท่ากันในเดโมนี้ แต่เตรียม state ไว้ต่อยอดแล้ว
              </p>
            </div>

            <Button
              disabled={members.length === 0}
              onClick={() => setStep(3)}
              className="h-13 w-full rounded-2xl bg-[#0fb85d] text-base font-bold hover:bg-[#0b9f50]"
            >
              ดูสรุปบิล
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0b7f45]">พร้อมส่งเข้าแชท</p>
                  <h2 className="mt-1 text-2xl font-black">{title}</h2>
                </div>
                <BellRing className="h-8 w-8 text-[#0fb85d]" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f7f9f7] p-4">
                  <p className="text-sm text-[#66736b]">ยอดรวม</p>
                  <p className="mt-1 text-xl font-black">
                    ฿{totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7f9f7] p-4">
                  <p className="text-sm text-[#66736b]">คนละ</p>
                  <p className="mt-1 text-xl font-black">
                    ฿{sharePerPerson.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e7ece8] bg-[#fbfcfb] p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#334139]">
                  {billMessage}
                </pre>
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="h-13 w-full rounded-2xl bg-[#0fb85d] text-base font-bold hover:bg-[#0b9f50]"
            >
              <Send className="mr-2 h-5 w-5" />
              {isSubmitting ? "กำลังสร้างบิล..." : "สร้างบิลและเตรียมส่ง"}
            </Button>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <div className="rounded-[22px] bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#0b7f45]">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-black">สร้างบิลเรียบร้อย</h2>
              <p className="mt-2 text-sm leading-6 text-[#66736b]">
                คัดลอกข้อความนี้ไปส่งในกลุ่ม LINE ได้ทันที หรือเชื่อม LIFF เพิ่มเพื่อส่งอัตโนมัติในขั้นต่อไป
              </p>
            </div>

            <div className="rounded-[22px] border border-[#e7ece8] bg-white p-4 shadow-sm">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#334139]">
                {billMessage}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setLocation("/bill-center");
                }}
                className="h-12 rounded-2xl font-bold"
              >
                กลับหน้าหลัก
              </Button>
              <Button
                onClick={handleCopy}
                className="h-12 rounded-2xl bg-[#0fb85d] font-bold hover:bg-[#0b9f50]"
              >
                {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                {copied ? "คัดลอกแล้ว" : "คัดลอก"}
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CreateBill;
