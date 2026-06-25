import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../api";
import FarmerMap from "../../components/FarmerMap";

function ChartBox({ title, empty, children }) {
  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="h-72 min-h-60 min-w-0">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-slate-900/60 text-slate-400">No data yet.</div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");
      const { data: result } = await api.get("/analytics/admin");
      setData(result || {});
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading analytics...</div>;

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        <p>{error}</p>
        <button onClick={loadAnalytics} className="mt-4 rounded-xl bg-red-500 px-4 py-2 font-medium text-white">Retry</button>
      </div>
    );
  }

  const supplyDemand = data?.supply_demand || [];
  const revenue = data?.revenue || [];
  const cropDistribution = data?.crop_distribution || [];
  const farmerGrowth = data?.farmer_growth || [];
  const highDemand = data?.high_demand || [];
  const aiInsights = data?.ai_insights || {};

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Platform Analytics</h1>
        <p className="mt-2 text-slate-400">Live supply, demand, revenue, crops, and farmer growth.</p>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <ChartBox title="High demand crops" empty={!highDemand.length}>
          <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={240}>
            <BarChart data={highDemand}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="crop_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity_kg" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Supply vs demand" empty={!supplyDemand.length}>
          <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={240}>
            <BarChart data={supplyDemand}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="supply" fill="#34d399" />
              <Bar dataKey="demand" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Revenue" empty={!revenue.length}>
          <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={240}>
            <LineChart data={revenue}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#fbbf24" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Crop distribution" empty={!cropDistribution.length}>
          <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={240}>
            <PieChart>
              <Pie data={cropDistribution} dataKey="value" nameKey="name" fill="#34d399" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Farmer growth" empty={!farmerGrowth.length}>
          <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={240}>
            <LineChart data={farmerGrowth}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="farmers" stroke="#a78bfa" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold">AI Insights</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-slate-900/70 p-4">
            <p className="mb-3 font-medium text-emerald-300">Most recommended crops</p>
            {(aiInsights.most_recommended_crops || []).slice(0, 4).map((item) => (
              <p key={item.crop_name} className="border-b border-white/10 py-2 text-sm text-slate-300">{item.crop_name} - {item.count}</p>
            ))}
            {!aiInsights.most_recommended_crops?.length && <p className="text-sm text-slate-400">No recommendations yet.</p>}
          </div>
          <div className="rounded-2xl bg-slate-900/70 p-4">
            <p className="mb-3 font-medium text-orange-300">Highest demand crops</p>
            {(aiInsights.highest_demand_crops || []).slice(0, 4).map((item) => (
              <p key={`${item.crop_name}-${item.status}`} className="border-b border-white/10 py-2 text-sm text-slate-300">{item.crop_name} - {item.quantity_kg} kg</p>
            ))}
            {!aiInsights.highest_demand_crops?.length && <p className="text-sm text-slate-400">No demand signals yet.</p>}
          </div>
          <div className="rounded-2xl bg-slate-900/70 p-4">
            <p className="mb-3 font-medium text-amber-300">Most profitable crops</p>
            {(aiInsights.most_profitable_crops || []).slice(0, 4).map((item) => (
              <p key={item.crop_name} className="border-b border-white/10 py-2 text-sm text-slate-300">{item.crop_name} - ₹{Math.round(item.expected_profit || 0).toLocaleString("en-IN")}</p>
            ))}
            {!aiInsights.most_profitable_crops?.length && <p className="text-sm text-slate-400">No profit signals yet.</p>}
          </div>
          <div className="rounded-2xl bg-slate-900/70 p-4">
            <p className="mb-3 font-medium text-sky-300">Crop rotation trends</p>
            {(aiInsights.crop_rotation_trends || []).slice(0, 4).map((item) => (
              <p key={item.crop_name} className="border-b border-white/10 py-2 text-sm text-slate-300">{item.crop_name} - {item.count}</p>
            ))}
            {!aiInsights.crop_rotation_trends?.length && <p className="text-sm text-slate-400">No rotation trends yet.</p>}
          </div>
        </div>
      </section>

      <div className="mt-6">
        <FarmerMap />
      </div>
    </div>
  );
}
