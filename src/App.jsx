import { createContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import NotificationContainer from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";
import Dashboard from "./pages/dashboard.page";
import ManageUsers from "./pages/manage.users.page";
import VerifyBlog from "./pages/verify.blog.page";
import LandingPage from "./pages/landing.page";


export const UserContext = createContext({});
export const ThemeContext = createContext({});

const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {
    const [userAuth, setUserAuth] = useState({});
    const [theme, setTheme] = useState(() => darkThemePreference() ? "dark" : "light");
    // console.log(userAuth);
    useEffect(() => {
        let userInSession = lookInSession("user");
        let themeInSession = lookInSession("theme");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

        if (themeInSession) {
            setTheme(() => {
                document.body.setAttribute('data-theme', themeInSession);
                return themeInSession;
            })
        }
        else {
            document.body.setAttribute('data-theme', theme)
        }

    }, []);

    // Role-based route protection
    const RequireAdmin = ({ children }) => {
        return userAuth?.role === "admin" ? children : <Navigate to="/dashboard/dash-stats" />
    }

    return (
        <>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <UserContext.Provider value={{ userAuth, setUserAuth }}>
                    <Routes>
                        <Route path="/editor" element={<EditorPage />} />
                        <Route path="/editor/:blog_id" element={<EditorPage />} />
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<LandingPage />} />
                            <Route path="home" element={<HomePage />} />
                            <Route path="dashboard" element={<SideNav />} >
                                <Route path="stats" element={<Dashboard />} />
                                <Route path="blogs" element={<ManageBlogs />} />
                                <Route path="notifications" element={<NotificationContainer />} />
                                <Route path="verify-blogs" element={<RequireAdmin><VerifyBlog /></RequireAdmin>} />
                                <Route path="manage-users" element={<RequireAdmin><ManageUsers/></RequireAdmin>} />
                            </Route>
                            <Route path="settings" element={<SideNav />} >
                                <Route path="edit-profile" element={<EditProfile />} />
                                <Route path="change-password" element={<ChangePassword />} />
                            </Route>
                            <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                            <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                            <Route path="search/:query" element={<SearchPage />} />
                            <Route path="user/:id" element={<ProfilePage />} />
                            <Route path="blog/:blog_id" element={<BlogPage />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                    </Routes>
                </UserContext.Provider>
            </ThemeContext.Provider>
        </>
    );
}

export default App;