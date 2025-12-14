"use client"
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setVideos, setPodcasts, setPublications, setBlogs } from "../../../services/slices/mediaSlice";
import { Sidebar } from "@/components/sidebar";
import { StatCards } from "@/components/stat-cards";
import { ManageBlog } from "@/components/manage-blog";
import { ManageVideos } from "@/components/manage-videos";
import { ManagePodcasts } from "@/components/manage-padcasts";
import { ManagePublications } from "@/components/manage-publications";
import { UserProfile } from "@/components/user-profile";
import { useGetBlogsQuery, useGetPodcastsQuery, useGetPublicationsQuery, useGetVideosQuery, useSentNotificationsMutation } from "../../../services/allApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/store";
import QualityOfLifeModal from "@/components/modal/qualityModal";
import { useGetSocialLinksQuery, useUpdateSocialLinkMutation } from "../../../services/allApi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  
  // Fetch data using RTK Query hooks
  const { data: videos, isLoading: isVideosLoading } = useGetVideosQuery();
  const { data: podcasts, isLoading: isPodcastsLoading } = useGetPodcastsQuery();
  const { data: publications, isLoading: isPublicationsLoading } = useGetPublicationsQuery();
  const { data: blogs, isLoading: isBlogsLoading } = useGetBlogsQuery();
  const { data: socialLinks, isLoading: isSocialLinksLoading } = useGetSocialLinksQuery();

  // Use the sentNotifications mutation
  const [sendNotifications, { isLoading: isNotificationLoading }] = useSentNotificationsMutation();
  
  // Use the updateSocialLink mutation
  const [updateSocialLink] = useUpdateSocialLinkMutation();

  // Local state for editable links
  const [editableLinks, setEditableLinks] = useState<{ [key: string]: boolean }>({});

  // Access the Redux state using useSelector
  const mediaState = useSelector((state: RootState) => state.media);

  // Dispatch data to Redux when available
  useEffect(() => {
    if (videos) dispatch(setVideos(videos));
    if (podcasts) dispatch(setPodcasts(podcasts));
    if (publications) dispatch(setPublications(publications));
    if (blogs) dispatch(setBlogs(blogs));
  }, [dispatch, videos, podcasts, publications, blogs]);

  // Handle Notify All button click
  const handleNotifyAll = () => {
    sendNotifications()
      .unwrap()
      .then((response) => {
        setResponseMessage(response?.message);
        setShowResponseModal(true);

      })
      .catch((error) => {
        console.log(error);
        setResponseMessage(error?.data?.message || "An error occurred");
        setShowResponseModal(true);
      });
  };
const handleSaveLink = async (id: string, updatedLink: string, platformName: string) => {
  try {
    const response = await updateSocialLink({
      id,
      data: {
        url: updatedLink, // Updated URL
        name: platformName, // Send the platform name along with the URL
      },
    }).unwrap();
    
    // Show a success toast
    toast.success(`${platformName} Link updated successfully`);
    setEditableLinks((prev) => ({ ...prev, [id]: false })); // Set the link to non-editable after saving
  } catch (err) {
    console.log(err);
    console.log("Error updating link:", err);
    // Show an error toast
    toast.error("Failed to update the link");
  }
};

  // Function to handle editing the social link
  const handleEditLink = (id: string) => {
    setEditableLinks((prev) => ({ ...prev, [id]: true })); // Enable editing for the link
  };

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
          <div className="flex justify-center mt-4">
            <button
              onClick={handleNotifyAll}
              className="px-6 py-3 bg-green-400 text-black rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105 active:scale-95"
            >
              Notify Subscribers About New Updates
            </button>
          </div>

          {isNotificationLoading && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
            </div>
          )}

  

          {/* Show the response modal */}
          {showResponseModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 ease-out scale-105">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Notification Status</h2>
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{responseMessage}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ManageBlog />
            <ManageVideos />
            <ManagePodcasts />
            <ManagePublications />
          </div>
                  {/* Social Links Table - Positioned at the bottom of the page */}
          <div className="mt-12">
            <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
              <table className="min-w-full bg-white table-auto border-separate border-spacing-0">
                <thead>
                  <tr className="text-gray-700 bg-gray-100">
                    <th className="py-3 px-6 text-left text-sm font-semibold border-b border-gray-200">
                      Social Platform
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold border-b border-gray-200">
                      Link
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isSocialLinksLoading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    socialLinks?.data?.map((link) => (
                      <tr
                        key={link._id}
                        className="transition duration-200 ease-in-out hover:bg-gray-50"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-gray-700 border-b border-gray-200">
                          {link.name}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-800 border-b border-gray-200">
                          <input
                            type="text"
                            defaultValue={link.url}
                            className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            id={`link-${link._id}`}
                            disabled={!editableLinks[link._id]} // Only allow editing if isEditable is true
                          />
                        </td>
                        <td className="py-4 px-6 text-sm border-b border-gray-200">
                          <button
                            onClick={() => {
                              const updatedLink = (
                                document.getElementById(`link-${link._id}`) as HTMLInputElement
                              ).value;
                              if (editableLinks[link._id]) {
                                // Save the link, passing the name of the platform along with the updated link
                                handleSaveLink(link._id, updatedLink, link.name);
                              } else {
                                handleEditLink(link._id); // Enable editing
                              }
                            }}
                            className={`px-6 py-2 text-sm font-medium rounded-md focus:outline-none transition duration-200 ease-in-out ${
                              editableLinks[link._id]
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-yellow-400 text-gray-700 hover:bg-yellow-500"
                            }`}
                          >
                            {editableLinks[link._id] ? "Save" : "Edit"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
