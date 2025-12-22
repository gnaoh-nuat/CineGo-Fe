import React from "react";

const MetricCard = ({ title, value, icon, accent, loading, skeleton }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background-dark/80 p-5 shadow-xl backdrop-blur">
    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
    <div className="relative z-10 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
          {title}
        </p>
        <h3 className="mt-1 text-2xl font-black text-white leading-tight">
          {loading ? (
            <span className={`inline-block h-8 w-24 rounded ${skeleton}`} />
          ) : (
            value
          )}
        </h3>
      </div>
      <div
        className={`rounded-2xl p-3 text-white shadow-lg shadow-primary/20 ${accent}`}
      >
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

export default MetricCard;
