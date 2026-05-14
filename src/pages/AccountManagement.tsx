import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLiffStore } from "@/store/useLiffStore";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  ChevronLeft,
  Landmark,
  Loader2,
  Smartphone,
  Wallet
} from "lucide-react";
import { useLocation } from "wouter";

type AccountType = "bank" | "promptpay";

type Account = {
  id?: string;
  name: string;
  type: AccountType;
  bankName?: string;
  accountId: string;
};

const AccountManagement = () => {
  const [, setLocation] = useLocation();
  const { profile } = useLiffStore();
  const [account, setAccount] = useState<Account | null>(null);
  const [accountType, setAccountType] = useState<AccountType>("bank");
  const [formData, setFormData] = useState({
    name: "",
    bankName: "",
    accountId: ""
  });
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!profile?.userId || !import.meta.env.VITE_SUPABASE_URL) return;

      try {
        setIsFetching(true);
        const { data, error } = await supabase.functions.invoke("get-account", {
          body: {
            user_id: profile.userId
          }
        });

        if (error) throw error;
        if (!data.account) return;

        const nextAccount = {
          id: data.account.id,
          name: data.account.name,
          type: data.account.account_type as AccountType,
          bankName: data.account.bank_name || undefined,
          accountId: data.account.account_id
        };
        setAccount(nextAccount);
        setAccountType(nextAccount.type);
        setFormData({
          name: nextAccount.name,
          bankName: nextAccount.bankName || "",
          accountId: nextAccount.accountId
        });
      } catch (err) {
        console.error("Error fetching account:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAccount();
  }, [profile?.userId]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.accountId.trim()) {
      alert("กรุณากรอกข้อมูลบัญชีให้ครบถ้วน");
      return;
    }

    if (accountType === "bank" && !formData.bankName) {
      alert("กรุณาเลือกธนาคาร");
      return;
    }

    const nextAccount: Account = {
      id: account?.id,
      name: formData.name.trim(),
      type: accountType,
      bankName: accountType === "bank" ? formData.bankName : undefined,
      accountId: formData.accountId.trim()
    };

    try {
      setIsSaving(true);
      if (profile?.userId && import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase.functions.invoke("save-account", {
          body: {
            user_id: profile.userId,
            display_name: profile.displayName,
            picture_url: profile.pictureUrl,
            name: nextAccount.name,
            account_type: nextAccount.type,
            bank_name: nextAccount.bankName || null,
            account_id: nextAccount.accountId
          }
        });

        if (error) throw error;
        nextAccount.id = data.account?.id;
      }

      setAccount(nextAccount);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      console.error("Error saving account:", err);
      alert("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
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
              onClick={() => setLocation("/bill-center")}
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <p className="text-sm font-semibold text-[#8ee6b5]">
                ตั้งค่ารับเงิน
              </p>
              <h1 className="text-2xl font-black tracking-tight">
                บัญชีปลายทาง
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-5 max-w-md space-y-4 px-4">
        {account && (
          <section className="rounded-[22px] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#0b7f45]">
                {account.type === "bank" ? (
                  <Landmark className="h-6 w-6" />
                ) : (
                  <Smartphone className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black">{account.name}</p>
                  <Badge className="rounded-xl bg-[#eef4f0] text-[#526158] hover:bg-[#eef4f0]">
                    ค่าเริ่มต้น
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-[#66736b]">
                  {account.bankName ? `${account.bankName} · ` : ""}
                  {account.accountId}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-[22px] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#0b7f45]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black">ข้อมูลบัญชีรับเงิน</h2>
              <p className="text-sm text-[#66736b]">
                ใช้แสดงในบิลเพื่อให้เพื่อนโอนเงินถูกบัญชี
              </p>
            </div>
          </div>

          {isFetching ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#0fb85d]" />
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <Tabs
                value={accountType}
                onValueChange={(value) => setAccountType(value as AccountType)}
              >
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-[#eef4f0] p-1">
                  <TabsTrigger value="bank" className="h-full rounded-xl">
                    <Landmark className="mr-2 h-4 w-4" />
                    ธนาคาร
                  </TabsTrigger>
                  <TabsTrigger value="promptpay" className="h-full rounded-xl">
                    <Smartphone className="mr-2 h-4 w-4" />
                    พร้อมเพย์
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="account-name">ชื่อบัญชี</Label>
                <Input
                  id="account-name"
                  placeholder="ชื่อ-นามสกุล"
                  className="h-12 rounded-2xl"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {accountType === "bank" && (
                <div className="space-y-2">
                  <Label htmlFor="bank-name">ธนาคาร</Label>
                  <Select
                    value={formData.bankName}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bankName: value })
                    }
                  >
                    <SelectTrigger id="bank-name" className="h-12 rounded-2xl">
                      <SelectValue placeholder="เลือกธนาคาร" />
                    </SelectTrigger>
                    <SelectContent>
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
                  {accountType === "bank" ? "เลขบัญชี" : "เบอร์หรือเลขพร้อมเพย์"}
                </Label>
                <Input
                  id="account-id"
                  placeholder={accountType === "bank" ? "000-0-00000-0" : "08X-XXX-XXXX"}
                  className="h-12 rounded-2xl"
                  value={formData.accountId}
                  onChange={(e) =>
                    setFormData({ ...formData, accountId: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </section>

        <Button
          onClick={handleSave}
          disabled={isSaving || isFetching}
          className="h-13 w-full rounded-2xl bg-[#0fb85d] text-base font-bold hover:bg-[#0b9f50]"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="mr-2 h-5 w-5" />
          ) : null}
          {saved ? "บันทึกแล้ว" : "บันทึกบัญชี"}
        </Button>
      </main>
    </div>
  );
};

export default AccountManagement;
