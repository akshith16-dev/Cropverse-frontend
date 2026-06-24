import { useEffect, useState } from "react";
import api from "../../api";
import useWebSocket from "../../hooks/useWebSocket";

export default function Demand() {
  const [crops, setCrops] = useState([]);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    crop_id: "",
    quantity_kg: "",
    required_by: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useWebSocket("/ws/supply-demand", () => {
    loadData();
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [cropsRes, demandsRes] = await Promise.all([
        api.get("/crops/"),
        api.get("/demand/me"),
      ]);

      setCrops(cropsRes.data || []);
      setDemands(demandsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load demand requests.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submitDemand(e) {
    e.preventDefault();

    try {
      await api.post("/demand/", {
        crop_id: form.crop_id,
        quantity_kg: Number(form.quantity_kg),
        required_by: form.required_by,
      });
      setMessage("Demand request created.");

      setForm({
        crop_id: "",
        quantity_kg: "",
        required_by: "",
      });

      loadData();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Demand request failed.");
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/20 text-green-400";

      case "planned":
        return "bg-blue-500/20 text-blue-400";

      case "rejected":
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
            Demand Requests 📦
          </h1>

          <p className="mt-2 text-slate-400">
            Submit crop demand requests and track their status.
          </p>
        </div>

        {/* Demand Form */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            {error}
            <button onClick={loadData} className="ml-4 rounded-xl bg-red-500 px-3 py-1 text-sm text-white">Retry</button>
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            {message}
          </div>
        )}

        {/* Demand Form */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Create Demand Request
          </h2>

          <form
            onSubmit={submitDemand}
            className="grid gap-4 md:grid-cols-2"
          >
            <select
              name="crop_id"
              value={form.crop_id}
              onChange={updateField}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            >
              <option value="">Select Crop</option>

              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.crop_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity_kg"
              min="1"
              step="0.01"
              placeholder="Quantity (kg)"
              value={form.quantity_kg}
              onChange={updateField}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="date"
              name="required_by"
              value={form.required_by}
              onChange={updateField}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-4 py-3 font-medium hover:bg-green-500 transition"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            Loading demand requests...
          </div>
        )}

        {/* Empty State */}
        {!loading && demands.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">📭</div>

            <h2 className="text-xl font-semibold">
              No Demand Requests
            </h2>

            <p className="mt-2 text-slate-400">
              Submit your first crop demand request.
            </p>
          </div>
        )}

        {/* Demand Cards */}
        {!loading && demands.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {demands.map((demand) => (
              <div
                key={demand.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">
                    Demand Request
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                      demand.status
                    )}`}
                  >
                    {demand.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Quantity
                    </span>

                    <span>{demand.quantity_kg} kg</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Required By
                    </span>

                    <span>{demand.required_by}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Created
                    </span>

                    <span>
                      {demand.created_at
                        ? new Date(
                            demand.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </span>
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
