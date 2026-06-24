import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";

const dashboardRoutes = {
  admin: "/admin/dashboard",
  farmer: "/farmer/dashboard",
  shop: "/shop/dashboard",
};

function errorMessage(error) {
  const detail = error.response?.data?.detail ?? error.response?.data?.details;
  const message = error.response?.data?.message;

  if (typeof detail === "string") return detail;
  if (typeof message === "string" && message !== "Validation failed") return message;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || item.message)
      .filter(Boolean)
      .join(" ");
  }

  return detail?.message || message || "Registration failed.";
}

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("farmer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",

    // Farmer fields
    village: "",
    district: "",
    soil_type: "",
    land_acres: "",

    // Shop fields
    shop_name: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      let payload;

      if (role === "farmer") {
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          village: form.village,
          district: form.district,
          soil_type: form.soil_type,
          land_acres: Number(form.land_acres),
        };
      } else {
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          shop_name: form.shop_name,
          location: form.location,
        };
      }

      const response = await api.post(
        `/auth/register/${role}`,
        payload
      );

      const {
        access_token,
        role: responseRole,
        user_name,
        name,
        user_id,
      } = response.data;

      localStorage.setItem(
        "token",
        access_token
      );

      localStorage.setItem(
        "role",
        responseRole
      );
      if (user_id) localStorage.setItem("user_id", user_id);

      localStorage.setItem(
        "user_name",
        user_name || name || form.name
      );

      localStorage.setItem(
        "email",
        form.email
      );

      navigate(
        dashboardRoutes[responseRole],
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <p className="text-center text-emerald-400 font-medium">
          Smart Agriculture Platform
        </p>

        <h1 className="mt-2 text-center text-4xl font-bold">
          Join Cropverse 🌾
        </h1>

        <p className="mt-3 text-center text-slate-400">
          Create your account and get started.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("farmer")}
            className={`rounded-xl py-3 transition ${
              role === "farmer"
                ? "bg-emerald-600"
                : "bg-slate-800"
            }`}
          >
            Farmer
          </button>

          <button
            type="button"
            onClick={() => setRole("shop")}
            className={`rounded-xl py-3 transition ${
              role === "shop"
                ? "bg-emerald-600"
                : "bg-slate-800"
            }`}
          >
            Shop
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="mt-8 space-y-4"
        >
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-900 px-4 py-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-900 px-4 py-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-900 px-4 py-3"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-900 px-4 py-3"
          />

          {role === "farmer" && (
            <>
              <input
                name="village"
                placeholder="Village"
                value={form.village}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 px-4 py-3"
              />

              <input
                name="district"
                placeholder="District"
                value={form.district}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 px-4 py-3"
              />

              <input
                name="soil_type"
                placeholder="Soil Type"
                value={form.soil_type}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 px-4 py-3"
              />

              <input
                name="land_acres"
                type="number"
                step="0.1"
                placeholder="Land Acres"
                value={form.land_acres}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 px-4 py-3"
              />
            </>
          )}

          {role === "shop" && (
            <>
              <input
                name="shop_name"
                placeholder="Shop Name"
                value={form.shop_name}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 px-4 py-3"
              />

              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 px-4 py-3"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-medium hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : `Register as ${
                  role === "farmer"
                    ? "Farmer"
                    : "Shop"
                }`}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
