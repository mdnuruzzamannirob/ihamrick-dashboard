const blogs = [
  { title: "Healthy Living Happier Life", status: "published" },
  { title: "Small Habits Big Health", status: "published" },
  { title: "Small Habits Big Health", status: "unpublished" },
  { title: "Healthy Living Happier Life", status: "unpublished" },
];

export function ManageBlog() {
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
              <th className="pb-3 text-right text-base font-poppins font-bold text-[#383232]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-3 font-poppins font-normal text-base text-[#333333]">
                  {blog.title}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-block rounded-full px-3 font-poppins py-1 text-xs font-semibold ${
                      blog.status === "published"
                        ? "bg-[#D75757] text-white"
                        : "bg-[#262626] text-white"
                    }`}
                  >
                    {blog.status === "published" ? "Published" : "Unpublished"}
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
