import { useContext, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../../context/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

function Home() {
 

  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error,setError] = useState("");
  const navigate  = useNavigate();

 

  // console.log("isSignedIn : ",isSignedIn);
  console.log("user : ",user);
  // console.log("isLoaded : ",isLoaded);

  async function onSelectRole(e) {
    //clear error message
    setError("");
    const selectedRole = e.target.value;

    const updatedUser = { ...currentUser, role: selectedRole };
    // setCurrentUser(updatedUser);
    try{
            if (selectedRole === 'author') {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user-api/author`,
        updatedUser
      );
      if (res.data.message === 'author') {
        setCurrentUser(prev => ({ ...prev, ...res.data.payload }));
        navigate(`/author-profile/${updatedUser.email}`);
      }
    }

    if (selectedRole === 'user') {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user-api/user`,
        updatedUser
      );
      if (res.data.message === 'user') {
        setCurrentUser(prev => ({ ...prev, ...res.data.payload }));
         navigate(`/user-profile/${updatedUser.email}`);
      }
    }
  }
  catch(err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
  

    useEffect(() => {
  if (isLoaded && user) {
    setCurrentUser(prev => ({
      ...(prev || {}),
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    }));
  }
}, [isLoaded, user]);
  
  
    if (!isLoaded) {
  return <h3 className="text-center mt-5">Loading...</h3>;
}

    // useEffect(()=>{
    //   if(currentUser?.role ==='user' && error.length ===0){
    //     navigate(`/user-profile/${currentUser.email}`);
    //   }
    //   if(currentUser?.role === 'author' && error.length ===0){
    //     console.log('first');
    //     navigate(`/author-profile/${currentUser.email}`);
    //   }
    // },[currentUser?.role]);
  console.log("HOME RENDER", { isSignedIn, isLoaded, user, currentUser });

  return (
  <div className="container">

    {/* ✅ NOT SIGNED IN */}
    {!isSignedIn && (
      <div className="home-hero text-center mt-5">
        <h1 className="home-title">
          Welcome to <span className="home-accent">BlogSphere</span> 📝
        </h1>

        <h2 className="home-subtitle mt-3">
          A modern blog platform where ideas meet creativity. Explore articles,
          share your thoughts, and connect with authors across categories.
        </h2>

        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <div className="home-card">
              <h4>📚 Explore Articles</h4>
              <p>Read blogs across tech, travel, finance, lifestyle and more.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="home-card">
              <h4>✍️ Become an Author</h4>
              <p>Publish articles, edit them anytime, and build your audience.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="home-card">
              <h4>💬 Engage & Comment</h4>
              <p>Join discussions, share opinions, and learn from others.</p>
            </div>
          </div>
        </div>

        <p className="home-note mt-5">
          Sign in to get started 🚀
        </p>
      </div>
    )}

    {/* ✅ SIGNED IN (ROLE SELECTION PAGE) */}
    {isSignedIn && (
      <div className="mt-4">
        <div className="d-flex justify-content-evenly align-items-center bg-info p-3 rounded">
          <img
            src={user?.imageUrl}
            width="90"
            className="rounded-circle"
            alt="profile"
          />
          <p className="display-6 mb-0">{user?.firstName}</p>
        </div>

        <p className="lead mt-4 fs-3 text-center fw-bold">Select role</p>

        {error.length > 0 && (
          <p className="text-danger fs-5 text-center">{error}</p>
        )}

        <div className="d-flex py-3 justify-content-center">
          <div className="form-check me-4 fs-4">
            <input
              type="radio"
              name="role"
              value="author"
              className="form-check-input"
              onChange={onSelectRole}
            />
            <label className="form-check-label">Author</label>
          </div>

          <div className="form-check fs-4">
            <input
              type="radio"
              name="role"
              value="user"
              className="form-check-input"
              onChange={onSelectRole}
            />
            <label className="form-check-label">User</label>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default Home;
