import { FileText, Video, Mic, BookOpen } from "lucide-react";

const stats = [
  { icon: FileText, label: "Total Blog", value: "50", color: "bg-rose-200" },
  { icon: Video, label: "Total Videos", value: "80", color: "bg-rose-200" },
  { icon: Mic, label: "Total Podcasts", value: "65", color: "bg-rose-200" },
  {
    icon: BookOpen,
    label: "Total Publication",
    value: "70",
    color: "bg-rose-200",
  },
];

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl ${stat.color} p-6 transition-transform hover:scale-105`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-poppins font-semibold text-neutral-900">
              {stat.label}
            </h3>
            <stat.icon className="h-6 w-6 text-neutral-900" />
          </div>
          <p className="text-3xl font-poppins font-bold text-neutral-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
