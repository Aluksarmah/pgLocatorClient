/* this is the navbar seen at the homepage. This one has additional search bars in the middle that the SmallNavBar does not */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import FlyoutMenu from "./FlyoutMenu";
import { UserContext } from "../UserContext";
import logo from "../logo.png";
import { searchQueryState } from "../hooks/atoms";
import { useRecoilState } from "recoil";

function NavBar() {
  //using context to check for logged in user
  const { userInfo } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

  //state variables that control drop down menu when user clicks on the user icon in the navbar
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 border-b-2 border-gray-100 flex items-center justify-center bg-white z-10 py-2">
      <div className="flex items-center justify-between p-1 w-full xl:w-[90%]">
        {/* logo, always redirects to home */}
        <Link to={"/"} className="hidden sm:flex items-center px-5">
          <div className=" bg-none ">
            <img src={logo}  className=" aspect-auto w-14" alt="logo" />
          </div>
          <span className="text-blue-600 ml-2 text-xl font-bold">PgLocator</span>
        </Link>

        {/* section in center that includes the search bar */}
        <div className="flex items-center border-2 p-2 rounded-full text-sm font-semibold shadow-md shadow-gray-300 w-full sm:w-fit">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none px-3 py-1 w-60"
          />
          <button className="bg-red h-10 w-10 rounded-full flex items-center justify-center ml-3">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ color: "#fffafa" }}
            />
          </button>
        </div>

        {/* menu and account section */}
        <div className="hidden sm:flex items-center px-5">
          <div
            className="flex items-center border-2 p-2 rounded-full relative cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "#7e8186", height: "20px", marginLeft: "8px" }}
            />

            {/* show user avatar if a user is logged in or if user doesn't have a profile pic/not logged in, display a default user icon */}
            {userInfo.avatar ? (
              <img
                src={`http://localhost:5000/uploads/${userInfo.avatar}`}
                alt="user profile pic"
                className="w-10 h-10 rounded-full ml-3"
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{ color: "#9e9e9e", height: "30px", marginLeft: "20px" }}
              />
            )}

            {/* flyout menu displayed when user clicks on the div above */}
            {showMenu ? <FlyoutMenu userInfo={userInfo} /> : ""}
          </div>
        </div>
      </div>
    </header>
  );
}

export { NavBar };
