import { useEffect, useMemo, useState } from "react";
import { Bot, ClipboardCheck, RefreshCcw, Sparkles, Target } from "lucide-react";
import api from "../../api";
import RecommendationCard from "../../components/RecommendationCard";

export default function AIPlanning() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      const [farmersRes, historyRes] = await Promise.all([
        api.get("/farmers/"),
        api.get("/ai/recommendations"),
      ]);
      setFarmers(farmersRes.data || []);
      setHistory(historyRes.data || []);
      if (farmersRes.data?.[0]) setSelectedFarmerId(farmersRes.data[0].id);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to load AI planning data.");
    } finally {
      setLoading(false);
    }
  }

  async function runAction(action) {
    if (!selectedFarmerId) {
      setMessage("Select a farmer first.");
      return;
    }
    try {
      setWorking(action);
      setMessage("");
      if (action === "recommend") {
        const { data } = await api.post(`/ai/recommend-crops/${selectedFarmerId}`);
        setRecommendations(data || []);
        setHistory((prev) => [...(data || []), ...prev]);
        setMessage("AI crop recommendations generated.");
      }
      if (action === "rotation") {
        const { data } = await api.post(`/ai/crop-rotation/${selectedFarmerId}`);
        setRecommendations([data]);
        setHistory((prev) => [data, ...prev]);
        setMessage("Crop rotation suggestion generated.");
      }
      if (action === "auto") {
        const { data } = await api.post(`/ai/auto-assign/${selectedFarmerId}`);
        setRecommendations([data.recommendation]);
        setHistory((prev) => [data.recommendation, ...prev]);
        setMessage(data.message || "AI assignment created.");
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "AI planning action failed.");
    } finally {
      setWorking("");
    }
  }

  const selectedFarmer = useMemo(
    () => farmers.find((farmer) => farmer.id === selectedFarmerId),
    [farmers, selectedFarmerId]
  );

  const highDemand = history
    .filter((item) => item.reasons?.includes("High demand"))
    .slice(0, 4);
  const marketOpportunities = history
    .filter((item) => item.reasons?.includes("Good market prices") || item.reasons?.includes("High expected profit"))
    .slice(0, 4);

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading AI Planning Center...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">AI Planning Center</h1>
        <p className="mt-2 text-slate-400">Recommend crops, create AI-approved assignments, and plan rotations from demand and price signals.</p>
      </div>

      {message && <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100">{message}</div>}

      <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Farmer</label>
            <select
              value={selectedFarmerId}
              onChange={(event) => setSelectedFarmerId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            >
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name} - {farmer.district} - {farmer.soil_type}
                </option>
              ))}
            </select>
            {selectedFarmer && (
              <p className="mt-3 text-sm text-slate-400">
                {selectedFarmer.land_acres} acres in {selectedFarmer.village}, {selectedFarmer.district}
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <button onClick={() => runAction("recommend")} disabled={!!working} className="rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 disabled:opacity-60">
              <Sparkles className="mr-2 inline" size={18} />
              Recommend
            </button>
            <button onClick={() => runAction("auto")} disabled={!!working} className="rounded-xl bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-500 disabled:opacity-60">
              <ClipboardCheck className="mr-2 inline" size={18} />
              Auto Assign
            </button>
            <button onClick={() => runAction("rotation")} disabled={!!working} className="rounded-xl bg-amber-600 px-4 py-3 font-medium text-white hover:bg-amber-500 disabled:opacity-60">
              <RefreshCcw className="mr-2 inline" size={18} />
              Rotation
            </button>
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-semibold">Crop Recommendations</h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {recommendations.map((item) => <RecommendationCard key={item.id || item.crop_id} recommendation={item} />)}
            {!recommendations.length && <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-400">Run AI recommendations to see the top crops for this farmer.</div>}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">Planning Signals</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <Bot className="mb-2 text-emerald-300" size={22} />
              <p className="font-medium">Auto Assignments</p>
              <p className="mt-1 text-sm text-slate-400">Creates a pending assignment from the best AI recommendation.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <RefreshCcw className="mb-2 text-amber-300" size={22} />
              <p className="font-medium">Crop Rotation Suggestions</p>
              <p className="mt-1 text-sm text-slate-400">Prioritizes soil-restoring crop changes after harvest.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <Target className="mb-2 text-sky-300" size={22} />
              <p className="font-medium">Market Opportunities</p>
              <p className="mt-1 text-sm text-slate-400">Demand and prices lift recommendation confidence.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 text-xl font-semibold">High Demand Crops</h2>
          {highDemand.map((item) => <p key={`${item.id}-demand`} className="border-b border-white/10 py-2 text-slate-300">{item.crop}</p>)}
          {!highDemand.length && <p className="text-slate-400">High-demand recommendations will appear here.</p>}
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 text-xl font-semibold">Market Opportunities</h2>
          {marketOpportunities.map((item) => <p key={`${item.id}-market`} className="border-b border-white/10 py-2 text-slate-300">{item.crop} - ₹{Math.round(item.expected_profit || 0).toLocaleString("en-IN")}</p>)}
          {!marketOpportunities.length && <p className="text-slate-400">Profitable recommendations will appear here.</p>}
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 text-xl font-semibold">Recommendation History</h2>
          <div className="max-h-72 overflow-auto pr-1">
            {history.slice(0, 10).map((item) => (
              <div key={item.id} className="mb-2 rounded-xl bg-slate-900/70 p-3">
                <p className="font-medium">{item.crop}</p>
                <p className="text-sm text-slate-400">{item.recommendation_type?.replaceAll("_", " ")} - {Math.round((item.confidence || 0) * 100)}%</p>
              </div>
            ))}
            {!history.length && <p className="text-slate-400">No recommendation history yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
