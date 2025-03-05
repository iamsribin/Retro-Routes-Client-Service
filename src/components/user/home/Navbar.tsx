import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../services/redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.scss";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const user = useSelector((store:{user:{user:string}}) => store.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (windowSize > 768) {
      setIsOpen(false);
    }
  }, [windowSize]);

  return (
    <nav className="bg-black text-white flex justify-between items-center p-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-300">
          <img src="/images/logo.png" alt="Logo" className="w-[40%]" />
        </Link>
      </div>
      {windowSize > 768 ? (
        <div className="flex items-center mr-16 space-x-8">
          <a href="#" onClick={()=>navigate("/")} className="hover:text-gray-300">
            Home
          </a>
          <a href="#" onClick={()=>navigate("/rides")} className="hover:text-gray-300">
            Ride
          </a>
          <a href="#" onClick={() => navigate("/driver/login")} className="hover:text-gray-300">
            Drive
          </a>
          <a href="#" onClick={() => navigate("/account")} className="hover:text-gray-300">
            Account
          </a>
          <a href="#" onClick={() => navigate("/about")} className="hover:text-gray-300">
            About
          </a>
          {user ? (
            <>
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 3000);
                }}
                className="profile-avatar"
              >
                {user[0]}
              </button>
              {isOpen && (
                <div className="options-box">
                  <ul>
                    <li
                      onClick={() => {
                        dispatch(userLogout());
                        localStorage.removeItem("userToken")
                        navigate("/login");
                      }}
                    >
                      Logout
                    </li>
                    <li onClick={() =>{ navigate("/signup") ;dispatch(userLogout())}}>Signup</li>
                    <li onClick={() => navigate("/driver/login")}>Login as Driver</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-white w-20 h-8">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="Signup bg-white rounded text-black w-20 h-8">
                Signup
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            ☰
          </button>
          {isOpen && (
            <div className="flex flex-col items-center bg-black text-white absolute top-16 right-0 w-40 p-2 rounded-lg">
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
              <a href="#" className="hover:text-gray-300">
                Ride
              </a>
              <a href="#" onClick={() => navigate("/driver/login")} className="hover:text-gray-300">
                Drive
              </a>
              <a href="#" className="hover:text-gray-300">
                Account
              </a>
              <a href="#" className="hover:text-gray-300">
                About
              </a>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      dispatch(userLogout());
                      localStorage.removeItem('userToken')
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                  <button onClick={() => navigate("/driver/login")}>Login as Driver</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/login")}>Login</button>
                  <button onClick={() => navigate("/signup")}>Signup</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;