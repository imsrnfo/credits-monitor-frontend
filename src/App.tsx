import { Routes, Route } from "react-router-dom";
import MessagesChart from "./pages/Charts/MessagesChart";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import ServerCheck from "./components/ServerCheck";
import ServerOffline from "./pages/ServerOffline";
import Loading from "./pages/Loading";
import InstallmentsChart from "./pages/Charts/InstallmentsChart";
import PaymentsChart from "./pages/Charts/PaymentsChart";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ServerCheck>
        <Routes>
          <Route path="/server-offline" element={<ServerOffline />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/messages" element={<MessagesChart />} />
              <Route path="/installments" element={<InstallmentsChart />} />
              <Route path="/payments" element={<PaymentsChart />} />
            </Route>
          </Route>
        </Routes>
      </ServerCheck>
    </>
  );
}
