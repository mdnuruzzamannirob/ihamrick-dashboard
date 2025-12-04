import { useSelector } from "react-redux";
import { RootState } from "../../services/store"; // Adjust path if necessary

export function ManagePublications() {
  // Fetch publications from Redux state
  const publications = useSelector(
    (state: RootState) => state.media.publications.data
  );

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
              <th className="pb-3 text-center font-poppins font-bold text-base text-[#383232]">
                Cover Image
              </th>
              <th className="pb-3 text-right font-poppins font-bold text-base text-[#383232]">
                Author
              </th>
              <th className="pb-3 text-center font-poppins font-bold text-base text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {publications.slice(0, 5).map((publication, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-3 text-left font-poppins font-normal text-base text-[#333]">
                  {publication.title}
                </td>
                <td className="py-3 text-center font-poppins font-normal text-base text-[#333]">
                  <img
                    src={publication.coverImage}
                    alt={publication.title}
                    width={50}
                    height={50}
                    className="object-cover rounded-lg"
                  />
                </td>
                <td className="py-3 text-right font-poppins font-normal text-base text-[#333]">
                  {publication.author}
                </td>

                <td className="py-3 text-center font-poppins font-normal text-base text-[#333]">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      publication.status
                        ? "bg-[#D75757] text-white"
                        : "bg-[#262626] text-white"
                    }`}
                  >
                    {publication.status ? "  Published" : "  Unpublished"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
