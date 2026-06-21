import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import MarketplaceDetailsModal from "../../components/MarketplaceDetailsModal";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    loadMarketplace();
  }, []);

  async function loadMarketplace() {
    try {
      setLoading(true);

      const res = await api.get("/baby-crops/marketplace");

      setCrops(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) =>
      crop.growth_stage
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [crops, search]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Marketplace 🌾
            </h1>

            <p className="mt-2 text-slate-400">
              Browse harvest-ready crops available for purchase.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search crop stage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            Loading marketplace...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCrops.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">📭</div>

            <h2 className="text-xl font-semibold">
              No crops available
            </h2>

            <p className="mt-2 text-slate-400">
              No crops available in the marketplace.
            </p>
          </div>
        )}

        {/* Crop Grid */}
        {!loading && filteredCrops.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition hover:border-green-500/40 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold capitalize">
                    🌱 {crop.growth_stage}
                  </h2>

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                    Available
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Quantity
                    </span>

                    <span className="font-semibold">
                      {crop.quantity_kg || 0} kg
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Harvest Date
                    </span>

                    <span className="font-semibold">
                      {crop.expected_harvest || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCrop(crop)}
                  className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 font-medium transition hover:bg-green-500"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <MarketplaceDetailsModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  );
}
