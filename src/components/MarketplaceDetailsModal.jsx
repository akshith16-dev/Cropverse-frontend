import { Heart, Phone, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const value = (item, keys, fallback = "Not available") => keys.map((key) => item?.[key]).find((entry) => entry !== undefined && entry !== null && entry !== "") ?? fallback;
const dateTime = (date) => {
  if (!date || date === "Not available") return "Not available";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleString();
};

export default function MarketplaceDetailsModal({ crop, onClose }) {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("cropverse-wishlist") || "[]"));
  const isSaved = saved.includes(crop?.id);
  useEffect(() => { const closeOnEscape = (event) => event.key === "Escape" && onClose(); window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, [onClose]);
  if (!crop) return null;
  function toggleWishlist() { const next = isSaved ? saved.filter((id) => id !== crop.id) : [...saved, crop.id]; setSaved(next); localStorage.setItem("cropverse-wishlist", JSON.stringify(next)); }
  const farmer = crop.farmer || crop.farmer_details || crop.owner || {};
  const farmerName = value(crop, ["farmer_name", "owner_name"], value(farmer, ["name", "user_name"]));
  const farmerPhone = value(crop, ["farmer_phone", "phone", "contact"], value(farmer, ["phone", "contact"]));
  const farmerEmail = value(crop, ["farmer_email", "email"], value(farmer, ["email"]));
  const details = [["Crop name", value(crop, ["crop_name", "name"], "Crop name not supplied")], ["Growth stage", value(crop, ["growth_stage"])], ["Quantity available", `${value(crop, ["quantity_kg"], 0)} kg`], ["Sowing date", value(crop, ["sowing_date"])], ["Expected harvest", value(crop, ["expected_harvest", "harvest_date"])], ["Farmer", farmerName], ["Village", value(crop, ["farmer_village", "village"], value(farmer, ["village"]))], ["District", value(crop, ["farmer_district", "district"], value(farmer, ["district"]))], ["Current price", value(crop, ["price_per_kg", "current_price"], "Price on request")], ["Last updated", dateTime(value(crop, ["updated_at", "created_at", "added_at"]))], ["Availability", value(crop, ["availability_status", "status"], "Available")]];
  const hasFarmerContact = farmerPhone !== "Not available" || farmerEmail !== "Not available";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onMouseDown={onClose}><div role="dialog" aria-modal="true" aria-label="Marketplace crop details" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-emerald-400">Marketplace crop</p><h2 className="mt-1 text-2xl font-bold capitalize">🌾 {value(crop, ["crop_name", "name"], `${value(crop, ["growth_stage"])} crop`)}</h2></div><button onClick={onClose} aria-label="Close crop details" className="rounded-xl p-2 hover:bg-white/10"><X /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{details.map(([label, content]) => <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 break-words font-medium capitalize">{label === "Current price" && String(content).match(/^\d/) ? `₹${content}/kg` : content}</p></div>)}</div><div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Notes</p><p className="mt-1 text-slate-200">{value(crop, ["notes", "description"], "No notes provided by the farmer.")}</p></div>{contactOpen && <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"><p className="font-medium">Contact farmer</p><p className="mt-1 text-sm text-slate-300">{farmerName}</p>{farmerPhone !== "Not available" && <p className="mt-1 text-sm text-slate-300">Phone: {farmerPhone}</p>}{farmerEmail !== "Not available" && <a className="mt-1 block text-sm text-emerald-300 hover:text-emerald-200" href={`mailto:${farmerEmail}`}>Email: {farmerEmail}</a>}</div>}<div className="mt-6 grid gap-3 sm:grid-cols-3"><button onClick={() => navigate("/shop/orders", { state: { crop } })} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium hover:bg-emerald-500"><ShoppingCart size={18}/>Place order</button><button disabled={!hasFarmerContact} title={hasFarmerContact ? "" : "Farmer contact is not included in the marketplace response"} onClick={() => setContactOpen((open) => !open)} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"><Phone size={18}/>Contact</button><button onClick={toggleWishlist} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 ${isSaved ? "border-pink-400 bg-pink-500/10 text-pink-300" : "border-white/10 hover:bg-white/10"}`}><Heart size={18} fill={isSaved ? "currentColor" : "none"}/>{isSaved ? "Saved" : "Wishlist"}</button></div></div></div>;
}
