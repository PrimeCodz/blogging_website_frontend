import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const SideNav = () => {

    let {userAuth} = useContext(UserContext);
    if (!userAuth || !userAuth.access_token) return <Navigate to="/signin" />

    let { userAuth: { access_token, new_notification_available, role } } = useContext(UserContext);
    let page = location.pathname.split("/")[2];
    let [pageState, setPageState] = useState(page.replace('-', ' '));
    let [showSideNav, setShowSideNav] = useState(false);
    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true);
        }
        else {
            setShowSideNav(false);
        }
    }

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current.click();
    }, [pageState])

    return (
        access_token === null ? <Navigate to="/signin" /> :
            <>
                <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">

                    <div className="sticky top-[80px] z-30">
                        {/* Mobile Tabs */}
                        <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                            <button className="p-5 capitalize" ref={sideBarIconTab} onClick={changePageState}><i className="fi fi-rr-menu-burger pointer-events-none" /></button>
                            <button className="p-5 capitalize" ref={pageStateTab} onClick={changePageState}>{pageState}</button>
                            <hr className="absolute bottom-0 duration-500" ref={activeTabLine} />
                        </div>
                        {/* Sidebar Tabs Desktop */}
                        <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>

                            <h1 className="text-xl text-dark-grey mb-3">{role === "admin" ? "Admin Dashboard" : " User Dashboard"}</h1>
                            <hr className="border-grey -ml-6 mb-8 mr-6" />
                            {/* Role-based menu */}
                            {role === "admin" ? (
                                <>
                                    <NavLink to="/dashboard/dash-stats" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <i className="fi fi-rr-dashboard" />Dashboard
                                    </NavLink>
                                    <NavLink to="/dashboard/verify-blogs" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <i className="fi fi-rr-document" />Blog Verification
                                    </NavLink>
                                    <NavLink to="/dashboard/manage-users" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <i className="fi fi-rr-users-alt" /> User Management
                                    </NavLink>
                                    <NavLink to="/dashboard/notifications" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <div>
                                            <i className="fi fi-rr-bell" />
                                            {
                                                new_notification_available ? (
                                                    <span className="absolute bg-red w-2 h-2 rounded-full z-10 top-0 right-0"></span>
                                                ) : ("")
                                            }
                                        </div> Notifications
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/dashboard/stats" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <i className="fi fi-rr-dashboard" />Dashboard
                                    </NavLink>
                                    <NavLink to="/dashboard/blogs" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <i className="fi fi-rr-document" />Blogs
                                    </NavLink>
                                    <NavLink to="/dashboard/notifications" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <div className="relative">
                                            <i className="fi fi-rr-bell" />

                                            {new_notification_available ? (
                                                <span className="absolute bg-red w-2 h-2 rounded-full z-10 top-0 right-0"></span>
                                            ) : ("")

                                            }

                                        </div> Notifications
                                    </NavLink>
                                    <NavLink to="/editor" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                        <i className="fi fi-rr-file-edit" />Write
                                    </NavLink>
                                </>
                            )
                            }
                            {/* Common settings */}
                            <h1 className="text-xl text-dark-grey mb-3 mt-20">Settings</h1>
                            <hr className="border-grey -ml-6 mb-8 mr-6" />

                            <NavLink to="/settings/edit-profile" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-user-pen" />Edit Profile
                            </NavLink>
                            <NavLink to="/settings/change-password" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-key" />Change Password
                            </NavLink>

                        </div>

                    </div>
                    {/* Right panel */}
                    <div className="max-md:-mt-8 mt-5 w-full">
                        <Outlet />
                    </div>

                </section>
            </>
    )
}

export default SideNav;