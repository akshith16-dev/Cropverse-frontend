import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import useWebSocket from "../../hooks/useWebSocket";

const statuses = ["all", "open", "approved", "planned", "rejected", "fulfilled"];

function statusClass(status) {
  switch (status) {
    case "approved":
      return "bg-emerald-500/20 text-emerald-300";
    case "planned":
      return "bg-blue-500/20 text-blue-300";
    case "rejected":
      return "bg-red-500/20 text-red-300";
    case "fulfilled":
      return "bg-slate-500/20 text-slate-300";
    default:
      return "bg-yellow-500/20 text-yellow-300";
  }
}

export default function DemandManagement() {
  const [demands, setDemands] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDemands();
  }, []);

  useWebSocket("/ws/supply-demand", () => {
    loadDemands();
  });

  async function loadDemands() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/demand/");
      setDemands(data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load demands.");
    } finally {
      setLoading(false);
    }
  }

  async function updateDemand(id, action) {
    try {
      setMessage("");
      await api.put(`/demand/${id}/${action}`);
      setMessage(`Demand marked ${action}.`);
      loadDemands();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Demand action failed.");
    }
  }

  const filteredDemands = useMemo(
    () => demands.filter((demand) => status === "all" || demand.status === status),
    [demands, status]
  );

  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading demands...</div>;

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        <p>{error}</p>
        <button onClick={loadDemands} className="mt-4 rounded-xl bg-red-500 px-4 py-2 font-medium text-white">Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Demand Management</h1>
          <p className="mt-2 text-slate-400">Review shop demand and move requests into assignment planning.</p>
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 md:w-56">
          {statuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {message && <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">{message}</div>}

      {filteredDemands.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-xl font-semibold">No Demand Requests</h2>
          <p className="mt-2 text-slate-400">Demand requests matching this filter will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDemands.map((demand) => (
            <div key={demand.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Demand Request</h2>
                <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusClass(demand.status)}`}>{demand.status}</span>
              </div>
              <div className="mt-5 space-y-2 text-slate-300">
                <p>Quantity: {demand.quantity_kg} kg</p>
                <p>Required by: {demand.required_by}</p>
                <p>Created: {demand.created_at ? new Date(demand.created_at).toLocaleDateString() : "-"}</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <button onClick={() => updateDemand(demand.id, "approve")} disabled={demand.status === "approved"} className="rounded-xl bg-emerald-600 py-2 text-sm font-medium disabled:opacity-40">Approve</button>
                <button onClick={() => updateDemand(demand.id, "reject")} disabled={demand.status === "rejected"} className="rounded-xl bg-red-600 py-2 text-sm font-medium disabled:opacity-40">Reject</button>
                <button onClick={() => updateDemand(demand.id, "planned")} disabled={demand.status === "planned"} className="rounded-xl bg-blue-600 py-2 text-sm font-medium disabled:opacity-40">Planned</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
