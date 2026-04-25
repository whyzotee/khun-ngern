import { Route, Switch } from "wouter";
import IndexPage from "@/pages/IndexPage";
import BillCenter from "@/pages/BillCenter";
import AccountManagement from "@/pages/AccountManagement";
import ErrorPage from "@/pages/ErrorPage";
import LineGuard from "@/components/LineGuard";

function App() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/error">
        <ErrorPage />
      </Route>

      {/* Main Features */}
      <Route path="/bill-center">
        <LineGuard>
          <BillCenter />
        </LineGuard>
      </Route>

      <Route path="/account-management">
        <LineGuard>
          <AccountManagement />
        </LineGuard>
      </Route>

      <Route>
        <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">404</h1>
          <p className="text-xl font-bold text-gray-800">
            ไม่พบหน้าที่คุณต้องการ
          </p>
          <p className="mt-2 text-gray-500">
            ขออภัย หน้าที่คุณพยายามเข้าถึงไม่มีอยู่จริง
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-8 bg-line text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-line/20"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
