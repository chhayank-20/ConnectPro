import React, { useState } from 'react';
import axios from 'axios';
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from 'react-router-dom';

const ProfileSetupForm = () => {
  // States for name, interests, selected interest, username, and profile picture
  const [name, setName] = useState('');
  const [interest, setInterest] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]); // Track selected interests
  const [username, setUsername] = useState(''); // Username state
  const defaultImage = 'avatar.png';  // Path to your default image
  let [profilePicture, setProfilePicture] = useState(defaultImage); // Profile picture state
  const [previewImage, setPreviewImage] = useState(defaultImage); // For image preview

  const navigate = useNavigate();
  
  // Predefined interest suggestions
  const interestSuggestions = [
    "Artificial Intelligence (AI)",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "Software Engineering",
    "Web Development"
  ];

  // Handle name input change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle username input change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle interest selection (toggle selected state)
  const handleInterestSelect = (suggestedInterest) => {
    setSelectedInterests(prevSelectedInterests => {
      if (prevSelectedInterests.includes(suggestedInterest)) {
        // Remove from selected if already selected (unselect it)
        return prevSelectedInterests.filter(interest => interest !== suggestedInterest);
      } else {
        // Add to selected if not selected yet
        return [...prevSelectedInterests, suggestedInterest];
      }
    });
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setProfilePicture(file);

      // Create a URL for the selected image to preview it
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    profilePicture= await readFileAsDataURL(profilePicture);

    const formData = {
      name , username , interest : selectedInterests , profilePicture
    }

    try {
      console.log(formData);
      const response = await axiosInstance.put('/users/profile', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('User data submitted successfully:', response.data);
      
      // Reset form after successful submission
      setName('');
      setUsername('');
      setInterest([]);
      setSelectedInterests([]);
      setProfilePicture(null);
      setPreviewImage(null); // Reset image preview

      navigate('/home');
    } catch (error) {
      console.error('Error submitting user data:', error);
      alert('Error submitting data.');
    }

    // navigate("/home");
  };

  return (
    <div className="container">
      <h1 className="text-center h2 mb-2">Make the most of your professional life</h1>

      <form onSubmit={handleSubmit} className="bg-light p-6 rounded shadow">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter full name"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter username"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="interest" className="form-label">Select your Interests</label>
          <div className="d-flex flex-wrap">
            {interestSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className={`btn me-2 mb-2 ${selectedInterests.includes(suggestion) ? 'btn bg-gradient-to-r from-blue-800 to-purple-500 text-white' : 'btn-outline-primary'}`}
                onClick={() => handleInterestSelect(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            className="form-control"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          {previewImage && (
            <div className="mt-3">
              <h5>Profile Picture Preview:</h5>
              <img src={previewImage} alt="Profile Preview" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="btn bg-gradient-to-r from-purple-800 to-blue-800 w-100 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProfileSetupForm;
