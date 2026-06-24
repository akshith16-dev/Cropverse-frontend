import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import api from "../api";

export default function SupplyDemandMeter() {
  const [item, setItem] = useState(null);
  useEffect(() => { api.get("/analytics/admin").then(({ data }) => setItem(data.supply_demand?.[0] || null)).catch(() => {}); }, []);
  useWebSocket("/ws/supply-demand", (event) => { if (event.supply !== undefined) setItem({ crop: event.crop, supply: event.supply, demand: event.demand }); });
  if (!item) return <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-400">Supply-demand data will appear as crops are assigned.</div>;
  const percentage = Math.min(100, Math.round((item.supply / Math.max(item.demand, 1)) * 100));
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="flex justify-between"><b>{item.crop}</b><span className="text-slate-400">{item.supply} / {item.demand} kg</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className={`${item.supply > item.demand ? "bg-red-400" : "bg-emerald-400"} h-full`} style={{ width: `${Math.min(percentage, 100)}%` }} /></div><p className="mt-2 text-sm text-slate-400">Live supply compared with demand</p></div>;
}
