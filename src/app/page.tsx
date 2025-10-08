import { Sidebar } from "@/components/sidebar";
import { StatCards } from "@/components/stat-cards";
import { ManageBlog } from "@/components/manage-blog";
import { ManageVideos } from "@/components/manage-videos";
import { ManagePodcasts } from "@/components/manage-padcasts";
import { ManagePublications } from "@/components/manage-publications";
import { UserProfile } from "@/components/user-profile";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* User Profile */}
          <div className="mb-6 flex justify-end">
            <UserProfile />
          </div>

          {/* Stat Cards */}
          <StatCards />

          {/* Data Tables Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ManageBlog />
            <ManageVideos />
            <ManagePodcasts />
            <ManagePublications />
          </div>
        </div>
      </div>
    </div>
  );
}
