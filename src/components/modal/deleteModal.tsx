"use client";

import { X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-poppins font-bold text-red-600">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-2 font-poppins text-base font-semibold text-neutral-900">
          Are you sure you want to delete this blog post?
        </p>
        <p className="mb-6 font-poppins text-sm text-neutral-600">
          This action is permanent and cannot be undone. The blog post will be
          removed from your system immediately.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 font-poppins rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-poppins font-medium text-white transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
