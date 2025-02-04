import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import toast from "react-hot-toast";
import { useState } from "react";
import UserAllPost from "../components/UserPosts";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  // Fetching authenticated user
  const { data: authUser, isLoading: isAuthLoading, error: authError } = useQuery({
    queryKey: ["authUser"],
  });

  // Fetching user profile
  const { data: userProfile, isLoading: isUserProfileLoading, error: profileError } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`).then((res) => res.data),
  });

  // Mutation for updating the profile
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  // State for collapsible section
  const [showExperience, setShowExperience] = useState(true);

  // Ensure hooks are always in the same order
  const isOwnProfile = authUser && userProfile ? authUser.username === userProfile.username : false;
  const userData = isOwnProfile ? authUser : userProfile;

  // Loading state
  if (isAuthLoading || isUserProfileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  // Error state
  if (authError || profileError) {
    return (
      <div className="text-center text-red-500">
        Failed to load profile. Please try again later.
      </div>
    );
  }


  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className={isOwnProfile ? "dark-theme max-w-4xl mx-auto p-4" : "light-theme max-w-4xl mx-auto p-4"}>
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />

      <div className="section">
        <button
          className="btn btn-secondary my-2"
          onClick={() => setShowExperience(!showExperience)}
        >
          {showExperience ? "Hide Experience" : "Show Experience"}
        </button>
        {showExperience && (
          <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
        )}
      </div>

      <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      
      <UserAllPost userData={userData} isOwnProfile={isOwnProfile}/>
      
    </div>
  );
};

export default ProfilePage;
