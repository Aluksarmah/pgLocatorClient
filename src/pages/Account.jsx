import { Link, Outlet, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faList, faPeopleRoof } from "@fortawesome/free-solid-svg-icons"
import { NavBar } from "../components/NavBar"
import useMediaQuery from '../hooks/useMediaQuery'

function Account() {

    //using nested routes to render 3 subpages: Profile (index), Trips and Rentals

    //using useLocation to check with router user is on
    //subpage is then set to whichever nested route the user has selected
    //the tab for this route will then be highlighted with red background
    const location = useLocation()
    const subpage = location.pathname.split('/')[2]

    //variable to determine if screen size is above xs/mobile screens
    const aboveSmallScreens = useMediaQuery('(min-width: 780px)')

    return (
        <div
            className="min-h-screen h-full pb-36 sm:pb-5"
        >
            {/* only display navbar on top for screens above 780px. Below this breakpoint the navbar is on the bottom */}
            {aboveSmallScreens && <NavBar />}
            
            <div
                className="flex flex-col p-10 items-center justify-start bg-stone-200 min-h-screen h-full"
            >
                <div
                    className="bg-white p-8 rounded-lg xl:w-fit"
                >
                    {/* simple nav for navigating subpages on this page */}
                    <nav
                        className="flex justify-center my-5 text-lg sm:text-2xl gap-2 p-5 border-b-2 border-sky-300"
                    >
                        {/* account link */}
                        <Link 
                            to={'/account'}
                            className= {`py-2 px-4 mx-3 rounded-full ${subpage == undefined ? 'bg-red text-white rounded-full' : 'hover:bg-slate-500/40'} hover:scale-110`}
                        >
                            <FontAwesomeIcon icon={faUser} /> 
                            <span className="hidden sm:inline">My Profile</span>
                        </Link>

                        {/* rentals */}
                        <Link 
                            to={'/account/rentals'}
                            className={`py-2 px-4 mx-3 rounded-full ${subpage == 'rentals' ? 'bg-red text-white rounded-full' : 'hover:bg-slate-500/40'} hover:scale-110`}
                        >
                            <FontAwesomeIcon icon={faPeopleRoof} /> 
                            <span className="hidden sm:inline">My Rentals</span>
                        </Link>
                    </nav>

                    {/* outlet for displaying sub pages */}
                    <Outlet/>
                </div>
            </div>
        </div> 
    )
}

export { Account }