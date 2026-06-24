import { useEffect, useMemo, useState } from "react";
import api from "../../api";

const emptyForm = {
  crop_name: "",
  season: "",
  soil_suitability: "",
  avg_yield_per_acre: "",
  min_price: "",
  max_price: "",
  cultivation_cost: "",
};

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/crops/");
      setCrops(data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load crops.");
    } finally {
      setLoading(false);
    }
  }

  const cropCount = useMemo(() => crops.length, [crops]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(crop) {
    setEditingId(crop.id);
    setForm({
      crop_name: crop.crop_name,
      season: crop.season,
      soil_suitability: crop.soil_suitability,
      avg_yield_per_acre: String(crop.avg_yield_per_acre),
      min_price: String(crop.min_price),
      max_price: String(crop.max_price),
      cultivation_cost: String(crop.cultivation_cost),
    });
    setMessage("");
  }

  async function submitCrop(event) {
    event.preventDefault();
    const payload = {
      season: form.season,
      soil_suitability: form.soil_suitability,
      avg_yield_per_acre: Number(form.avg_yield_per_acre),
      min_price: Number(form.min_price),
      max_price: Number(form.max_price),
      cultivation_cost: Number(form.cultivation_cost),
    };

    try {
      if (editingId) {
        await api.put(`/crops/${editingId}`, payload);
        setMessage("Crop updated successfully.");
      } else {
        await api.post("/crops/", { ...payload, crop_name: form.crop_name });
        setMessage("Crop created successfully.");
      }
      resetForm();
      loadCrops();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Crop action failed.");
    }
  }

  async function deleteCrop(id) {
    try {
      await api.delete(`/crops/${id}`);
      setMessage("Crop deleted successfully.");
      loadCrops();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Delete failed.");
    }
  }

  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading crops...</div>;

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        <p>{error}</p>
        <button onClick={loadCrops} className="mt-4 rounded-xl bg-red-500 px-4 py-2 font-medium text-white">Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Crop Management</h1>
        <p className="mt-2 text-slate-400">{cropCount} crops available for assignment and marketplace pricing.</p>
      </div>

      {message && <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">{message}</div>}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-xl font-semibold">{editingId ? "Edit Crop" : "Create Crop"}</h2>
        <form onSubmit={submitCrop} className="grid gap-4 md:grid-cols-2">
          <input name="crop_name" value={form.crop_name} onChange={updateField} disabled={Boolean(editingId)} placeholder="Crop name" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 disabled:opacity-60" />
          <input name="season" value={form.season} onChange={updateField} placeholder="Season" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
          <input name="soil_suitability" value={form.soil_suitability} onChange={updateField} placeholder="Soil suitability" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
          <input name="avg_yield_per_acre" type="number" value={form.avg_yield_per_acre} onChange={updateField} placeholder="Average yield per acre" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
          <input name="min_price" type="number" value={form.min_price} onChange={updateField} placeholder="Minimum price" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
          <input name="max_price" type="number" value={form.max_price} onChange={updateField} placeholder="Maximum price" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
          <input name="cultivation_cost" type="number" value={form.cultivation_cost} onChange={updateField} placeholder="Cultivation cost" required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-emerald-600 py-3 font-medium hover:bg-emerald-500">{editingId ? "Update" : "Create"}</button>
            {editingId && <button type="button" onClick={resetForm} className="flex-1 rounded-xl bg-slate-700 py-3 font-medium">Cancel</button>}
          </div>
        </form>
      </div>

      {crops.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">No crops found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {crops.map((crop) => (
            <div key={crop.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">{crop.crop_name}</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>Season: {crop.season}</p>
                <p>Soil: {crop.soil_suitability}</p>
                <p>Yield: {crop.avg_yield_per_acre} kg/acre</p>
                <p>Price range: ₹{crop.min_price} - ₹{crop.max_price}/kg</p>
                <p>Fair price: ₹{crop.fair_price}/kg</p>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => startEdit(crop)} className="flex-1 rounded-xl bg-blue-600 py-2">Edit</button>
                <button onClick={() => deleteCrop(crop.id)} className="flex-1 rounded-xl bg-red-600 py-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
