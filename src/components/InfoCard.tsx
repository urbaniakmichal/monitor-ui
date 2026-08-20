
interface InfoCardProps {
  title: string;
  data: Record<string, any> | undefined;
}

export const InfoCard = ({ title, data }: InfoCardProps) => {
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">{title}</h3>
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="font-mono font-bold text-slate-800">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};