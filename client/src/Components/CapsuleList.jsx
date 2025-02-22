import React from 'react';

function CapsuleList({ capsules }) {
  return (
    <div className="capsule-list">
      <h2>Your Capsules</h2>
      {capsules.map((capsule) => (
        <div key={capsule._id} className="capsule">
          <h3>{capsule.title}</h3>
          {capsule.locked ? (
            <p>Locked until {new Date(capsule.releaseDate).toLocaleDateString()}</p>
          ) : (
            <>
              <p>{capsule.content}</p>
              {capsule.media && <img src={`http://localhost:5000/${capsule.media}`} alt="Capsule media" />}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default CapsuleList;