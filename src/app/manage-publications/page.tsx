"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { UserProfile } from "@/components/user-profile";
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import UploadModal from "@/components/modal/uploadModal";
import { DeleteConfirmationModal } from "@/components/modal/deleteModal";
import { ViewBlogModal } from "@/components/modal/viewModal";
import QualityOfLifeModal from "@/components/modal/qualityModal";
import { PublicationModal } from "@/components/modal/publication-modal";

interface BlogPost {
  id: number;
  title: string;
  status: "Published" | "Unpublished";
}

const ITEMS_PER_PAGE = 10;

// Sample data - 50 blog posts for pagination demo
const allBlogPosts: BlogPost[] = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  title:
    i % 2 === 0 ? "Healthy Living Happier Life" : "Small Habits Big Health",
  status: i % 3 === 0 ? "Unpublished" : "Published",
}));

export default function ManageBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(allBlogPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [postToView, setPostToView] = useState<BlogPost | null>(null);

  //calculations
  const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const handleViewClick = (post: BlogPost) => {
    setPostToView(post);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setPostToView(null);
  };
  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete !== null) {
      setBlogPosts((prev) => {
        const updatedPosts = prev.filter((post) => post.id !== postToDelete);

        // Recalculate total pages based on updated posts
        const newTotalPages = Math.ceil(updatedPosts.length / ITEMS_PER_PAGE);

        // Adjust current page if needed after deletion
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        return updatedPosts;
      });
    }
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };
  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleSave = (data: {
    title: string;
    status: string;
    description: string;
    file?: File;
  }) => {
    console.log("Saving:", data);
    console.log("For post:", selectedPost);
    // Add your save logic here (API call, etc.)
    setIsModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-poppins font-semibold text-black md:text-3xl">
              Manage Publications
            </h1>

            <div className="flex items-center gap-3">
              <UserProfile />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 justify-end flex flex-wrap items-center gap-3">
            <QualityOfLifeModal />
            <PublicationModal />
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
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900 md:px-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {currentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-4 py-4 text-sm text-neutral-900 md:px-6">
                        {post.title}
                      </td>
                      <td className="px-4 py-4 text-center md:px-6">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${
                            post.status === "Published"
                              ? "bg-red-400"
                              : "bg-neutral-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.id)}
                            className="rounded-lg bg-red-400 p-2 text-white transition-colors hover:bg-red-500"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewClick(post)}
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
      {/* Add Modal Here */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        post={selectedPost}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
      <ViewBlogModal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        blog={postToView}
      />
    </div>
  );
}
