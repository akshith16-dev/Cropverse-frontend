import { useEffect, useMemo, useState } from "react";
import api from "../../api";

const stages = ["sowing", "germination", "vegetative", "flowering", "fruiting", "harvest"];

const emptyBabyCropForm = {
  assignment_id: "",
  sowing_date: "",
  expected_harvest: "",
  quantity_kg: "",
  notes: "",
};

export default function Crops() {
  const [assignments, setAssignments] = useState([]);
  const [babyCrops, setBabyCrops] = useState([]);
  const [form, setForm] = useState(emptyBabyCropForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [assignmentRes, babyCropRes] = await Promise.all([
        api.get("/assignments/me"),
        api.get("/baby-crops/"),
      ]);
      setAssignments(assignmentRes.data || []);
      setBabyCrops(babyCropRes.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load crop workflow.");
    } finally {
      setLoading(false);
    }
  }

  const babyCropAssignmentIds = useMemo(
    () => new Set(babyCrops.map((crop) => crop.assignment_id)),
    [babyCrops]
  );

  const acceptedAssignmentsWithoutCrop = assignments.filter(
    (assignment) =>
      ["accepted", "active"].includes(assignment.status?.toLowerCase()) &&
      !babyCropAssignmentIds.has(assignment.id)
  );

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function updateAssignmentStatus(id, status) {
    try {
      setMessage("");
      await api.put(`/assignments/${id}/status`, { status });
      setAssignments((previous) =>
        previous.map((assignment) =>
          assignment.id === id ? { ...assignment, status } : assignment
        )
      );
      setMessage(`Assignment ${status}.`);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Assignment update failed.");
    }
  }

  async function createBabyCrop(event) {
    event.preventDefault();
    try {
      setMessage("");
      await api.post("/baby-crops/", {
        assignment_id: form.assignment_id,
        sowing_date: form.sowing_date,
        expected_harvest: form.expected_harvest || null,
        quantity_kg: form.quantity_kg ? Number(form.quantity_kg) : null,
        notes: form.notes || null,
      });
      setForm(emptyBabyCropForm);
      setMessage("Baby crop created and added to marketplace.");
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Baby crop creation failed.");
    }
  }

  async function updateStage(id, growth_stage) {
    try {
      await api.put(`/baby-crops/${id}/stage`, { growth_stage });
      setBabyCrops((previous) =>
        previous.map((crop) => (crop.id === id ? { ...crop, growth_stage } : crop))
      );
    } catch (err) {
      setMessage(err.response?.data?.detail || "Growth stage update failed.");
    }
  }

  function getProgress(stage) {
    const index = stages.indexOf(stage);
    return index >= 0 ? ((index + 1) / stages.length) * 100 : 0;
  }

  if (loading) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">Loading crops...</div>;

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        <p>{error}</p>
        <button onClick={loadData} className="mt-4 rounded-xl bg-red-500 px-4 py-2 font-medium text-white">Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Crops</h1>
        <p className="mt-2 text-slate-400">Accept assignments, create baby crops, and track growth stages.</p>
      </div>

      {message && <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">{message}</div>}

      <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="mt-4 text-slate-400">No assignments available yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{assignment.crop_name}</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">{assignment.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{assignment.season} {assignment.year}</p>
                {assignment.xai_explanation && <p className="mt-3 text-sm text-slate-300">{assignment.xai_explanation}</p>}
                {assignment.status === "pending" && (
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => updateAssignmentStatus(assignment.id, "accepted")} className="flex-1 rounded-xl bg-emerald-600 py-2 font-medium">Accept</button>
                    <button onClick={() => updateAssignmentStatus(assignment.id, "rejected")} className="flex-1 rounded-xl bg-red-600 py-2 font-medium">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Create Baby Crop</h2>
        {acceptedAssignmentsWithoutCrop.length === 0 ? (
          <p className="mt-4 text-slate-400">Accept an assignment before creating a baby crop. Existing baby crops are listed below.</p>
        ) : (
          <form onSubmit={createBabyCrop} className="mt-5 grid gap-4 md:grid-cols-2">
            <select name="assignment_id" value={form.assignment_id} onChange={updateForm} required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">
              <option value="">Select accepted assignment</option>
              {acceptedAssignmentsWithoutCrop.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>{assignment.crop_name} - {assignment.season}</option>
              ))}
            </select>
            <input name="sowing_date" type="date" value={form.sowing_date} onChange={updateForm} required className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
            <input name="expected_harvest" type="date" value={form.expected_harvest} onChange={updateForm} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
            <input name="quantity_kg" type="number" min="0" step="0.01" value={form.quantity_kg} onChange={updateForm} placeholder="Quantity kg" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
            <input name="notes" value={form.notes} onChange={updateForm} placeholder="Notes" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3" />
            <button className="rounded-xl bg-emerald-600 py-3 font-medium hover:bg-emerald-500">Create Baby Crop</button>
          </form>
        )}
      </section>

      {babyCrops.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-xl font-semibold">No Baby Crops Found</h2>
          <p className="mt-2 text-slate-400">Created baby crops will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {babyCrops.map((crop) => (
            <div key={crop.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold capitalize">{crop.growth_stage}</h2>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">Active</span>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm text-slate-400">
                  <span>Growth Progress</span>
                  <span>{Math.round(getProgress(crop.growth_stage))}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${getProgress(crop.growth_stage)}%` }} />
                </div>
              </div>
              <div className="mt-5 space-y-2 text-slate-300">
                <p>Quantity: {crop.quantity_kg ?? "N/A"} kg</p>
                <p>Sowing: {crop.sowing_date}</p>
                <p>Harvest: {crop.expected_harvest ?? "N/A"}</p>
                <p>Notes: {crop.notes || "No notes available."}</p>
              </div>
              <select value={crop.growth_stage} onChange={(event) => updateStage(crop.id, event.target.value)} className="mt-5 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3">
                {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
