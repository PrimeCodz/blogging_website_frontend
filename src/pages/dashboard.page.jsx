import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { getYear } from "../common/date";

const Dashboard = () => {

    let { userAuth: { fullname, role, access_token } } = useContext(UserContext);
    const [adminStats, setAdminStats] = useState(null);
    const [userStats, setUserStats] = useState(null);

    const getAdminStats = async () => {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/dashboard", {}, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                setAdminStats({
                    total_blogs: data.totalBlogs,
                    total_users: data.totalUsers,
                    member_since: getYear(data.joinedAt),
                });
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const getUserStats = async () => {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user/dashboard", {}, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {
            setUserStats({
                total_posts: data.totalPosts,
                total_reads: data.totalReads,
                member_since: getYear(data.joinedAt),
            });
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        getAdminStats();
        getUserStats();
    }, []);

    const statsData = [
        {
            name: role === 'admin' ? 'Total Blogs' : 'Total Posts',
            value: role === 'admin' ? adminStats?.total_blogs || 0 : userStats?.total_posts || 0,
            icon: 'document',
            color: 'text-blue-600 bg-blue-200',
        },
        {
            name: role === 'admin' ? 'Total Users' : 'Total Reads',
            value: role === 'admin' ? adminStats?.total_users || 0 : userStats?.total_reads || 0,
            icon: 'users-alt',
            color: 'text-green-600 bg-green-100',
        },
        {
            name: 'Member Since',
            value: role === 'admin' ? adminStats?.member_since || 0 : userStats?.member_since || 0,
            icon: 'clock-five',
            color: 'text-purple bg-purple/10',
        },
    ];

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-dark-black capitalize">
                        Welcome back, {fullname}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {role === 'admin'
                            ? 'Manage users and verify blog content from your admin dashboard.'
                            : 'Track your blog performance and manage your content.'
                        }
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {statsData.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.name} className="bg-grey overflow-hidden shadow-md rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                                                <i className={`fi fi-rr-${Icon} w-5 h-5 inline-flex ml-1`} />
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-400 truncate">
                                                    {item.name}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-500">
                                                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {role === 'admin' ? (
                    <div className="bg-white shadow-md rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-black mb-4">
                                Admin Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <LinkBtn icon="users" title="Manage Users" text="Update user roles and permissions" link="/dashboard/manage-users" className="text-blue-600" />
                                <LinkBtn icon="edit" title="Verify Blogs" text="Review and approve blog content" link="/dashboard/verify-blogs" className="text-green-600" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-black mb-4">
                                Users Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <LinkBtn icon="document" title="Blogs" text="View your blogs" link="/dashboard/blogs" className="text-blue-600" />
                                <LinkBtn icon="bell" title="Notifications" text="View notifications" link="/dashboard/notifications" className="text-red" />
                                <LinkBtn icon="user-pen" title="Edit Profile" text="Update your profile" link="/settings/edit-profile" className="text-purple" />
                                <LinkBtn icon="file-edit" title="Editor" text="Write a blog" link="/editor" className="text-green-600" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard;

const LinkBtn = ({ icon, title, text, link, className }) => {
    return (
        <>
            <NavLink
                to={link}
                className="relative rounded-lg border border-gray-100/50 bg-grey px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200"
            >
                <div className="flex-shrink-0">
                    <i className={`fi fi-rr-${icon} h-10 w-10 ${className}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-black">{title}</p>
                    <p className="text-sm text-gray-500">{text}</p>
                </div>
            </NavLink>
        </>
    )
}