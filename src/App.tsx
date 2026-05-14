import { Route, Switch } from "wouter";
import AccountManagement from "@/pages/AccountManagement";
import BillCenter from "@/pages/BillCenter";
import CreateBill from "@/pages/CreateBill";
import ErrorPage from "@/pages/ErrorPage";
import IndexPage from "@/pages/IndexPage";
import LineGuard from "@/components/LineGuard";

function App() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/error">
        <ErrorPage />
      </Route>

      <Route path="/bill-center">
        <LineGuard>
          <BillCenter />
        </LineGuard>
      </Route>

      <Route path="/create-bill">
        <LineGuard>
          <CreateBill />
        </LineGuard>
      </Route>

      <Route path="/account-management">
        <LineGuard>
          <AccountManagement />
        </LineGuard>
      </Route>

      <Route>
        <div className="flex h-screen flex-col items-center justify-center bg-[#f5f7f5] p-8 text-center text-[#15221b]">
          <h1 className="text-5xl font-black text-[#d9e2dc]">404</h1>
          <p className="mt-3 text-xl font-black">ไม่พบหน้าที่คุณต้องการ</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#66736b]">
            ขออภัย หน้านี้อาจถูกย้ายหรือยังไม่ได้เปิดใช้งาน
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-8 rounded-2xl bg-[#0fb85d] px-7 py-3 font-bold text-white shadow-lg shadow-[#0fb85d]/20"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
