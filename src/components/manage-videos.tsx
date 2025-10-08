import Image from "next/image";
import videos_thumb from "@/assets/svg/videos_thumb.svg";
const videos = [
  {
    title: "Healthy Living Happier Life",
    duration: "5 mins",
    status: "published",
  },
  { title: "Small Habits Big Health", duration: "5 mins", status: "published" },
  {
    title: "Small Habits Big Health",
    duration: "5 mins",
    status: "unpublished",
  },
  {
    title: "Healthy Living Happier Life",
    duration: "5 mins",
    status: "unpublished",
  },
];

export function ManageVideos() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-2xl font-poppins font-semibold text-black">
        Manage Videos
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="pb-3 text-left font-poppins font-bold text-base text-[#383232]">
                Title
              </th>
              <th className="hidden pb-3 text-center font-poppins font-bold text-base text-[#383232] sm:table-cell">
                Duration
              </th>
              <th className="pb-3 text-right font-poppins font-bold text-base text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative items-center justify-center h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg ">
                      <Image
                        src={videos_thumb}
                        alt={video.title}
                        width={33}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-poppins font-normal text-base text-[#333]">
                      {video.title}
                    </span>
                  </div>
                </td>
                <td className="hidden py-3 font-poppins text-center text-base font-medium text-black sm:table-cell">
                  {video.duration}
                </td>
                <td className="py-3 text-right">
                  {/* <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      video.status === "published"
                        ? "bg-red-500 text-white"
                        : "bg-neutral-800 text-white"
                    }`}
                  >
                    {video.status === "published" ? "Published" : "Unpublished"}
                  </span> */}
                  <span
                    className={`inline-block rounded-full px-3 font-poppins py-1 text-xs font-semibold ${
                      video.status === "published"
                        ? "bg-[#D75757] text-white"
                        : "bg-[#262626] text-white"
                    }`}
                  >
                    {video.status === "published" ? "Published" : "Unpublished"}
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
