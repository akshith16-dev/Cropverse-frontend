import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const response = await api.get("/assignments/me");
      setAssignments(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/assignments/${id}/status`, {
        status,
      });

      setAssignments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-500/20 text-green-400";

      case "rejected":
        return "bg-red-500/20 text-red-400";

      case "active":
        return "bg-blue-500/20 text-blue-400";

      case "complete":
        return "bg-purple-500/20 text-purple-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading assignments...
        </div>
      </div>
    );
  }

  const acceptedCount = assignments.filter(
    (a) => a.status === "accepted"
  ).length;

  const pendingCount = assignments.filter(
    (a) => a.status === "pending"
  ).length;
  const activeCount = assignments.filter((a) => ["accepted", "active"].includes(a.status?.toLowerCase())).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Farmer Dashboard 🌾
          </h1>

          <p className="mt-2 text-slate-400">
            Manage crop assignments and view AI recommendations.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Total Assignments
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {assignments.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Active Crops
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {activeCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Pending
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingCount}
            </h2>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button onClick={() => navigate("/farmer/crops")} className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500">View My Crops</button>
          <button onClick={() => navigate("/chatbot")} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-medium text-emerald-300 hover:bg-emerald-500/20">Ask Cropverse AI</button>
        </div>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6"><h2 className="text-xl font-semibold">Recent activity</h2><div className="mt-4 space-y-3">{assignments.slice(0, 3).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/70 p-3"><span>🌱 {item.crop_name || "Crop assignment"}</span><span className="text-sm capitalize text-slate-400">{item.status || "pending"}</span></div>)}{!assignments.length && <p className="text-slate-400">New assignments and crop updates will appear here.</p>}</div></section>

        {/* Empty State */}
        {assignments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">📭</div>

            <h2 className="text-xl font-semibold">
              No Assignments Yet
            </h2>

            <p className="mt-2 text-slate-400">
              Crop assignments from administrators will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    🌱 {assignment.crop_name}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Season
                    </span>

                    <span>{assignment.season}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Year
                    </span>

                    <span>{assignment.year}</span>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="mt-6 rounded-2xl bg-slate-900 p-4">
                  <p className="mb-2 text-sm font-medium text-green-400">
                    🤖 AI Recommendation
                  </p>

                  <p className="text-sm text-slate-300">
                    {assignment.xai_explanation ||
                      "No explanation available."}
                  </p>
                </div>

                {/* Actions */}
                {assignment.status === "pending" && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() =>
                        updateStatus(
                          assignment.id,
                          "accepted"
                        )
                      }
                      className="flex-1 rounded-xl bg-green-600 py-3 font-medium hover:bg-green-500"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          assignment.id,
                          "rejected"
                        )
                      }
                      className="flex-1 rounded-xl bg-red-600 py-3 font-medium hover:bg-red-500"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
