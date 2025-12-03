"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setVideos,
  setPodcasts,
  setPublications,
  setBlogs,
} from "../../../services/slices/mediaSlice";
import { Sidebar } from "@/components/sidebar";
import { StatCards } from "@/components/stat-cards";
import { ManageBlog } from "@/components/manage-blog";
import { ManageVideos } from "@/components/manage-videos";
import { ManagePodcasts } from "@/components/manage-padcasts";
import { ManagePublications } from "@/components/manage-publications";
import { UserProfile } from "@/components/user-profile";
import {
  useGetBlogsQuery,
  useGetPodcastsQuery,
  useGetPublicationsQuery,
  useGetVideosQuery,
} from "../../../services/allApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/store";
import QualityOfLifeModal from "@/components/modal/qualityModal";
const DashboardPage = () => {
  const dispatch = useDispatch();

  // Fetch data using RTK Query hooks
  const { data: videos, isLoading: isVideosLoading } = useGetVideosQuery();
  const { data: podcasts, isLoading: isPodcastsLoading } = useGetPodcastsQuery();
  const { data: publications, isLoading: isPublicationsLoading } =
    useGetPublicationsQuery();
  const { data: blogs, isLoading: isBlogsLoading } = useGetBlogsQuery();

  // Access the Redux state using useSelector
  const mediaState = useSelector((state: RootState) => state.media);

  // Dispatch data to Redux when available
  useEffect(() => {
    if (videos) dispatch(setVideos(videos));
    if (podcasts) dispatch(setPodcasts(podcasts));
    if (publications) dispatch(setPublications(publications));
    if (blogs) dispatch(setBlogs(blogs));
  }, [dispatch, videos, podcasts, publications, blogs]);

  useEffect(() => {
    if (
      !isVideosLoading &&
      !isPodcastsLoading &&
      !isPublicationsLoading &&
      !isBlogsLoading
    ) {
      console.log("Current Media State after all data is saved:", mediaState);
    }
  }, [mediaState, isVideosLoading, isPodcastsLoading, isPublicationsLoading, isBlogsLoading]);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex justify-end">
            <UserProfile />
          </div>
          <StatCards />
         {/* Centering the QualityOfLifeModal */}
          <div className="flex items-center justify-center mt-6">
            <QualityOfLifeModal />
          </div>
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
};

export default DashboardPage;
