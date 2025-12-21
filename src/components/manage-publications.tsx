import { useSelector } from 'react-redux';
import { RootState } from '../../services/store'; // Adjust path if necessary
import Image from 'next/image';

export function ManagePublications() {
  // Fetch publications from Redux state
  const publications = useSelector((state: RootState) => state.media.publications.data);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="font-poppins mb-4 text-2xl font-semibold text-black">Manage Publications</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="font-poppins pb-3 text-left text-base font-bold text-[#383232]">
                Title
              </th>
              <th className="font-poppins pb-3 text-center text-base font-bold text-[#383232]">
                Cover Image
              </th>
              <th className="font-poppins pb-3 text-right text-base font-bold text-[#383232]">
                Author
              </th>
              <th className="font-poppins pb-3 text-center text-base font-bold text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {publications.slice(0, 5).map((publication, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-0">
                <td className="font-poppins py-3 text-left text-base font-normal text-[#333]">
                  {publication.title}
                </td>
                <td className="font-poppins py-3 text-center text-base font-normal text-[#333]">
                  <Image
                    src={publication.coverImage}
                    alt={publication.title}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                </td>
                <td className="font-poppins py-3 text-right text-base font-normal text-[#333]">
                  {publication.author}
                </td>

                <td className="font-poppins py-3 text-center text-base font-normal text-[#333]">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      publication.status ? 'bg-[#D75757] text-white' : 'bg-[#262626] text-white'
                    }`}
                  >
                    {publication.status ? '  Published' : '  Unpublished'}
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
