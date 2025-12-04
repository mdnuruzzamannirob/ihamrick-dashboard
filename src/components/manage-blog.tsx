import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export function ManageBlog() {
  // Fetch the blogs from the Redux state
  const blogs = useSelector((state: RootState) => state.media.blogs.data);

  // Get the first 5 blogs
  const limitedBlogs = blogs.slice(0, 5);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-2xl font-poppins font-semibold text-black">
        Manage Blog
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="pb-3 text-left font-poppins text-base font-bold text-[#383232]">
                Title
              </th>
              <th className="pb-3 text-left font-poppins text-base font-bold text-[#383232]">
                Cover Image
              </th>
              <th className="pb-3 text-center font-poppins text-base font-bold text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {limitedBlogs.map((blog, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-0">
                <td className="py-3 font-poppins font-normal text-base text-[#333333]">
                  {blog.title}
                </td>
                <td className="py-3 font-poppins font-normal text-base text-[#333333]">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-3 text-center font-poppins font-normal text-base text-[#333333]">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      blog.status ? 'bg-[#D75757] text-white' : 'bg-[#262626] text-white'
                    }`}
                  >
                    {blog.status ? 'Published' : 'Unpublished'}
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
