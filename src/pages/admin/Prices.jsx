import { useEffect, useMemo, useState } from "react";
import api from "../../api";

const emptyForm = {
  crop_id: "",
  price_per_kg: "",
  fair_price: "",
  market_name: "",
};

export default function Prices() {
  const [prices, setPrices] = useState([]);
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const cropNames = useMemo(() => {
    return crops.reduce((acc, crop) => {
      acc[crop.id] = crop.crop_name;
      return acc;
    }, {});
  }, [crops]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [pricesRes, cropsRes] = await Promise.all([
        api.get("/prices/"),
        api.get("/crops/"),
      ]);

      setPrices(pricesRes.data || []);
      setCrops(cropsRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load prices.");
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

  function selectCrop(e) {
    setForm((prev) => ({
      ...prev,
      crop_id: e.target.value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(price) {
    setEditingId(price.id);

    setForm({
      crop_id: price.crop_id,
      price_per_kg: String(price.price_per_kg),
      fair_price: String(price.fair_price),
      market_name: price.market_name,
    });

    setMessage("");
  }

  async function submitPrice(e) {
    e.preventDefault();

    const payload = {
      price_per_kg: Number(form.price_per_kg),
      fair_price: Number(form.fair_price),
      market_name: form.market_name,
    };

    try {
      if (editingId) {
        await api.put(`/prices/${editingId}`, payload);
        setMessage("✅ Price updated successfully.");
      } else {
        await api.post("/prices/", {
          ...payload,
          crop_id: form.crop_id,
        });

        setMessage("✅ Price added successfully.");
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.detail ||
          "❌ Price action failed."
      );
    }
  }

  async function deletePrice(id) {
    try {
      await api.delete(`/prices/${id}`);

      setMessage("🗑️ Price deleted successfully.");

      loadData();
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.detail ||
          "Delete failed."
      );
    }
  }

  if (loading) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading prices...
        </div>
    );
  }

  return (
    <>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Price Management 💰
          </h1>

          <p className="mt-2 text-slate-400">
            Manage crop market prices and fair prices.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            {message}
          </div>
        )}

        {/* Form */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editingId
              ? "Edit Price"
              : "Add New Price"}
          </h2>

          <form
            onSubmit={submitPrice}
            className="grid gap-4 md:grid-cols-2"
          >
            <select
              value={form.crop_id}
              onChange={selectCrop}
              disabled={Boolean(editingId)}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
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
              type="number"
              name="price_per_kg"
              placeholder="Market Price"
              value={form.price_per_kg}
              onChange={updateField}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="number"
              name="fair_price"
              placeholder="Fair Price"
              value={form.fair_price}
              onChange={updateField}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="text"
              name="market_name"
              placeholder="Market Name"
              value={form.market_name}
              onChange={updateField}
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <button
              type="submit"
              className="rounded-xl bg-green-600 py-3 font-medium hover:bg-green-500"
            >
              {editingId
                ? "Update Price"
                : "Add Price"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-700 py-3 font-medium"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Price Cards */}
        {prices.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            No prices found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {prices.map((price) => (
              <div
                key={price.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <h2 className="text-xl font-semibold">
                  🌾{" "}
                  {cropNames[price.crop_id] ||
                    "Unknown Crop"}
                </h2>

                <div className="mt-4 space-y-2">
                  <p>
                    Market: {price.market_name}
                  </p>

                  <p>
                    Market Price: ₹
                    {price.price_per_kg}/kg
                  </p>

                  <p>
                    Fair Price: ₹
                    {price.fair_price}/kg
                  </p>

                  <p className="text-sm text-slate-400">
                    {price.recorded_at
                      ? new Date(
                          price.recorded_at
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      startEdit(price)
                    }
                    className="flex-1 rounded-xl bg-blue-600 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deletePrice(price.id)
                    }
                    className="flex-1 rounded-xl bg-red-600 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
