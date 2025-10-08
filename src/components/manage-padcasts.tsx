import { Calendar } from "lucide-react";

const podcasts = [
  {
    title: "Healthy Living Happier Life",
    date: "Feb 2, 2025",
    duration: "5 mins",
  },
  { title: "Small Habits Big Health", date: "Feb 2, 2025", duration: "5 mins" },
  { title: "Small Habits Big Health", date: "Feb 2, 2025", duration: "5 mins" },
  {
    title: "Healthy Living Happier Life",
    date: "Feb 2, 2025",
    duration: "5 mins",
  },
];

export function ManagePodcasts() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4  text-2xl font-poppins font-semibold text-black">
        Manage Podcasts
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="pb-3 text-left font-poppins font-bold text-base text-[#383232]">
                Title
              </th>
              <th className="hidden pb-3 text-center font-poppins font-bold text-base text-[#383232] sm:table-cell">
                Date
              </th>
              <th className="hidden pb-3 text-right font-poppins font-bold text-base text-[#383232] md:table-cell">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {podcasts.map((podcast, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-3 font-poppins font-normal text-base text-[#333]">
                  {podcast.title}
                </td>
                <td className="hidden py-3 text-center text-sm text-neutral-700 sm:table-cell">
                  <div className="flex items-center justify-center gap-2 font-poppins font-normal text-base text-[#333]">
                    <Calendar className="h-4 w-4 text-black" />
                    {podcast.date}
                  </div>
                </td>
                <td className="hidden py-3 text-right font-poppins font-medium text-base text-black md:table-cell">
                  {podcast.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
