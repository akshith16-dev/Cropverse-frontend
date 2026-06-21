import { useEffect, useState } from "react";
import api from "../../api";

const stages = [
  "sowing",
  "germination",
  "vegetative",
  "flowering",
  "fruiting",
  "harvest",
];

const stageIcons = {
  sowing: "🌱",
  germination: "🌿",
  vegetative: "🍃",
  flowering: "🌼",
  fruiting: "🍅",
  harvest: "🚜",
};

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      const res = await api.get("/baby-crops/");
      setCrops(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStage(id, stage) {
    try {
      await api.put(`/baby-crops/${id}/stage`, {
        growth_stage: stage,
      });

      setCrops((prev) =>
        prev.map((crop) =>
          crop.id === id
            ? { ...crop, growth_stage: stage }
            : crop
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  function getProgress(stage) {
    const index = stages.indexOf(stage);

    return ((index + 1) / stages.length) * 100;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading crops...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            My Crops 🌾
          </h1>

          <p className="mt-2 text-slate-400">
            Track crop growth stages and harvest readiness.
          </p>
        </div>

        {/* Empty State */}
        {crops.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">📭</div>

            <h2 className="text-xl font-semibold">
              No Crops Found
            </h2>

            <p className="mt-2 text-slate-400">
              No crop assignments available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition hover:border-green-500/40"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold capitalize">
                    {stageIcons[crop.growth_stage]}{" "}
                    {crop.growth_stage}
                  </h2>

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                    Active
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm text-slate-400">
                    <span>Growth Progress</span>

                    <span>
                      {Math.round(
                        getProgress(crop.growth_stage)
                      )}
                      %
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-green-500"
                      style={{
                        width: `${getProgress(
                          crop.growth_stage
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Quantity
                    </span>

                    <span>
                      {crop.quantity_kg ?? "N/A"} kg
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Sowing Date
                    </span>

                    <span>
                      {crop.sowing_date}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Harvest
                    </span>

                    <span>
                      {crop.expected_harvest ?? "N/A"}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-5 rounded-xl bg-slate-900 p-3">
                  <p className="text-sm text-slate-300">
                    {crop.notes ?? "No notes available."}
                  </p>
                </div>

                {/* Stage Selector */}
                <div className="mt-5">
                  <label className="mb-2 block text-sm text-slate-400">
                    Update Growth Stage
                  </label>

                  <select
                    value={crop.growth_stage}
                    onChange={(e) =>
                      updateStage(
                        crop.id,
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  >
                    {stages.map((stage) => (
                      <option
                        key={stage}
                        value={stage}
                      >
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}