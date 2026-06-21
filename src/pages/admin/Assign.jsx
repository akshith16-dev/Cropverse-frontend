import { useEffect, useState } from "react";
import api from "../../api";

export default function Assign() {
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    farmer_id: "",
    crop_id: "",
    season: "",
    year: new Date().getFullYear(),
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [farmersRes, cropsRes] = await Promise.all([
        api.get("/farmers/"),
        api.get("/crops/"),
      ]);

      setFarmers(farmersRes.data || []);
      setCrops(cropsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/assignments/", form);

      setMessage("✅ Crop assigned successfully!");

      setForm({
        farmer_id: "",
        crop_id: "",
        season: "",
        year: new Date().getFullYear(),
      });
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
          "❌ Assignment failed"
      );
    }
  }

  if (loading) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading assignment data...
        </div>
    );
  }

  const selectedFarmer = farmers.find(
    (f) => String(f.id) === form.farmer_id
  );

  const selectedCrop = crops.find(
    (c) => String(c.id) === form.crop_id
  );

  return (
    <>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Crop Assignment 🌾
          </h1>

          <p className="mt-2 text-slate-400">
            Assign suitable crops to farmers based on
            planning and recommendations.
          </p>
        </div>

        {/* Success/Error */}
        {message && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Assignment Form */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Create Assignment
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <select
                value={form.farmer_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    farmer_id: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                required
              >
                <option value="">
                  Select Farmer
                </option>

                {farmers.map((farmer) => (
                  <option
                    key={farmer.id}
                    value={farmer.id}
                  >
                    {farmer.name}
                  </option>
                ))}
              </select>

              <select
                value={form.crop_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    crop_id: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                required
              >
                <option value="">
                  Select Crop
                </option>

                {crops.map((crop) => (
                  <option
                    key={crop.id}
                    value={crop.id}
                  >
                    {crop.crop_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Season"
                value={form.season}
                onChange={(e) =>
                  setForm({
                    ...form,
                    season: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                required
              />

              <input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    year: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                required
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 py-3 font-medium hover:bg-green-500"
              >
                Assign Crop
              </button>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Assignment Preview
            </h2>

            {selectedFarmer ? (
              <div className="mb-5">
                <p className="text-slate-400 text-sm">
                  Farmer
                </p>

                <p className="font-medium">
                  👨‍🌾 {selectedFarmer.name}
                </p>
              </div>
            ) : (
              <p className="mb-5 text-slate-500">
                No farmer selected
              </p>
            )}

            {selectedCrop ? (
              <div className="mb-5">
                <p className="text-slate-400 text-sm">
                  Crop
                </p>

                <p className="font-medium">
                  🌱 {selectedCrop.crop_name}
                </p>
              </div>
            ) : (
              <p className="mb-5 text-slate-500">
                No crop selected
              </p>
            )}

            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="mb-2 text-sm font-medium text-green-400">
                🤖 AI Recommendation
              </p>

              <p className="text-sm text-slate-300">
                This crop assignment preview will
                later display AI explanations based
                on soil type, district, season,
                demand trends and predicted yield.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
