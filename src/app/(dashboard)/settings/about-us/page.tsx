'use client';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import AboutUsEditor from '@/components/ui/about-us-editor';
import { toast } from 'react-toastify';
import { useUpdateAboutUsMutation } from '../../../../../services/allApi';

export default function AboutUs() {
  const [updateAboutUs, { isLoading }] = useUpdateAboutUsMutation();

  // Function to handle saving the updated content
  const handleSave = async (updatedContent: string) => {
    try {
      await updateAboutUs({ content: { content: updatedContent } }).unwrap();
      toast.success('About Us updated successfully!');
    } catch (err) {
      toast.error('Failed to update About Us');
      console.error('Error updating About Us:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="min-h-screen flex-1 items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mb-8 flex items-center justify-end">
          <UserProfile />
        </div>

        {/* Pass handleSave and isLoading as props to AboutUsEditor */}
        <AboutUsEditor title="About Us" onSave={handleSave} isLoading={isLoading} />
      </div>
    </div>
  );
}
