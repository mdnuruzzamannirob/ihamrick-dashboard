import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export function ManagePodcasts() {
  // Access podcasts directly from state.media.podcasts.data.podcasts
  const podcasts = useSelector((state: RootState) => state.media.podcasts?.data?.podcasts);

  // Limit the number of podcasts to display (first 5)
  const limitedPodcasts = Array.isArray(podcasts) ? podcasts.slice(0, 5) : [];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="font-poppins mb-4 text-2xl font-semibold text-black">Manage Podcasts</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="font-poppins pb-3 text-left text-base font-bold text-[#383232]">
                Title
              </th>

              <th className="font-poppins pb-3 text-left text-base font-bold text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {limitedPodcasts.map((podcast, index) => {
              // This will log each podcast's data
              return (
                <tr key={index} className="border-b border-neutral-100 last:border-0">
                  <td className="font-poppins max-w-40 truncate py-3 pr-3 text-left text-base font-normal text-[#333333]">
                    {podcast.title}
                  </td>

                  <td className="font-poppins py-3 pr-3 text-left text-base font-normal text-[#333333]">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        podcast.status === 'live'
                          ? 'bg-[#D75757] text-white' // Red for live
                          : podcast.status === 'ended'
                            ? 'bg-[#9E9E9E] text-white' // Gray for ended
                            : 'bg-[#3B82F6] text-white' // Blue for scheduled
                      }`}
                    >
                      {podcast.status === 'live'
                        ? 'Live'
                        : podcast.status === 'ended'
                          ? 'Ended'
                          : 'Scheduled'}
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
