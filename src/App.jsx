import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/common/Profile.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Shops from "./pages/admin/Shops.jsx";
import Assign from "./pages/admin/Assign.jsx";
import Prices from "./pages/admin/Prices.jsx";

import FarmerDashboard from "./pages/farmer/Dashboard.jsx";
import Crops from "./pages/farmer/Crops.jsx";
import Chatbot from "./pages/farmer/Chatbot.jsx";

import ShopDashboard from "./pages/shop/Dashboard.jsx";
import Marketplace from "./pages/shop/Marketplace.jsx";
import Demand from "./pages/shop/Demand.jsx";
import Orders from "./pages/shop/Orders.jsx";

import Notifications from "./pages/common/Notifications.jsx";

const dashboardRoutes = { admin: "/admin/dashboard", farmer: "/farmer/dashboard", shop: "/shop/dashboard" };

function ProtectedLayout({ roles }) {
  const role = localStorage.getItem("role");
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to={dashboardRoutes[role] || "/login"} replace />;
  return <Layout><Outlet /></Layout>;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedLayout roles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/shops" element={<Shops />} />
        <Route path="/admin/assign" element={<Assign />} />
        <Route path="/admin/prices" element={<Prices />} />
      </Route>

      {/* Farmer */}
      <Route element={<ProtectedLayout roles={["farmer"]} />}>
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/crops" element={<Crops />} />
      </Route>

      {/* Shop */}
      <Route element={<ProtectedLayout roles={["shop"]} />}>
        <Route path="/shop/dashboard" element={<ShopDashboard />} />
        <Route path="/shop/marketplace" element={<Marketplace />} />
        <Route path="/shop/demand" element={<Demand />} />
        <Route path="/shop/orders" element={<Orders />} />
      </Route>

      {/* Shared */}
      <Route element={<ProtectedLayout />}>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/farmer/chatbot" element={<Navigate to="/chatbot" replace />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
