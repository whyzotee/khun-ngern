import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Landmark,
  Smartphone,
  Plus,
  ChevronRight,
  Wallet,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const AccountManagement = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [activeTab, setActiveTab] = useState<"bank" | "promptpay">("bank");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    bankName: "",
    accountId: ""
  });

  // Saved Account State
  const [account, setAccount] = useState<{
    name: string;
    type: "bank" | "promptpay";
    bankName?: string;
    accountId: string;
  } | null>(null);

  const handleOpenConfirm = () => {
    // Basic validation could go here
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setAccount({
      name: formData.name,
      type: activeTab,
      bankName: activeTab === "bank" ? formData.bankName : undefined,
      accountId: formData.accountId
    });
    setIsConfirmOpen(false);
    setView("list");
  };

  if (view === "list") {
    return (
      <div className="min-h-screen bg-muted/30 pb-20">
        <div className="bg-primary p-6 rounded-b-[2rem] shadow-lg">
          <h1 className="text-primary-foreground text-2xl font-bold tracking-tight">
            จัดการบัญชีรับเงิน
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            ข้อมูลบัญชีที่ใช้รับเงินเรียกเก็บของคุณ
          </p>
        </div>

        <div className="px-4 -mt-6 space-y-4">
          {!account ? (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-8 flex flex-col items-center text-center bg-background">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <CardTitle className="text-xl mb-2">
                ยังไม่มีข้อมูลบัญชี
              </CardTitle>
              <CardDescription className="text-base mb-6">
                คุณยังไม่ได้ตั้งค่าบัญชีรับเงิน
                กรุณาเพิ่มข้อมูลเพื่อเริ่มใช้งานระบบเรียกเก็บเงิน
              </CardDescription>
              <Button
                onClick={() => setView("form")}
                className="w-full h-12 rounded-2xl font-bold flex gap-2"
              >
                <Plus className="w-5 h-5" />
                ตั้งค่าบัญชีตอนนี้
              </Button>
            </Card>
          ) : (
            <Card
              className="border-none shadow-sm rounded-3xl overflow-hidden bg-background active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => {
                setFormData({
                  name: account.name,
                  bankName: account.bankName || "",
                  accountId: account.accountId
                });
                setActiveTab(account.type);
                setView("form");
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Badge
                  variant={account.type === "bank" ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1"
                >
                  {account.type === "bank" ? "บัญชีธนาคาร" : "พร้อมเพย์"}
                </Badge>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex gap-4 items-center py-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                    account.type === "bank"
                      ? "bg-primary/10 text-primary"
                      : "bg-blue-500/10 text-blue-600"
                  )}
                >
                  {account.type === "bank" ? (
                    <Landmark className="w-7 h-7" />
                  ) : (
                    <Smartphone className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{account.name}</p>
                  <p className="text-muted-foreground font-medium uppercase text-sm">
                    {account.bankName && (
                      <span className="mr-2">{account.bankName}</span>
                    )}
                    {account.accountId}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {account && (
          <div className="fixed bottom-6 left-0 right-0 px-4">
            <Button
              onClick={() => setView("form")}
              variant="outline"
              className="w-full h-14 rounded-2xl font-bold text-lg bg-background shadow-lg border-2 border-primary/10 hover:bg-muted"
            >
              แก้ไขข้อมูลบัญชี
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary p-6 rounded-b-[2rem] shadow-lg flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-white/10 rounded-full"
          onClick={() => setView("list")}
        >
          <Plus className="w-6 h-6 rotate-45" />
        </Button>
        <div>
          <h1 className="text-primary-foreground text-2xl font-bold tracking-tight">
            ตั้งค่าบัญชีรับเงิน
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            กรอกข้อมูลบัญชีเพื่อรับเงิน
          </p>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <Tabs
          value={activeTab}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 rounded-2xl shadow-sm bg-background">
            <TabsTrigger
              value="bank"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2 h-full font-bold"
            >
              <Landmark className="w-4 h-4" />
              บัญชีธนาคาร
            </TabsTrigger>
            <TabsTrigger
              value="promptpay"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2 h-full font-bold"
            >
              <Smartphone className="w-4 h-4" />
              พร้อมเพย์
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-background">
              <CardHeader>
                <CardTitle className="text-lg">
                  ข้อมูล{activeTab === "bank" ? "บัญชีธนาคาร" : "พร้อมเพย์"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "bank"
                    ? "กรอกข้อมูลธนาคารที่คุณต้องการให้โอนเงินเข้า"
                    : "ระบุเบอร์โทรศัพท์หรือเลขบัตรประชาชนที่ผูกกับพร้อมเพย์"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">ชื่อบัญชี</Label>
                  <Input
                    id="account-name"
                    placeholder="ชื่อ-นามสกุล ภาษาไทย"
                    className="h-12 rounded-xl"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {activeTab === "bank" && (
                  <div className="space-y-2">
                    <Label htmlFor="bank">ธนาคาร</Label>
                    <Select
                      value={formData.bankName}
                      onValueChange={(v) =>
                        setFormData({ ...formData, bankName: v })
                      }
                    >
                      <SelectTrigger id="bank" className="h-12 rounded-xl">
                        <SelectValue placeholder="เลือกธนาคาร" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="KBANK">กสิกรไทย (KBank)</SelectItem>
                        <SelectItem value="SCB">ไทยพาณิชย์ (SCB)</SelectItem>
                        <SelectItem value="BBL">กรุงเทพ (BBL)</SelectItem>
                        <SelectItem value="KTB">กรุงไทย (KTB)</SelectItem>
                        <SelectItem value="BAY">กรุงศรี (BAY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="account-id">
                    {activeTab === "bank" ? "เลขบัญชี" : "รหัสพร้อมเพย์"}
                  </Label>
                  <Input
                    id="account-id"
                    placeholder={
                      activeTab === "bank" ? "000-0-00000-0" : "08X-XXX-XXXX"
                    }
                    className="h-12 rounded-xl"
                    value={formData.accountId}
                    onChange={(e) =>
                      setFormData({ ...formData, accountId: e.target.value })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleOpenConfirm}
                  className="w-full h-12 rounded-2xl font-bold text-lg shadow-md shadow-primary/20"
                >
                  ตรวจสอบและบันทึก
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="rounded-[2.5rem] border-none max-w-[90%] sm:max-w-md p-0 overflow-hidden bg-background">
          <div className="bg-primary/5 p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">
              ตรวจสอบความถูกต้อง
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              กรุณาตรวจสอบข้อมูลบัญชีของคุณให้ถูกต้องก่อนบันทึก
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-muted/50">
                <span className="text-muted-foreground text-sm">ประเภท</span>
                <Badge
                  variant={activeTab === "bank" ? "default" : "secondary"}
                  className="rounded-lg"
                >
                  {activeTab === "bank" ? "บัญชีธนาคาร" : "พร้อมเพย์"}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-muted/50">
                <span className="text-muted-foreground text-sm">ชื่อบัญชี</span>
                <span className="font-bold">{formData.name || "-"}</span>
              </div>
              {activeTab === "bank" && (
                <div className="flex justify-between py-2 border-b border-muted/50">
                  <span className="text-muted-foreground text-sm">ธนาคาร</span>
                  <span className="font-bold">{formData.bankName || "-"}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-muted/50">
                <span className="text-muted-foreground text-sm">
                  {activeTab === "bank" ? "เลขบัญชี" : "รหัสพร้อมเพย์"}
                </span>
                <span className="font-bold">{formData.accountId || "-"}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 flex flex-col gap-3">
            <Button
              onClick={handleConfirmSave}
              className="w-full h-12 rounded-2xl font-bold text-lg"
            >
              ยืนยันข้อมูล
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsConfirmOpen(false)}
              className="w-full h-12 rounded-2xl font-medium text-muted-foreground hover:bg-muted/50"
            >
              กลับไปแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountManagement;
