import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";

export default function FarmerMap() {
  const [farmers, setFarmers] = useState([]); const [district, setDistrict] = useState("");
  useEffect(() => { api.get("/farmers/").then(({ data }) => setFarmers(data.filter((farmer) => farmer.latitude && farmer.longitude))).catch(() => {}); }, []);
  const districts = useMemo(() => [...new Set(farmers.map((farmer) => farmer.district))], [farmers]);
  const visible = farmers.filter((farmer) => !district || farmer.district === district);
  return <section className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">Farmer locations</h2><p className="text-sm text-slate-400">Marker intensity reflects land area.</p></div><select value={district} onChange={(event) => setDistrict(event.target.value)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm"><option value="">All districts</option>{districts.map((name) => <option key={name}>{name}</option>)}</select></div><div className="h-80 overflow-hidden rounded-2xl">{visible.length ? <MapContainer center={[visible[0].latitude, visible[0].longitude]} zoom={7} className="h-full w-full"><TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{visible.map((farmer) => <CircleMarker key={farmer.id} center={[farmer.latitude, farmer.longitude]} radius={Math.max(6, Math.min(18, farmer.land_acres * 2))} pathOptions={{ color: "#34d399" }}><Popup><b>{farmer.name}</b><br />{farmer.village}, {farmer.district}<br />{farmer.land_acres} acres</Popup></CircleMarker>)}</MapContainer> : <div className="grid h-full place-items-center bg-slate-900/60 text-slate-400">Add farmer coordinates to display the map.</div>}</div></section>;
}
