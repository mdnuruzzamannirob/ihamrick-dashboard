"use client";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { UserProfile } from "@/components/user-profile";
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight, Loader } from "lucide-react";  // Import the Loader icon
import UploadModal from "@/components/modal/uploadModal";
import { DeleteConfirmationModal } from "@/components/modal/deleteModal";
import { ViewBlogModal } from "@/components/modal/viewModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../services/store";
import { useDeleteBlogMutation } from "../../../services/allApi";
import { setBlogs } from "../../../services/slices/mediaSlice";

const ITEMS_PER_PAGE = 10;

export default function ManageBlogPage() {
  const blogs = useSelector((state: RootState) => state.media.blogs.data);
  const dispatch = useDispatch();  // Dispatch to Redux store

  // Hook for deleting a blog
  const [deleteBlog, { isLoading, isError, error }] = useDeleteBlogMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);  // selected blog for edit
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [blogToView, setBlogToView] = useState<any | null>(null);  // blog to view in view modal

  // Calculations for pagination
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handleViewClick = (blog: any) => {
    setBlogToView(blog);
    setIsViewModalOpen(true);  // Open the ViewModal with the blog's details
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setBlogToView(null);  // Reset blog data when closing the modal
  };

  const handleDeleteClick = (id: any) => {
    setBlogToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete !== null) {
      try {
        // Call the delete API
        await deleteBlog(blogToDelete).unwrap();

        // Remove the deleted blog from the local blogs list (state)
        const updatedBlogs = blogs.filter((blog) => blog._id !== blogToDelete);

        // Dispatch the updated blogs list to Redux
        dispatch(setBlogs({ success: true, message: "", meta: { page: 1, limit: 10, total: updatedBlogs.length, totalPages: 1 }, data: updatedBlogs }));

        setBlogToDelete(null);
        setDeleteModalOpen(false);
      } catch (err) {
        console.error("Failed to delete the blog:", err);
        // Handle error feedback to the user here
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog);  // Set the blog data for editing
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);  // Reset selected blog when closing modal
  };

  const handleSaveChanges = (updatedBlog: any) => {
    setIsModalOpen(false);
  };

  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Full-Screen Loader (Overlay) */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <Loader className="text-white w-16 h-16 animate-spin" />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-poppins font-semibold text-black md:text-3xl">
              Manage Blog
            </h1>
            <div className="flex items-center gap-3">
              <UserProfile />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 justify-end flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center font-poppins gap-2 rounded-lg bg-black px-4 py-2 text-base font-medium text-white transition-colors hover:bg-neutral-800"
            >
              <span className="text-base">+</span>
              Add
            </button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 md:px-6">
                      Title
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900 md:px-6">
                      Image
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900 md:px-6">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900 md:px-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {currentBlogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-4 py-4 text-sm text-neutral-900 md:px-6">
                        {blog.title}
                      </td>
                      <td className="px-4 py-4 text-center md:px-6">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-16 h-16 object-cover rounded mx-auto"
                        />
                      </td>
                      <td className="px-4 py-4 md:px-6 text-center">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${
                            blog.status === true ? "bg-red-400" : "bg-black"
                          }`}
                        >
                          {blog.status === true ? "Published" : "Unpublished"}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog._id)}
                            className="rounded-lg bg-red-400 p-2 text-white transition-colors hover:bg-red-500"
                            aria-label="Delete"
                            disabled={isLoading}  // Disable button when loading
                          >
                            {isLoading ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleViewClick(blog)}
                            className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
                            aria-label="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-neutral-200 bg-white px-4 py-4 md:px-6">
              <div className="flex items-center justify-center gap-1">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-neutral-600">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-red-500 text-white"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        post={selectedBlog}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
      <ViewBlogModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        blog={blogToView}
      />
    </div>
  );
}
