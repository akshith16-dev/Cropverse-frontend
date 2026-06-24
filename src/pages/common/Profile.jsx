import {
  KeyRound,
  Pencil,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../api";

const fallbackProfile = () => ({ name: localStorage.getItem("user_name") || "User", email: localStorage.getItem("email") || "Not available", role: localStorage.getItem("role") || "user" });
const display = (value) => value === undefined || value === null || value === "" ? "Not available" : value;
const errorText = (error, fallback) => error.response?.data?.message || error.response?.data?.detail || fallback;

export default function Profile() {
  const role = localStorage.getItem("role") || "user";
  const [profile, setProfile] = useState(fallbackProfile);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [form, setForm] = useState({});
  const [password, setPassword] = useState({ current_password: "", new_password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => { loadProfile(); }, []);
  async function loadProfile() {
    try {
      const response = await api.get("/profile/me");
      const data = response.data || {};
      setProfile(data); setForm(data);
      localStorage.setItem("user_name", data.user_name || data.name || fallbackProfile().name);
      if (data.email) localStorage.setItem("email", data.email);
    } catch { setProfile(fallbackProfile()); setForm(fallbackProfile()); setMessage("Profile service is unavailable; showing saved session details."); }
    try {
      if (role === "farmer") {
        const [assignments, crops] = await Promise.all([api.get("/assignments/me"), api.get("/baby-crops/")]);
        setStats({ "Crop assignments": assignments.data?.length || 0, "Active crops": (crops.data || []).filter((crop) => crop.growth_stage !== "harvest").length, "Total orders": 0 });
      } else if (role === "shop") {
        const [marketplace, orders, demands] = await Promise.all([api.get("/baby-crops/marketplace"), api.get("/orders/me"), api.get("/demand/me")]);
        setStats({ "Marketplace purchases": marketplace.data?.length || 0, Orders: orders.data?.length || 0, "Demand requests": demands.data?.length || 0 });
      }
    } catch { /* profile still remains usable if optional statistics fail */ }
    finally { setLoading(false); }
  }
  const fields = useMemo(() => {
    const common = [["Name", "name"], ["Email", "email"], ["Phone number", "phone"]];
    if (role === "farmer") return [...common, ["Village", "village"], ["District", "district"], ["Soil type", "soil_type"], ["Land acres", "land_acres"]];
    if (role === "shop") return [...common, ["Shop name", "shop_name"], ["Shop location", "location"]];
    return common;
  }, [role]);
  async function saveProfile(event) { event.preventDefault(); try { const response = await api.put("/profile/me", form); const next = response.data || form; setProfile(next); setForm(next); localStorage.setItem("user_name", next.user_name || next.name || "User"); window.dispatchEvent(new Event("cropverse-profile-updated")); setEditing(false); setMessage("Profile updated successfully."); } catch (error) { setMessage(errorText(error, "Could not update profile. Please try again.")); } }
  async function changePassword(event) { event.preventDefault(); try { await api.put("/profile/change-password", password); setPassword({ current_password: "", new_password: "" }); setPasswordOpen(false); setMessage("Password changed successfully."); } catch (error) { setMessage(errorText(error, "Could not change password.")); } }
  const metadata = [["Role", role], ["Account created", profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Not available"], ["Last login", profile.last_login ? new Date(profile.last_login).toLocaleString() : "Not available"]];
  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading profile...</div>;
  return <div className="text-white"><div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-3xl font-bold">Your Profile</h1><p className="mt-2 text-slate-400">Your Cropverse account and activity at a glance.</p></div><div className="flex flex-wrap gap-3"><button onClick={() => setEditing(true)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium hover:bg-emerald-500"><Pencil size={17}/>Edit profile</button><button onClick={() => setPasswordOpen(true)} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 hover:bg-white/10"><KeyRound size={17}/>Change password</button></div></div>{message && <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div>}<div className="grid gap-6 lg:grid-cols-3"><section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-2"><div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl">🌾</div><h2 className="text-xl font-semibold">Account details</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">{fields.map(([label, key]) => <div key={key}><p className="text-sm text-slate-400">{label}</p><p className="mt-1 break-words font-medium">{display(profile[key] ?? (key === "name" ? profile.user_name : undefined))}</p></div>)}</div></section><section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"><h2 className="text-xl font-semibold">Account status</h2><div className="mt-5 space-y-5">{metadata.map(([label, content]) => <div key={label}><p className="text-sm text-slate-400">{label}</p><p className="mt-1 capitalize">{content}</p></div>)}</div></section></div>{Object.keys(stats).length > 0 && <section className="mt-6"><h2 className="mb-4 text-xl font-semibold">Activity</h2><div className="grid gap-4 sm:grid-cols-3">{Object.entries(stats).map(([label, count]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-emerald-400">{count}</p></div>)}</div></section>}{editing && <ProfileEditor fields={fields} form={form} setForm={setForm} onClose={() => setEditing(false)} onSubmit={saveProfile}/>} {passwordOpen && <PasswordDialog password={password} setPassword={setPassword} onClose={() => setPasswordOpen(false)} onSubmit={changePassword}/>}</div>;
}

function Dialog({ children, onClose, title }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onMouseDown={onClose}><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2><button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10"><X size={18}/></button></div>{children}</div></div>; }
function ProfileEditor({
  fields,
  form,
  setForm,
  onClose,
  onSubmit,
}) {
  const editableKeys = [
    "name",
    "phone",
    "village",
    "district",
    "soil_type",
    "land_acres",
    "shop_name",
    "location",
  ];

  const editableFields = fields.filter(
    ([_, key]) => editableKeys.includes(key)
  );

  return (
    <Dialog
      title="Edit profile"
      onClose={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="space-y-5"
      >
        {/* Email - Read Only */}
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Email Address
          </label>

          <input
            value={form.email || ""}
            disabled
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-slate-800
              px-4
              py-3
              opacity-60
              cursor-not-allowed
            "
          />

          <p className="mt-1 text-xs text-slate-500">
            Email cannot be changed.
          </p>
        </div>

        {/* Editable Fields */}
        {editableFields.map(([label, key]) => (
          <div key={key}>
            <label className="mb-2 block text-sm text-slate-400">
              {label}
            </label>

            <input
              type={
                key === "land_acres"
                  ? "number"
                  : "text"
              }
              step={
                key === "land_acres"
                  ? "0.1"
                  : undefined
              }
              value={form[key] ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  [key]:
                    key === "land_acres"
                      ? Number(
                          event.target.value
                        )
                      : event.target.value,
                })
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-slate-950
                px-4
                py-3
                outline-none
                transition
                focus:border-emerald-500
              "
            />
          </div>
        ))}

        {/* Read-only Information */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-medium text-slate-300">
            Protected Information
          </h3>

          <div>
            <p className="text-sm text-slate-400">
              Role
            </p>

            <p className="capitalize">
              {form.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Account Created
            </p>

            <p>
              {form.created_at
                ? new Date(
                    form.created_at
                  ).toLocaleDateString()
                : "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Last Login
            </p>

            <p>
              {form.last_login
                ? new Date(
                    form.last_login
                  ).toLocaleString()
                : "Not available"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              border-white/10
              py-3
              hover:bg-white/10
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              flex-1
              rounded-xl
              bg-emerald-600
              py-3
              font-medium
              hover:bg-emerald-500
            "
          >
            Save Changes
          </button>
        </div>
      </form>
    </Dialog>
  );
}
function PasswordDialog({
  password,
  setPassword,
  onClose,
  onSubmit,
}) {
  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  return (
    <Dialog
      title="Change password"
      onClose={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <div className="relative">
          <input
            type={
              showCurrent
                ? "text"
                : "password"
            }
            required
            placeholder="Current password"
            value={password.current_password}
            onChange={(event) =>
              setPassword({
                ...password,
                current_password:
                  event.target.value,
              })
            }
            className="
              w-full rounded-xl
              border border-white/10
              bg-slate-950
              px-4 py-3 pr-12
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowCurrent(
                !showCurrent
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
            "
          >
            {showCurrent ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <div className="relative">
          <input
            type={
              showNew
                ? "text"
                : "password"
            }
            minLength="8"
            required
            placeholder="New password"
            value={password.new_password}
            onChange={(event) =>
              setPassword({
                ...password,
                new_password:
                  event.target.value,
              })
            }
            className="
              w-full rounded-xl
              border border-white/10
              bg-slate-950
              px-4 py-3 pr-12
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowNew(!showNew)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
            "
          >
            {showNew ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <button
          className="
            w-full rounded-xl
            bg-emerald-600
            py-3
            font-medium
            hover:bg-emerald-500
          "
        >
          Update password
        </button>
      </form>
    </Dialog>
  );
}
