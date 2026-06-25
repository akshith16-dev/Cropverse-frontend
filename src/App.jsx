import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";

const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Profile = lazy(() => import("./pages/common/Profile.jsx"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminFarmers = lazy(() => import("./pages/admin/Farmers.jsx"));
const Shops = lazy(() => import("./pages/admin/Shops.jsx"));
const AdminCrops = lazy(() => import("./pages/admin/Crops.jsx"));
const Assign = lazy(() => import("./pages/admin/Assign.jsx"));
const DemandManagement = lazy(() => import("./pages/admin/DemandManagement.jsx"));
const Prices = lazy(() => import("./pages/admin/Prices.jsx"));
const Analytics = lazy(() => import("./pages/admin/Analytics.jsx"));
const AIPlanning = lazy(() => import("./pages/admin/AIPlanning.jsx"));

const FarmerDashboard = lazy(() => import("./pages/farmer/Dashboard.jsx"));
const Crops = lazy(() => import("./pages/farmer/Crops.jsx"));
const Chatbot = lazy(() => import("./pages/farmer/Chatbot.jsx"));
const AdvancedAdvisor = lazy(() => import("./pages/farmer/AdvancedAdvisor.jsx"));
const FarmerOrders = lazy(() => import("./pages/farmer/Orders.jsx"));

const ShopDashboard = lazy(() => import("./pages/shop/Dashboard.jsx"));
const Marketplace = lazy(() => import("./pages/shop/Marketplace.jsx"));
const Demand = lazy(() => import("./pages/shop/Demand.jsx"));
const Orders = lazy(() => import("./pages/shop/Orders.jsx"));

const Notifications = lazy(() => import("./pages/common/Notifications.jsx"));

const dashboardRoutes = { admin: "/admin/dashboard", farmer: "/farmer/dashboard", shop: "/shop/dashboard" };

function ProtectedLayout({ roles }) {
  const role = localStorage.getItem("role");
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to={dashboardRoutes[role] || "/login"} replace />;
  return <Layout><Outlet /></Layout>;
}

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-6 text-slate-100">Loading Cropverse...</div>}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedLayout roles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/farmers" element={<AdminFarmers />} />
        <Route path="/admin/shops" element={<Shops />} />
        <Route path="/admin/crops" element={<AdminCrops />} />
        <Route path="/admin/assign" element={<Assign />} />
        <Route path="/admin/demand" element={<DemandManagement />} />
        <Route path="/admin/prices" element={<Prices />} />
        <Route path="/admin/ai-planning" element={<AIPlanning />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>

      {/* Farmer */}
      <Route element={<ProtectedLayout roles={["farmer"]} />}>
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/crops" element={<Crops />} />
        <Route path="/farmer/advisor" element={<AdvancedAdvisor />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
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
    </Suspense>
  );
}

export default App;
