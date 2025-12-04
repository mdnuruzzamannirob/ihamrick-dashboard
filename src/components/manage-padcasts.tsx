import { useSelector } from "react-redux";
import { RootState } from "../../services/store";

export function ManagePodcasts() {
  // Access podcasts directly from state.media.podcasts.data.podcasts
  const podcasts = useSelector((state: RootState) => state.media.podcasts?.data?.podcasts);

  // Log the podcasts to inspect the data
  console.log("Podcas:", podcasts);

  // Limit the number of podcasts to display (first 5)
  const limitedPodcasts = Array.isArray(podcasts) ? podcasts.slice(0, 5) : [];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-2xl font-poppins font-semibold text-black">
        Manage Podcasts
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="pb-3 text-left font-poppins font-bold text-base text-[#383232]">
                Title
              </th>
              <th className="pb-3 text-left font-poppins font-bold text-base text-[#383232]">
                Cover Image
              </th>
              <th className="pb-3 text-center font-poppins font-bold text-base text-[#383232]">
                Total Listeners
              </th>
              <th className="pb-3 text-center font-poppins font-bold text-base text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {limitedPodcasts.map((podcast, index) => {
              console.log("Podcast Data:", podcast); // This will log each podcast's data
              return (
                <tr
                  key={index}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="py-3 font-poppins font-normal text-base text-[#333333]">
                    {podcast.title}
                  </td>
                  <td className="py-3 font-poppins text-left text-base text-[#333333]">
                    <img
                      src={podcast.coverImage || "/path/to/default/thumbnail"} // Fallback image if no coverImage URL is provided
                      alt={podcast.title}
                      width={50}
                      height={50}
                      className="object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 text-center font-poppins font-normal text-base text-[#333333]">
                    {podcast.totalListeners}
                  </td>
                  <td className="py-3 text-center font-poppins font-normal text-base text-[#333333]">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        podcast.status === "live"
                          ? "bg-[#D75757] text-white" // Red for live
                          : podcast.status === "ended"
                          ? "bg-[#9E9E9E] text-white" // Gray for ended
                          : "bg-[#3B82F6] text-white" // Blue for scheduled
                      }`}
                    >
                      {podcast.status === "live"
                        ? "Live"
                        : podcast.status === "ended"
                        ? "Ended"
                        : "Scheduled"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
