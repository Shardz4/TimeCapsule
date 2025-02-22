import React, { useState } from 'react';
import axios from 'axios';

function CapsuleForm({ token, onCapsuleCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [media, setMedia] = useState(null);
  const [collaborators, setCollaborators] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('releaseDate', releaseDate);
    formData.append('collaborators', collaborators);
    formData.append('isPublic', false);
    if (media) formData.append('media', media);

    await axios.post('/api/capsules', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    onCapsuleCreated();
    setTitle('');
    setContent('');
    setReleaseDate('');
    setMedia(null);
    setCollaborators('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#34ace0] to-[#55E6C1] ">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Create a Capsule</h2>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Capsule Title"
          required
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
  
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Capsule Content"
          required
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
  
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
  
        <input
          type="file"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
        />
  
        <input
          type="text"
          value={collaborators}
          onChange={(e) => setCollaborators(e.target.value)}
          placeholder="Collaborators (comma-separated emails)"
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Capsule
        </button>
      </form>
    </div>
  );
  
}

export default CapsuleForm;
