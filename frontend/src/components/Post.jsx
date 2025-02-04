import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parse, icon } from '@fortawesome/fontawesome-svg-core';
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faThumbsUp, faComment, faShareAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import "./Post1.css"

import PostAction from "./PostAction";

const Post = ({ post }) => {
  const { postId } = useParams();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  
  const isOwner = (authUser?._id === post?.author?._id) || (authUser?._id === post?.author);
  const navigate = useNavigate();
  
  const isLiked = post?.likes?.includes(authUser?._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
      navigate(`/profile/${authUser.username}`)
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/post/${post._id}/comment`, { content: newComment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to add comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/post/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleLikePost = async () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleCopyClick = async (id) => {
//     // alert("copying" , id);
//     const apiUrl = import.meta?.env?.CLIENT_URL; // Accessing VITE_API_URL from .env
// console.log(apiUrl);
//     console.log(process?.env?.CLIENT_URL);
    try {
      // Attempt to copy the URL to the clipboard
      await navigator.clipboard.writeText(`https://connectpro-5qfl.onrender.com/post/${id}`);
      toast.success('copied to clipboard');
      setCopySuccess('Copied to clipboard!');  // Provide feedback
    } catch (error) {
      setCopySuccess('Failed to copy!');  // Handle failure if any
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  // Function to determine if the media URL is a video
  const isVideo = (url) => {
    return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
  };

  return (
    <div className="rounded-lg shadow mb-4 bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center ">
            <Link to={`/profile/${post?.author?.username}`} className="no-underline">
              <img
                src={post?.author?.profilePicture || "/avatar.png"}
                alt={post?.author?.name}
                className="size-10 rounded-full mr-3"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post?.author?.name}</h3>
              </Link>
              <p className="text-xs text-info">{post?.author?.headline}</p>
              <p className="text-xs text-info">
                {formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700 border-0  bg-white" // Remove border and set background color to white
            >
              {isDeletingPost ? <Loader size={18} className="animate-spin" /> : <FontAwesomeIcon icon={faTrashAlt} size="lg" />}
            </button>
          )}
        </div>
        <div className="gradient-line"></div>
        <p className="mb-4 ">{post?.content}</p>
        
        {/* Render Image or Video based on URL */}
        {post?.image && (
  isVideo(post?.image) ? (
    <video
      controls
      className="rounded-lg w-full mb-4"
      style={{
        maxHeight: '600px',
        objectFit: 'cover',
        width: '100%',
        transition: 'opacity 0.1s ease-in-out', // Transition for opacity
      }}
      onMouseEnter={(e) => e.target.play()} // Play video on hover
      onMouseLeave={(e) => e.target.pause()} // Pause video when not hovered
    >
      <source src={post.image} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <img
      src={post.image}
      alt="Post content"
      className="rounded-lg w-full mb-4"
      style={{ maxHeight: '500px', objectFit: 'cover' }}
    />
  )
)}


        <div className="border-t-2 border-Purple-500 mt-4 pt-4 flex justify-between ">
          <PostAction
            icon={
              <FontAwesomeIcon
                icon={faThumbsUp}
                size="lg"
                className={`${isLiked ? "text-Purple-500 " : ""}icon-custom`} // Remove border and set background to white
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<FontAwesomeIcon icon={faComment} size="lg" className="icon-custom" />}
            text={<span className="text-purple">Comment ({comments.length})</span>}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction
            icon={<FontAwesomeIcon icon={faShareAlt} size="lg" className="icon-custom" />}
            text="Share"
            onClick={()=>handleCopyClick(post._id)}
          />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment._id} className="mb-2 bg-base-100 p-2 rounded flex items-start">
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">{comment.user.name}</span>
                    <span className="text-xs text-info">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? <Loader size={18} className="animate-spin" /> : <FontAwesomeIcon icon={faPaperPlane} size="lg" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
