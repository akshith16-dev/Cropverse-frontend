import { useEffect, useMemo, useState } from "react";
import api from "../../api";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadShops();
  }, []);

  async function loadShops() {
    try {
      const response = await api.get("/shops/");
      setShops(response.data || []);
    } catch (error) {
      console.error("Failed to load shops", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredShops = useMemo(() => {
    return shops.filter((shop) =>
      [
        shop.shop_name,
        shop.name,
        shop.email,
        shop.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [shops, search]);

  if (loading) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          Loading shops...
        </div>
    );
  }

  return (
    <>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Registered Shops 🏪
            </h1>

            <p className="mt-2 text-slate-400">
              Manage all registered shops on Cropverse.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Total Shops
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {shops.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Showing
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {filteredShops.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Platform Role
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Shop Buyers
            </h2>
          </div>
        </div>

        {/* Empty State */}
        {filteredShops.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="text-5xl mb-3">📭</div>

            <h2 className="text-xl font-semibold">
              No Shops Found
            </h2>

            <p className="mt-2 text-slate-400">
              No registered shops match your search.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      Shop
                    </th>

                    <th className="px-6 py-4 text-left">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-left">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left">
                      Contact
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredShops.map((shop) => (
                    <tr
                      key={shop.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-medium">
                        {shop.shop_name}
                      </td>

                      <td className="px-6 py-4">
                        {shop.name}
                      </td>

                      <td className="px-6 py-4">
                        {shop.email}
                      </td>

                      <td className="px-6 py-4">
                        {shop.location}
                      </td>

                      <td className="px-6 py-4">
                        {shop.contact || "-"}
                      </td>
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
