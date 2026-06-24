import {
  LayoutDashboard,
  Store,
  Sprout,
  Bell,
  Bot,
  BarChart3,
  Package,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const roleMenus = {
  admin: [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: Sprout,
      label: "Farmers",
      path: "/admin/farmers",
    },
    {
      icon: Store,
      label: "Shops",
      path: "/admin/shops",
    },
    {
      icon: Sprout,
      label: "Crops",
      path: "/admin/crops",
    },
    {
      icon: ClipboardList,
      label: "Assign",
      path: "/admin/assign",
    },
    {
      icon: Package,
      label: "Demand",
      path: "/admin/demand",
    },
    {
      icon: BarChart3,
      label: "Prices",
      path: "/admin/prices",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
    },
    {
      icon: Bot,
      label: "Cropverse AI",
      path: "/chatbot",
    },
  ],

  farmer: [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/farmer/dashboard",
    },
    {
      icon: Sprout,
      label: "My Crops",
      path: "/farmer/crops",
    },
    {
      icon: Bot,
      label: "Advisor",
      path: "/farmer/advisor",
    },
    {
      icon: Bot,
      label: "Chatbot",
      path: "/chatbot",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/farmer/orders",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
    },
  ],

  shop: [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/shop/dashboard",
    },
    {
      icon: Store,
      label: "Marketplace",
      path: "/shop/marketplace",
    },
    {
      icon: Package,
      label: "Demand",
      path: "/shop/demand",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/shop/orders",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
    },
    {
      icon: Bot,
      label: "Cropverse AI",
      path: "/chatbot",
    },
  ],
};

export default function Sidebar({ className = "" }) {
  const role = localStorage.getItem("role");

  const menu = roleMenus[role] || [];

  return (
    <aside
      className={`
        w-72
        min-h-screen
        bg-slate-900/70
        backdrop-blur-xl
        border-r
        border-emerald-500/20
        flex
        flex-col
        px-5
        py-6
        ${className}
      `}
    >
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-emerald-400">
          🌾 Cropverse
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Smart Agriculture Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition-all
                duration-300

                ${
                  isActive
                    ? "bg-emerald-500/20 text-white border border-emerald-500/30"
                    : "text-slate-300 hover:bg-emerald-500/10 hover:text-white hover:translate-x-1"
                }
              `
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Card */}
      <div className="mt-auto">
        <NavLink to="/chatbot"
          className="
            p-4
            rounded-2xl
            bg-emerald-500/10
            border
            border-emerald-500/20
          "
        >
          <h3 className="font-semibold">
            Cropverse AI
          </h3>

          <p className="text-sm text-slate-400 mt-2">
            Smart farming assistant powered by AI.
          </p>
        </NavLink>
      </div>
    </aside>
  );
}
