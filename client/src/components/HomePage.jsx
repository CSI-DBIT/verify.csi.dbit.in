import { useState } from "react";
import { Link } from "react-router-dom";
const HomePage = () => {
  const [studentId, setStudentId] = useState('');

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(255, 255, 255, 0.8)', height: '100%', flexDirection: 'column', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '200px', height: '200px', backgroundImage: "url('https://csidbit.netlify.app/assets/img/CSI-DBIT.png')", backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '20px' }}></div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>CSI Membership Portal</div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Enter student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            width: '200px'
          }}
        />
        <Link to={`/member/${studentId}`}>
          <button
            style={{
              padding: '10px 20px',
              background: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;