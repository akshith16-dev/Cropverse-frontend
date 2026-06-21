import { useEffect, useState } from "react";
import api from "../../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const res = await api.get("/orders/me");

      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500/20 text-green-400";

      case "confirmed":
        return "bg-blue-500/20 text-blue-400";

      case "dispatched":
        return "bg-purple-500/20 text-purple-400";

      case "cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            My Orders 📦
          </h1>

          <p className="mt-2 text-slate-400">
            Track and manage all your crop purchases.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            Loading orders...
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">📭</div>

            <h2 className="text-xl font-semibold">
              No Orders Found
            </h2>

            <p className="mt-2 text-slate-400">
              Your marketplace orders will appear here.
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && orders.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition hover:border-green-500/40"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">
                    Order
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Quantity
                    </span>

                    <span>
                      {order.quantity_kg} kg
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Price
                    </span>

                    <span>
                      ₹{order.price_per_kg}/kg
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Order Type
                    </span>

                    <span className="capitalize">
                      {order.order_type}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Ordered On
                    </span>

                    <span>
                      {order.ordered_at
                        ? new Date(
                            order.ordered_at
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs text-slate-400">
                    <span>Order Progress</span>
                    <span>{order.status}</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${
                        order.status === "pending"
                          ? "w-1/4 bg-yellow-500"
                          : order.status === "confirmed"
                          ? "w-2/4 bg-blue-500"
                          : order.status === "dispatched"
                          ? "w-3/4 bg-purple-500"
                          : order.status === "delivered"
                          ? "w-full bg-green-500"
                          : "w-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}