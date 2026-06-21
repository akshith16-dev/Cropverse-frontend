import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";

const dashboardRoutes = {
  admin: "/admin/dashboard",
  farmer: "/farmer/dashboard",
  shop: "/shop/dashboard",
};

function getLoginErrorMessage(err) {
  const detail = err.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map(
        (item) =>
          item.msg ||
          item.message ||
          JSON.stringify(item)
      )
      .join(" ");
  }

  if (detail && typeof detail === "object") {
    return (
      detail.msg ||
      detail.message ||
      JSON.stringify(detail)
    );
  }

  return "Login failed. Please try again.";
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const credentials = new URLSearchParams({
        username: form.email,
        password: form.password,
      });

      const response = await api.post(
        "/auth/login",
        credentials,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      const {
        access_token: token,
        role,
        user_name,
      } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // NEW
      localStorage.setItem(
        "user_name",
        user_name || "User"
      );
      localStorage.setItem("email", form.email);

      navigate(
        dashboardRoutes[role] || "/login",
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-green-400 font-medium">
            Smart Agriculture Platform
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Cropverse 🌾
          </h1>

          <p className="mt-3 text-slate-400">
            AI-powered agricultural planning,
            crop management and marketplace
            platform.
          </p>
        </div>

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-slate-400">
            Sign in to access your dashboard.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-medium transition hover:bg-green-500 disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-slate-400">
            New to Cropverse? <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300">Register</Link>
          </p>
          <p className="text-sm text-slate-500">
            Cropverse • Smart Agriculture Platform
          </p>
        </div>
      </div>
    </div>
  );
}
