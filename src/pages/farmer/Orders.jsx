import { useEffect, useState } from "react";
import api from "../../api";
import useWebSocket from "../../hooks/useWebSocket";

function statusClass(status) {
  switch (status) {
    case "confirmed":
      return "bg-blue-500/20 text-blue-300";
    case "dispatched":
      return "bg-purple-500/20 text-purple-300";
    case "delivered":
      return "bg-emerald-500/20 text-emerald-300";
    case "rejected":
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-yellow-500/20 text-yellow-300";
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  useWebSocket("/ws/marketplace", () => {
    loadOrders();
  });

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/orders/me");
      setOrders(data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load farmer orders.");
    } finally {
      setLoading(false);
    }
  }

  async function updateOrder(id, action) {
    try {
      setMessage("");
      await api.put(`/orders/${id}/${action}`);
      setMessage(`Order ${action} action completed.`);
      loadOrders();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Order action failed.");
    }
  }

  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading orders...</div>;

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        <p>{error}</p>
        <button onClick={loadOrders} className="mt-4 rounded-xl bg-red-500 px-4 py-2 font-medium text-white">Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Crop Orders</h1>
        <p className="mt-2 text-slate-400">Accept, reject, dispatch, and deliver orders placed against your crops.</p>
      </div>

      {message && <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">{message}</div>}

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-xl font-semibold">No Orders Found</h2>
          <p className="mt-2 text-slate-400">Shop orders for your crops will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Order</h2>
                <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusClass(order.status)}`}>{order.status}</span>
              </div>
              <div className="mt-5 space-y-3 text-slate-300">
                <p>Quantity: {order.quantity_kg} kg</p>
                <p>Price: ₹{order.price_per_kg}/kg</p>
                <p>Type: {order.order_type}</p>
                <p>Ordered: {order.ordered_at ? new Date(order.ordered_at).toLocaleDateString() : "-"}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <>
                    <button onClick={() => updateOrder(order.id, "accept")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium">Accept</button>
                    <button onClick={() => updateOrder(order.id, "reject")} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium">Reject</button>
                  </>
                )}
                {order.status === "confirmed" && (
                  <button onClick={() => updateOrder(order.id, "dispatch")} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium">Dispatch</button>
                )}
                {order.status === "dispatched" && (
                  <button onClick={() => updateOrder(order.id, "deliver")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium">Delivered</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
