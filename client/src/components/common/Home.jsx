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
    setCurrentUser(updatedUser);

    if (selectedRole === 'author') {
      const res = await axios.post(
        'http://localhost:3000/author-api/author',
        updatedUser
      );
      if (res.data.message === 'author') {
        setCurrentUser(prev => ({ ...prev, ...res.data.payload }));
      }else{
        setError(message);
      }
    }

    if (selectedRole === 'user') {
      const res = await axios.post(
        'http://localhost:3000/user-api/user',
        updatedUser
      );
      if (res.data.message === 'user') {
        setCurrentUser(prev => ({ ...prev, ...res.data.payload }));
      }else{
        setError(res.data.message);
      }
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser({
        ...currentUser,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.emailAddresses[0].emailAddress,
        profileImageUrl: user?.imageUrl,
      })};
    },[isLoaded, user]);

    useEffect(()=>{
      if(currentUser?.role ==='user' && error.length ===0){
        navigate(`/user-profile/${currentUser.email}`);
      }
      if(currentUser?.role === 'author' && error.length ===0){
        console.log('first');
        navigate(`/author-profile/${currentUser.email}`);
      }
    },[currentUser?.role]);

  return (
    <div className="container">
      {!isSignedIn && (
        <div>
          <p className="lead">This is a blog app</p>
          <p className="lead">This is a blog app</p>
          <p className="lead">This is a blog app</p>
        </div>
      )}

      {isSignedIn && (
        <div>
          <div className="d-flex justify-content-evenly align-items-center bg-info p-3">
            <img
              src={user?.imageUrl}
              width="100"
              className="rounded-circle"
              alt="profile"
            />
            <p className="display-6">{user?.firstName}</p>
          </div>

          <p className="lead">Select role</p>
          {error.length > 0 && (
            <p className = "text-danger fs-5" style = {{fontFamily:"sans-serif"}}>
              {error}   
            </p>
          )}

          <div className="d-flex py-3 justify-content-center">
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="author"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label className="form-check-label">Author</label>
            </div>

            <div className="form-check">
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
