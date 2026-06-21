import { useEffect, useState } from "react";
import api from "../../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get("/notifications/");
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, is_read: true }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading notifications...
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Notifications 🔔
          </h1>

          <p className="mt-2 text-slate-400">
            Stay updated with orders, prices,
            assignments and marketplace activity.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Total Notifications
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {notifications.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Unread
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {unreadCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Read
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {notifications.length - unreadCount}
            </h2>
          </div>
        </div>

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">
              📭
            </div>

            <h2 className="text-xl font-semibold">
              No Notifications
            </h2>

            <p className="mt-2 text-slate-400">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border p-6 backdrop-blur-xl ${
                  item.is_read
                    ? "border-white/10 bg-white/5"
                    : "border-yellow-500/30 bg-yellow-500/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg">
                      {item.message}
                    </p>

                    <div className="mt-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.is_read
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {item.is_read
                          ? "Read"
                          : "Unread"}
                      </span>
                    </div>
                  </div>

                  {!item.is_read && (
                    <button
                      onClick={() =>
                        markRead(item.id)
                      }
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-500"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}