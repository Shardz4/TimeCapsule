import React, { useState } from 'react';

function CapsuleForm({ token, onCapsuleCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [media, setMedia] = useState(null);
  const [collaborators, setCollaborators] = useState('');
  const [emotions, setEmotions] = useState(null); // State to store emotions

  // Function to generate SHA-256 hash (unchanged, kept for future use)
  const generateHash = async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Function to simulate emotion generation
  const create = () => {
    // Return a static object with emotions and scores
    return {
      happy: 0.8,    // 80%
      emotional: 0.6, // 60%
      love: 0.9     // 90%
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate hash (optional, kept for consistency)
    const capsuleData = JSON.stringify({
      title,
      content,
      releaseDate,
      collaborators,
      isPublic: false
    });
    await generateHash(capsuleData); // Not used here, but kept for future integration

    // Call the create function to get emotions
    const generatedEmotions = create();
    setEmotions(generatedEmotions);

    // Simulate successful capsule creation
    onCapsuleCreated();

    // Reset form fields
    setTitle('');
    setContent('');
    setReleaseDate('');
    setMedia(null);
    setCollaborators('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Create a Capsule</h2>
        
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

        {/* Display emotions if they exist */}
        {emotions && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">Detected Emotions:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(emotions).map(([emotion, score]) => (
                <li key={emotion} className="text-gray-600">
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}: {(score * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default CapsuleForm;