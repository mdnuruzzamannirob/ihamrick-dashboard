import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export function ManageVideos() {
  // Fetch the videos from the Redux state
  const videos = useSelector((state: RootState) => state.media.videos.data);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="font-poppins mb-4 text-2xl font-semibold text-black">Manage Videos</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="font-poppins pb-3 text-left text-base font-bold text-[#383232]">
                Title
              </th>
              <th className="font-poppins pb-3 text-left text-base font-bold text-[#383232]">
                Thumbnail
              </th>
              <th className="font-poppins hidden pb-3 text-center text-base font-bold text-[#383232] sm:table-cell">
                Views
              </th>
              <th className="font-poppins pb-3 text-center text-base font-bold text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.slice(0, 5).map((video, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-poppins text-base font-normal text-[#333]">
                      {video.title}
                    </span>
                  </div>
                </td>
                <td className="font-poppins py-3 text-left text-base text-[#333]">
                  <Image
                    src={video.thumbnailUrl || '/path/to/default/thumbnail'} // Use fallback image if no thumbnail URL is provided
                    alt={video.title}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                </td>
                <td className="font-poppins hidden py-3 text-center text-base font-medium text-black sm:table-cell">
                  {video.views}
                </td>
                <td className="font-poppins py-3 text-center text-base font-normal text-[#333]">
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
