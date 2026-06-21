import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const links = [
  ["My Crops", "Farmer crop assignments and growth", "/farmer/crops", "farmer"], ["Marketplace", "Browse available marketplace crops", "/shop/marketplace", "shop"], ["Demand", "Create and review demand requests", "/shop/demand", "shop"], ["Orders", "View shop orders", "/shop/orders", "shop"], ["Notifications", "View platform notifications", "/notifications"], ["Cropverse AI", "Ask the Cropverse assistant", "/chatbot"], ["Farmers", "Platform farmer directory", "/admin/dashboard", "admin"], ["Shops", "Manage registered shops", "/admin/shops", "admin"], ["Orders", "Platform order overview", "/admin/dashboard", "admin"]
];
export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate(); const [query, setQuery] = useState(""); const [records, setRecords] = useState([]); const role = localStorage.getItem("role");
  useEffect(() => { if (open) setQuery(""); }, [open]);
  useEffect(() => {
    if (!open) return;
    const requests = role === "admin"
      ? [["Farmers", "/farmers/", "/admin/dashboard"], ["Shops", "/shops/", "/admin/shops"], ["Crops", "/crops/", "/admin/dashboard"], ["Orders", "/orders/", "/admin/dashboard"]]
      : role === "shop"
      ? [["Marketplace crop", "/baby-crops/marketplace", "/shop/marketplace"], ["Demand", "/demand/me", "/shop/demand"], ["Order", "/orders/me", "/shop/orders"]]
      : [["My crop", "/baby-crops/", "/farmer/crops"]];
    let active = true;
    Promise.all(requests.map(async ([type, url, path]) => {
      try { const response = await api.get(url); return (response.data || []).map((item) => ({ type, path, item })); }
      catch { return []; }
    })).then((groups) => { if (active) setRecords(groups.flat()); });
    return () => { active = false; };
  }, [open, role]);
  const results = useMemo(() => links.filter(([title, description,, allowed]) => (!allowed || allowed === role) && `${title} ${description}`.toLowerCase().includes(query.toLowerCase())), [query, role]);
  const recordResults = useMemo(() => records.filter(({ type, item }) => `${type} ${Object.values(item).join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8), [records, query]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 pt-24 backdrop-blur-sm" onMouseDown={onClose}><div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-white/10 pb-3"><Search className="text-emerald-400"/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search crops, shops, orders..." className="min-w-0 flex-1 bg-transparent py-2 outline-none"/><button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10"><X size={18}/></button></div><div className="max-h-80 overflow-auto py-2">{recordResults.map(({ type, item, path }, index) => <button key={`${type}-${item.id || index}`} onClick={() => { navigate(path); onClose(); }} className="w-full rounded-xl p-3 text-left hover:bg-white/10"><p className="font-medium">{type}: {item.user_name || item.crop_name || item.growth_stage || item.email || `#${item.id}`}</p><p className="text-sm text-slate-400">{item.status || item.quantity_kg || item.phone || "Open details"}</p></button>)}{results.map(([title, description, path], index) => <button key={`${title}-${index}`} onClick={() => { navigate(path); onClose(); }} className="w-full rounded-xl p-3 text-left hover:bg-white/10"><p className="font-medium">{title}</p><p className="text-sm text-slate-400">{description}</p></button>)}{!results.length && !recordResults.length && <p className="p-4 text-center text-slate-400">No matching pages found.</p>}</div></div></div>;
}
