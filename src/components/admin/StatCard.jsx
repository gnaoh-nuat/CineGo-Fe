export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="rounded-3xl bg-surface-dark p-6 border border-white/5">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
  );
}
