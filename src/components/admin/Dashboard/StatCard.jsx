const COLOR_MAP = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-success/10", text: "text-success" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
  gray: { bg: "bg-gray-500/10", text: "text-gray-400" },
};

export default function StatCard({ title, value, icon, color = "primary" }) {
  const c = COLOR_MAP[color] || COLOR_MAP.primary;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-surface-dark p-5 border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-lg">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-2xl font-black text-white mt-1 group-hover:scale-105 transition-transform origin-left">
            {value}
          </h3>
        </div>
        
        <div className={`rounded-xl p-3 transition-all duration-300 ${c.bg} ${c.text} group-hover:rotate-12`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
      </div>
      
      {/* Hiệu ứng glow nhẹ khi hover */}
      <div className="absolute -right-4 -bottom-4 h-16 w-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}