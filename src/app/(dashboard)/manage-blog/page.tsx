'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  Music,
  FileText,
  Calendar,
} from 'lucide-react';
import UploadModal from '@/components/modal/uploadModal';
import { ViewBlogModal } from '@/components/modal/viewModal';
import DeleteConfirmationModal from '@/components/modal/deleteModal';
import { useGetBlogsQuery, useDeleteBlogMutation } from '../../../../services/allApi';
import { toast } from 'react-toastify';
import { dateFormatter } from '@/utils/dateFormatter';

const ITEMS_PER_PAGE = 10;

export default function ManageBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [blogToView, setBlogToView] = useState<any | null>(null);

  // API Hooks
  const { data, isLoading, refetch, isFetching } = useGetBlogsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();

  useEffect(() => {
    if (data?.data) setBlogs(data.data);
  }, [data]);

  // Pagination Logic
  const totalBlogs = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  // --- Sorting Handler ---
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Helper to render sort icon

  const renderSortIcon = (field: string) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown
          size={14}
          className="ml-1 text-neutral-300 transition hover:text-neutral-500"
        />
      );
    return (
      <ArrowUpDown
        size={14}
        className={`ml-1 ${sortOrder === 'asc' ? 'rotate-180 transform text-blue-600' : 'text-blue-600'}`}
      />
    );
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await deleteBlog(blogToDelete).unwrap();
        toast.success('Blog deleted successfully');
        setDeleteModalOpen(false);
        setBlogToDelete(null);
        refetch();
      } catch (err) {
        toast.error('Failed to delete blog');
        console.error(err);
      }
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-black md:text-3xl">Manage Blog</h1>
            <UserProfile />
          </div>

          {/* Add Blog Button Area */}
          <div className="mb-6 flex justify-end">
            <UploadModal
              refetch={refetch}
              selectedBlog={selectedBlog}
              onCloseTrigger={() => setSelectedBlog(null)}
            />
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-3xl border border-neutral-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr className="text-left text-xs font-black tracking-widest text-neutral-500 uppercase">
                    {/* Sortable Title */}
                    <th
                      className="cursor-pointer px-6 py-4 transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">Title {renderSortIcon('title')}</div>
                    </th>

                    {/* Audio Column (Not sortable) */}
                    <th className="px-6 py-4">Audio Track</th>

                    {/* Sortable Date Column */}
                    <th
                      className="cursor-pointer px-6 py-4 transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('uploadDate')}
                    >
                      <div className="flex items-center">Date {renderSortIcon('uploadDate')}</div>
                    </th>

                    {/* Sortable Status */}
                    <th
                      className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status {renderSortIcon('status')}
                      </div>
                    </th>

                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                          <p className="text-sm font-medium text-neutral-500">Getting blogs...</p>
                        </div>
                      </td>
                    </tr>
                  ) : blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <tr key={blog._id} className="transition-colors hover:bg-neutral-50">
                        {/* Title */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                              <FileText size={18} />
                            </div>
                            <span className="max-w-[180px] truncate text-sm font-semibold text-neutral-800">
                              {blog.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {blog.audioSignedUrl || blog.audioUrl ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center text-neutral-400">
                                <Music size={16} />
                              </div>

                              <audio
                                controls
                                src={blog.audioSignedUrl || blog.audioUrl}
                                className="h-12 w-44 md:w-60"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">No Audio</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="min-w-3.5 text-neutral-300" />
                            <span className="font-medium">
                              {blog?.status === 'scheduled'
                                ? dateFormatter(blog?.scheduledAt)
                                : dateFormatter(blog.uploadDate)}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                              blog.status === 'published'
                                ? 'bg-black text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {blog.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedBlog(blog)}
                              className="rounded-lg bg-neutral-100 p-2 transition-all hover:bg-black hover:text-white"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setBlogToDelete(blog._id);
                                setDeleteModalOpen(true);
                              }}
                              className="rounded-lg bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setBlogToView(blog);
                                setIsViewModalOpen(true);
                              }}
                              className="rounded-lg bg-neutral-100 p-2 transition-all hover:bg-black hover:text-white"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-neutral-400">
                        No blogs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-100 bg-white px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-neutral-600">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </button>

                    <div className="hidden gap-1 md:flex">{renderPageNumbers()}</div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
      />
      <ViewBlogModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        blog={blogToView}
      />
    </div>
  );
}
