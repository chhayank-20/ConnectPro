import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      console.log(postData);
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to create post");
    },
  });

  const handleUploadFile = async (file) => {
    if (!file) return null; // If no file, return null
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "connectpro");
    data.append("cloud_name", "dcuh43ucc");

    if (file.type.startsWith("image/")) {
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dcuh43ucc/image/upload", {
          method: "POST",
          body: data,
        });
        const img = await res.json();
        console.log("Cloudinary upload response:", img);
        return img.secure_url; // Return the image URL
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return null;
      }
    } else if (file.type.startsWith("video/")) {
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dcuh43ucc/video/upload", {
          method: "POST",
          body: data,
        });
        const img = await res.json();
        console.log("Cloudinary upload response:", img);
        return img.secure_url; // Return the image URL
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return null;
      }
    }else{
      toast.error("couldn't upload file.");
    }
    
  };

  const handlePostCreation = async () => {
    try {
      // Upload the image to Cloudinary first
      const uploadedImageUrl = await handleUploadFile(image);
      
      if (!uploadedImageUrl) {
        toast.error("Failed to upload image to Cloudinary.");
        return;
      }

      // Now prepare the post data with the uploaded image URL
      const postData = { content, image: uploadedImageUrl };
      console.log("Post data:", postData);

      // Call the mutation to create the post with the image URL
      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      if (file.type.startsWith("image/")) {
        readFileAsDataURL(file).then(setImagePreview); // For images
      } else if (file.type.startsWith("video/")) {
        setImagePreview(URL.createObjectURL(file)); // For videos, use Object URL for preview
      }
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          {imagePreview.startsWith("data:image") ? (
            <img src={imagePreview} alt="Selected" className="w-full h-auto rounded-lg" />
          ) : (
            <video controls className="w-full h-auto rounded-lg">
              <source src={imagePreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span className="text-purple-800 hover:text-purple-400 transition-all duration-300">
              Photo/Video
            </span>

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="btn bg-blue text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition-colors duration-1000"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
