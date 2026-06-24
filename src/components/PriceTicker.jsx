import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import api from "../api";

export default function PriceTicker() {
  const [prices, setPrices] = useState([]);
  useEffect(() => { api.get("/prices/").then(({ data }) => setPrices(data.slice(0, 8))).catch(() => {}); }, []);
  useWebSocket("/ws/prices", (event) => {
    if (event.price) setPrices((previous) => [event.price, ...previous.filter((price) => price.id !== event.price.id)].slice(0, 8));
  });
  if (!prices.length) return null;
  return <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-2 text-sm"><div className="flex w-max animate-[pulse_3s_ease-in-out_infinite] gap-8 px-4">{prices.map((price) => <span key={price.id} className="whitespace-nowrap text-emerald-100">{price.market_name}: <b>₹{price.price_per_kg}/kg</b></span>)}</div></div>;
}
