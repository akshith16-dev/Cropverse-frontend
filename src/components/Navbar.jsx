import {
  Bell,
  Search,
  UserCircle,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import SearchModal from "./SearchModal";
import useWebSocket from "../hooks/useWebSocket";

function getStoredUserId() {
  const stored = localStorage.getItem("user_id");
  if (stored) return stored;
  try {
    const payload = localStorage.getItem("token")?.split(".")[1];
    return payload ? JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))).sub : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role") || "user";

  const userName =
    localStorage.getItem("user_name") || "User";
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");
  const userId = getStoredUserId();

  useEffect(() => {
    let active = true;
    api.get("/notifications/").then((res) => {
      if (active) setUnreadCount((res.data || []).filter((item) => !item.is_read).length);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useWebSocket(userId && token ? `/ws/notifications/${userId}?token=${encodeURIComponent(token)}` : null, (event) => {
    if (event.notification && !event.notification.is_read) {
      setUnreadCount((count) => count + 1);
    }
  });

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("email");

    navigate("/login");
  }

  function getTitle() {
    switch (role) {
      case "admin":
        return "Admin Dashboard";

      case "farmer":
        return "Farmer Dashboard";

      case "shop":
        return "Shop Dashboard";

      default:
        return "Cropverse";
    }
  }

  return (
    <header
      className="
        h-20
        relative
        px-6 lg:px-8
        flex
        items-center
        justify-between
        border-b
        border-white/10
        bg-slate-900/40
        backdrop-blur-xl
      "
    >
      {/* Left */}
      <div className="pl-10 lg:pl-0">
        <h2 className="text-2xl font-bold text-white">
          {getTitle()}
        </h2>

        <p className="text-sm text-slate-400">
          Welcome to Cropverse 🌾
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <button onClick={() => setSearchOpen(true)} aria-label="Search Cropverse"
          className="
            p-2
            rounded-xl
            hover:bg-white/10
            transition
          "
        >
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button onClick={() => navigate("/notifications")} aria-label="View notifications"
          className="
            relative
            p-2
            rounded-xl
            hover:bg-white/10
            transition
          "
        >
          <Bell size={20} />

          {unreadCount > 0 && <span
            className="
              absolute
              -top-1
              -right-1
              h-4
              w-4
              rounded-full
              bg-red-500
              text-[10px]
              flex
              items-center
              justify-center
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
          }
        </button>

        {/* User */}
        <button onClick={() => setProfileOpen((open) => !open)}
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-white/5
          "
        >
          <UserCircle
            size={30}
            className="text-emerald-400"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {userName}
            </span>

            <span className="text-xs text-slate-400 capitalize">
              {role}
            </span>
          </div>
        </button>

        {profileOpen && <div className="absolute right-20 top-16 z-30 w-60 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl"><div className="border-b border-white/10 px-3 pb-3"><p className="font-medium">{userName}</p><p className="mt-1 truncate text-xs text-slate-400">{localStorage.getItem("email") || "Email not available"}</p><p className="mt-1 text-xs capitalize text-emerald-400">{role}</p></div><button onClick={() => { navigate("/profile"); setProfileOpen(false); }} className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10">View profile</button><button onClick={logout} className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10">Logout</button></div>}

        {/* Logout */}
        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-red-500/10
            text-red-400
            hover:bg-red-500/20
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
