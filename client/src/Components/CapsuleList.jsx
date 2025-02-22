import React from 'react';

function CapsuleList({ capsules }) {
  return (
    <div className="capsule-list">
      <h2>Your Capsules</h2>
      {capsules.length === 0 ? (
        <p>No capsules found.</p>
      ) : (
        capsules.map((capsule) => (
          <div key={capsule._id} className="capsule">
            <h3>{capsule.title}</h3>
            {/* Check hash validity first */}
            {!capsule.hashValid ? (
              <p className="text-red-500">
                Warning: This capsule’s integrity could not be verified.
              </p>
            ) : capsule.locked ? (
              <p>
                Locked until {new Date(capsule.releaseDate).toLocaleDateString()}
              </p>
            ) : (
              <>
                <p>{capsule.content}</p>
                {capsule.media ? (
                  <img
                    src={`http://localhost:5000/${capsule.media}`}
                    alt="Capsule media"
                    onError={(e) => (e.target.src = '/fallback-image.jpg')} // Fallback image
                    className="max-w-full h-auto"
                  />
                ) : null}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CapsuleList;
