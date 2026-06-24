import { useEffect, useMemo, useState } from "react";
import api from "../../api";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  async function loadFarmers() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/farmers/");
      setFarmers(data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load farmers.");
    } finally {
      setLoading(false);
    }
  }

  const filteredFarmers = useMemo(
    () =>
      farmers.filter((farmer) =>
        [farmer.name, farmer.email, farmer.village, farmer.district, farmer.soil_type]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [farmers, search]
  );

  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading farmers...</div>;

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        <p>{error}</p>
        <button onClick={loadFarmers} className="mt-4 rounded-xl bg-red-500 px-4 py-2 font-medium text-white">Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Registered Farmers</h1>
          <p className="mt-2 text-slate-400">Review farmer profiles used for crop assignment.</p>
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search farmers..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-500 md:w-80" />
      </div>

      {filteredFarmers.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-xl font-semibold">No Farmers Found</h2>
          <p className="mt-2 text-slate-400">No registered farmers match your search.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">Farmer</th>
                  <th className="px-6 py-4 text-left">District</th>
                  <th className="px-6 py-4 text-left">Village</th>
                  <th className="px-6 py-4 text-left">Soil</th>
                  <th className="px-6 py-4 text-left">Land</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <p className="font-medium">{farmer.name}</p>
                      <p className="text-sm text-slate-400">{farmer.email}</p>
                    </td>
                    <td className="px-6 py-4">{farmer.district}</td>
                    <td className="px-6 py-4">{farmer.village}</td>
                    <td className="px-6 py-4">{farmer.soil_type}</td>
                    <td className="px-6 py-4">{farmer.land_acres} acres</td>
                    <td className="px-6 py-4">{farmer.phone || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
