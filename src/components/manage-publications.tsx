import { Calendar } from "lucide-react";

const publications = [
  {
    title: "Healthy Living Happier Life",
    date: "Feb 2, 2025",
    author: "Robert Frost",
  },
  {
    title: "Small Habits Big Health",
    date: "Feb 2, 2025",
    author: "Paulo David",
  },
  {
    title: "Small Habits Big Health",
    date: "Feb 2, 2025",
    author: "Henry John",
  },
  {
    title: "Healthy Living Happier Life",
    date: "Feb 2, 2025",
    author: "Robert Frost",
  },
];

export function ManagePublications() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-2xl font-poppins font-semibold text-black">
        Manage Publications
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
                Author
              </th>
            </tr>
          </thead>
          <tbody>
            {publications.map((publication, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-3 font-poppins font-normal text-base text-[#333]">
                  {publication.title}
                </td>
                <td className="hidden py-3 text-center text-sm text-neutral-700 sm:table-cell">
                  <div className="flex items-center font-poppins font-normal text-base text-[#333] justify-center gap-2">
                    <Calendar className="h-4 w-4 text-black" />
                    {publication.date}
                  </div>
                </td>
                <td className="hidden py-3 text-right font-poppins font-normal text-base text-[#333] md:table-cell">
                  {publication.author}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
