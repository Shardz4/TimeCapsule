import React from "react";

function CapsuleList({ capsules = [] }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Your Capsules
      </h2>
      {capsules.length === 0 ? (
        <p className="text-center text-gray-500">No capsules found.</p>
      ) : (
        <div
          className={`grid gap-6 items-center ${
            capsules.length === 1 ? "justify-center grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          {capsules.map((capsule) => (
            <div
              key={capsule._id}
              className="bg-gray-200 shadow-lg rounded-2xl p-5 border border-gray-200 transition-transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-gray-900">{capsule.title}</h3>

              {!capsule.hashValid ? (
                <p className="text-red-500 font-medium mt-2">
                  ⚠️ Warning: This capsule’s integrity could not be verified.
                </p>
              ) : capsule.locked ? (
                <p className="text-gray-600 mt-2">
                  🔒 Locked until{" "}
                  <span className="font-medium">
                    {new Date(capsule.releaseDate).toLocaleDateString()}
                  </span>
                </p>
              ) : (
                <div className="mt-3">
                  <p className="text-gray-700">{capsule.content}</p>
                  {capsule.media && (
                    <img
                      src={capsule.media}
                      alt="Capsule media"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      className="w-full h-48 object-contain rounded-lg mt-3"
                    />
                  )}
                </div>
              )}

              {capsule.emotions && (
                <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-700">Emotions:</h4>
                  <ul className="list-none flex flex-wrap gap-2 mt-1">
                    {Object.entries(capsule.emotions).map(([emotion, score]) => (
                      <li
                        key={emotion}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                        {(score * 100).toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CapsuleList;
