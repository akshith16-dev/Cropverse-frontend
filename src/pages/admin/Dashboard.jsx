import { useEffect, useState } from "react";

import SupplyDemandChart from "../../components/dashboard/SupplyDemandChart";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import StatCard from "../../components/dashboard/StatCard";
import SupplyDemandMeter from "../../components/SupplyDemandMeter";

import api from "../../api";

import {
  Users,
  Store,
  Sprout,
  ShoppingCart,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    farmers: 0,
    shops: 0,
    crops: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [
        farmersRes,
        shopsRes,
        cropsRes,
        ordersRes,
      ] = await Promise.all([
        api.get("/farmers/"),
        api.get("/shops/"),
        api.get("/crops/"),
        api.get("/orders/"),
      ]);

      setStats({
        farmers: farmersRes.data.length,
        shops: shopsRes.data.length,
        crops: cropsRes.data.length,
        orders: ordersRes.data.length,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading dashboard...
        </div>
    );
  }

  if (error) {
    return (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 min-w-0">
        <h1 className="break-words text-4xl font-bold leading-tight sm:text-5xl">
          Admin Control Center 🌾
        </h1>

        <p className="mt-3 text-slate-400">
          Monitor farmers, shops, crops and marketplace activity.
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-xl font-semibold">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-slate-400">
          Track platform performance, monitor crop activity,
          and manage the agricultural ecosystem from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Farmers"
          value={stats.farmers}
          color="text-emerald-400"
          icon={Users}
          subtitle="Registered farmers"
        />

        <StatCard
          title="Shops"
          value={stats.shops}
          color="text-blue-400"
          icon={Store}
          subtitle="Active buyers"
        />

        <StatCard
          title="Crops"
          value={stats.crops}
          color="text-yellow-400"
          icon={Sprout}
          subtitle="Available crops"
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          color="text-pink-400"
          icon={ShoppingCart}
          subtitle="Marketplace orders"
        />
      </div>

      {/* Insights */}
      <div className="grid min-w-0 gap-6 mt-8 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl mb-3">🌾</div>

          <h3 className="font-semibold">
            Ecosystem Participants
          </h3>

          <p className="mt-2 text-slate-400">
            {stats.farmers + stats.shops} active users
            participating in Cropverse.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl mb-3">📦</div>

          <h3 className="font-semibold">
            Marketplace Activity
          </h3>

          <p className="mt-2 text-slate-400">
            {stats.orders} marketplace orders processed.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl mb-3">📈</div>

          <h3 className="font-semibold">
            Crop Trends
          </h3>

          <p className="mt-2 text-slate-400">
            Monitor supply-demand balance and crop
            performance.
          </p>
        </div>
      </div>
      <div className="mt-6"><SupplyDemandMeter /></div>

      {/* Analytics */}
      <div className="grid min-w-0 gap-6 mt-8 md:grid-cols-3">
        <div className="min-w-0 md:col-span-2">
          <SupplyDemandChart />
        </div>

        <ActivityFeed />
      </div>
    </>
  );
}
