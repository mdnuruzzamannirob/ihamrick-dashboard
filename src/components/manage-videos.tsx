import Image from "next/image";
import { useSelector } from 'react-redux';
import { RootState } from "../../services/store";

export function ManageVideos() {
  // Fetch the videos from the Redux state
  const videos = useSelector((state: RootState) => state.media.videos.data);

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
              <th className="pb-3 text-left font-poppins font-bold text-base text-[#383232]">
                Thumbnail
              </th>
              <th className="hidden pb-3 text-center font-poppins font-bold text-base text-[#383232] sm:table-cell">
                Views
              </th>
              <th className="pb-3 text-center font-poppins font-bold text-base text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.slice(0, 5).map((video, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-poppins font-normal text-base text-[#333]">
                      {video.title}
                    </span>
                  </div>
                </td>
                <td className="py-3 font-poppins text-left text-base text-[#333]">
                  <Image
                    src={video.thumbnailUrl || "/path/to/default/thumbnail"} // Use fallback image if no thumbnail URL is provided
                    alt={video.title}
                    width={50}
                    height={50}
                    className="object-cover rounded-lg"
                    
                  />
                </td>
                <td className="hidden py-3 font-poppins text-center text-base font-medium text-black sm:table-cell">
                  {video.views}
                </td>
                <td className="py-3 text-center font-poppins font-normal text-base text-[#333]">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      video.status ? 'bg-[#D75757] text-white' : 'bg-[#262626] text-white'
                    }`}
                  >
                    {video.status ? 'Published' : 'Unpublished'}
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
