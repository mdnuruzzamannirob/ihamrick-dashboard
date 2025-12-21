'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import AboutUsEditor from '@/components/ui/about-us-editor';
import { useUpdatePrivacyPolicyMutation } from '../../../../services/allApi'; // Import the privacy policy mutation
import { toast } from 'react-toastify';
export default function PrivacyPolicy() {
  // Use the updatePrivacyPolicy mutation hook
  const [updatePrivacyPolicy, { isLoading }] = useUpdatePrivacyPolicyMutation();

  // Handle save for Privacy Policy
  const handleSave = async (updatedContent: string) => {
    try {
      await updatePrivacyPolicy({
        content: { content: updatedContent },
      }).unwrap();
      toast.success('Privacy Policy updated successfully!');
    } catch {
      toast.error('Failed to update Privacy Policy');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="min-h-screen flex-1 items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mb-8 flex items-center justify-end">
          <UserProfile />
        </div>

        <AboutUsEditor title="Privacy Policy" onSave={handleSave} isLoading={isLoading} />
      </div>
    </div>
  );
}
