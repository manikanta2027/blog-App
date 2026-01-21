import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../context/UserAuthorContext";

const Header = () => {
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <nav className="header navbar-custom d-flex justify-content-between align-items-center px-4 py-3">
    
     <Link to="/" className="logo-brand text-decoration-none">
     Blog<span className="brand-accent">Sphere</span>
   </Link>
     
     

      {/* Right side links */}
      <ul className="d-flex align-items-center gap-4 list-unstyled mb-0">
        {!isSignedIn ? (
          <>
           <li>
  <Link to="" className="nav-btn nav-btn-outline">
    Home
  </Link>
</li>
<li>
  <Link to="signin" className="nav-btn nav-btn-ghost">
    Sign in
  </Link>
</li>
<li>
  <Link to="signup" className="nav-btn nav-btn-solid">
    Sign up
  </Link>
</li>

          </>
        ) : (
          <li className="d-flex align-items-center gap-3">
            {/* user image + role */}
            <div className="d-flex align-items-center gap-2">
              <img
                src={user.imageUrl}
                width="40"
                height="40"
                className="rounded-circle"
                alt="profile"
              />

              <span className="badge bg-light text-dark text-uppercase">
                {currentUser?.role}
              </span>
            </div>

            {/* username */}
            <p className="mb-0 fw-bold text-white">{user.firstName}</p>

            {/* signout button */}
            <button className="btn btn-danger btn-sm" onClick={handleSignout}>
              Signout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
