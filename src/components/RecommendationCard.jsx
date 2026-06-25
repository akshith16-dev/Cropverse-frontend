import { CheckCircle2, IndianRupee, Sparkles } from "lucide-react";

export default function RecommendationCard({ recommendation, onSelect, actionLabel = "View Recommendation" }) {
  if (!recommendation) return null;

  const confidence = Math.round((recommendation.confidence || 0) * 100);

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-emerald-300">{recommendation.recommendation_type?.replaceAll("_", " ") || "AI recommendation"}</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">{recommendation.crop}</h3>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
          {confidence}% confidence
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-slate-200">
          <IndianRupee size={18} className="text-amber-300" />
          <span>{Math.round(recommendation.expected_profit || 0).toLocaleString("en-IN")} expected profit</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-slate-200">
          <Sparkles size={18} className="text-sky-300" />
          <span>Explainable AI score</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {(recommendation.reasons || []).map((reason) => (
          <div key={reason} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(recommendation)}
          className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500"
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
}
