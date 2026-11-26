import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  description: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-5 transition hover:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}