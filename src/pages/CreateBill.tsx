import { useState } from "react";
import { useBillStore } from "@/store/useBillStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";
import { useLocation } from "wouter";
import { useLiffStore } from "@/store/useLiffStore";
import { supabase } from "@/lib/supabase";

const CreateBill = () => {
  const [, setLocation] = useLocation();
  const profile = useLiffStore((state) => state.profile);
  const { step, setStep, title, setTitle, items, addItem, removeItem, reset } = useBillStore();
  
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = () => {
    if (itemName && itemAmount) {
      addItem(itemName, parseFloat(itemAmount));
      setItemName("");
      setItemAmount("");
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async () => {
    if (!profile?.userId) {
      alert("กรุณาเข้าสู่ระบบก่อนสร้างบิล");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("create-bill", {
        body: {
          title,
          total_amount: totalAmount,
          creator_id: profile.userId,
          items: items.map(item => ({ name: item.name, amount: item.amount }))
        }
      });

      if (error) throw error;

      alert("บันทึกบิลเรียบร้อย!");
      reset();
      setLocation("/bill-center");
    } catch (err) {
      console.error("Failed to create bill:", err);
      alert("เกิดข้อผิดพลาดในการสร้างบิล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary p-6 rounded-b-[2rem] shadow-lg flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-white/10 rounded-full"
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else setLocation("/bill-center");
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-primary-foreground text-2xl font-bold tracking-tight">
            สร้างบิลใหม่
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            ขั้นตอนที่ {step} จาก 3
          </p>
        </div>
      </div>

      <div className="px-4 -mt-6">
        {step === 1 && (
          <div className="space-y-4">
            <Card className="border-none shadow-sm rounded-3xl bg-background">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ReceiptText className="w-5 h-5 text-primary" />
                  รายละเอียดบิล
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bill-title">ชื่อบิล / โอกาส</Label>
                  <Input
                    id="bill-title"
                    placeholder="เช่น ค่าอาหารมื้อค่ำ, ทริปหัวหิน"
                    className="h-12 rounded-xl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-background">
              <CardHeader>
                <CardTitle className="text-lg">รายการค่าใช้จ่าย</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder="รายการ"
                      className="h-10 rounded-lg"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Input
                      type="number"
                      placeholder="ราคา"
                      className="h-10 rounded-lg"
                      value={itemAmount}
                      onChange={(e) => setItemAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddItem}
                    size="icon" 
                    className="h-10 w-10 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2 mt-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.amount.toLocaleString()} บาท</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {items.length > 0 && (
                    <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/10 mt-4">
                      <span className="font-bold text-primary">ยอดรวมทั้งหมด</span>
                      <span className="font-bold text-xl text-primary">
                        {totalAmount.toLocaleString()} บาท
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button
                disabled={!title || items.length === 0}
                onClick={() => setStep(2)}
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex gap-2"
              >
                ต่อไป: เลือกผู้ร่วมหาร
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card className="border-none shadow-sm rounded-3xl bg-background p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-xl mb-2">เลือกเพื่อน</CardTitle>
              <p className="text-muted-foreground mb-6">
                ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา (Integration กับ LINE)
              </p>
              <Button onClick={() => setStep(3)} className="w-full h-12 rounded-xl">
                ข้ามไปขั้นตอนถัดไป (Demo)
              </Button>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <Card className="border-none shadow-sm rounded-3xl bg-background p-8">
               <CardTitle className="mb-4">สรุปบิล</CardTitle>
               <p className="text-2xl font-bold text-primary mb-2">{title}</p>
               <p className="text-4xl font-black mb-6">{totalAmount.toLocaleString()} บาท</p>
               <Button 
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full h-14 rounded-2xl font-bold text-lg bg-green-500 hover:bg-green-600 border-none shadow-lg shadow-green-500/20"
              >
                {isSubmitting ? "กำลังบันทึก..." : "ส่งบิลเข้ากลุ่ม"}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBill;
