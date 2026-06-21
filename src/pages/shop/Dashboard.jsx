import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    marketplace: 0,
    demands: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [marketplaceRes, demandRes, ordersRes] =
        await Promise.all([
          api.get("/baby-crops/marketplace"),
          api.get("/demand/me"),
          api.get("/orders/me"),
        ]);

      setStats({
        marketplace: marketplaceRes.data.length,
        demands: demandRes.data.length,
        orders: ordersRes.data.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Shop Dashboard 🏪
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor marketplace activity,
            demands and orders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-3xl mb-3">🌾</div>

            <p className="text-slate-400">
              Marketplace Crops
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {stats.marketplace}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-3xl mb-3">📦</div>

            <p className="text-slate-400">
              Demand Requests
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {stats.demands}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-3xl mb-3">🛒</div>

            <p className="text-slate-400">
              Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-400">
              {stats.orders}
            </h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Quick Overview
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <button onClick={() => navigate("/shop/marketplace")} className="rounded-2xl bg-slate-900 p-4 text-left hover:bg-slate-800">
              <h3 className="font-medium">
                🌾 Marketplace
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Browse available crops from farmers.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-emerald-400">View Marketplace →</span></button>

            <button onClick={() => navigate("/shop/demand")} className="rounded-2xl bg-slate-900 p-4 text-left hover:bg-slate-800">
              <h3 className="font-medium">
                📦 Demand Requests
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Submit crop demand requirements.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-emerald-400">Create Demand →</span></button>

            <button onClick={() => navigate("/shop/orders")} className="rounded-2xl bg-slate-900 p-4 text-left hover:bg-slate-800">
              <h3 className="font-medium">
                🛒 Orders
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Track purchased crops and deliveries.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-emerald-400">View Orders →</span></button>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Activity Summary
          </h2>

          <div className="space-y-3 text-slate-300">
            <p>
              🌾 Available crops in marketplace:
              {" "}
              {stats.marketplace}
            </p>

            <p>
              📦 Demand requests submitted:
              {" "}
              {stats.demands}
            </p>

            <p>
              🛒 Orders placed:
              {" "}
              {stats.orders}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
