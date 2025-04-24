import { Routes, Route } from "react-router-dom";
import BarChart from "./pages/Charts/BarChart";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/messages" element={<BarChart />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
