import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import Loader from "../components/loader.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCardAdmin from "../components/usercard-admin.component";

// only the error of role update after search  and make a load more upon clicking the arrow

const ManageUsers = () => {

    let { userAuth: { access_token } } = useContext(UserContext);
    // const payload = JSON.parse(atob(access_token.split('.')[1]));
    // console.log(payload);
    const [users, setUsers] = useState(null);
    const [query, setQuery] = useState('');
    const [isSearched, setIsSearched] = useState(false);

    const getUsers = (page = 1) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/get-users", { page }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(async ({ data }) => {
                // console.log(data.users);
                let formatData = await filterPaginationData({
                    state: users ?? null, // safe fallback
                    data: data.users,
                    page,
                    countRoute: "/admin/get-users-count",
                    user: access_token,
                    create_new_arr: true,
                })
                if (formatData) {
                    setUsers({ ...formatData, page });
                } else {
                    toast.error("Failed to fetch users");
                }
                // console.log(formatData, page);

            })
            .catch(err => {
                console.log(err);
                toast.error(err.response?.data?.error || err.message);
            })
    }
    const handleRoleChange = async (userId, newRole) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/update-user-role", { user_id: userId, role: newRole }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(() => {
                setUsers(prevRole => ({
                    ...prevRole, results: prevRole.results.map(user => user._id === userId ? { ...user, role: newRole } : user)
                }));
                toast.success(`User role updated to ${newRole} successfully`);
            })
            .catch(err => {
                console.log(err);
                toast.error(err.response.data.error);
            })
    }

    const fetchUsers = (searchTerm) => {
        if (!searchTerm.trim()) return;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/search-user", { query: searchTerm }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data: { users } }) => {
                setUsers({ results: users, page: 1, totalDocs: users.length });
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message);
            })
    }

    const handleSearch = (e) => {
        if (e.keyCode == 13 && query.trim().length > 0) {
            fetchUsers(query);
            setQuery('')
            setIsSearched(true);
        }
    }

    const handleGoBack = () => {
        setUsers(null);
        setQuery('');
        setIsSearched(false);
        getUsers(1);
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (!value.length) {
            setUsers(null);
            getUsers(1);
        }
    }

    const handlePrevPage = () => {
        if (users.page > 1) getUsers(users.page - 1);
    }

    const handleNextPage = () => {
        if (users.results.length < users.totalDocs) getUsers(users.page + 1);
    }

    const resetState = () => {
        setUsers(null);
        setQuery('');
    }

    useEffect(() => {
        resetState();
        getUsers(1);
    }, []);

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 mb-2">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-black flex items-center">
                        User Management
                    </h1>
                    <Toaster />
                    <p className="mt-2 text-gray-600">
                        Manage user roles and permissions across the platform.
                    </p>
                </div>

                <div className="relative max-md:mt-5 md:mt-8 mb-10">
                    <input type="text" className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey" placeholder="Search Using Fullname or Email" value={query} onChange={handleChange} onKeyDown={handleSearch} />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-[0.8rem] text-xl text-dark-grey" />
                </div>

                <span className={`${!isSearched ? 'hidden' : 'flex'} items-center w-fit group mb-1`} onClick={handleGoBack}>
                    <i className="fi fi-rr-arrow-small-left text-gray-400 group-hover:text-gray-500 cursor-pointer text-2xl mt-1 mr-0.5" />
                    <p className="text-gray-400 group-hover:text-gray-500 cursor-pointer">Back</p>
                </span>

                {users === null ? (
                    <Loader />
                ) : (
                    <AnimationWrapper>
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-dark">
                                    <thead className="bg-grey">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey uppercase tracking-wider">
                                                Joined On
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-grey">
                                        {users == null ? (
                                            <Loader />
                                        ) : (
                                            users.results.length ? (
                                                users.results.map((user, i) => {
                                                    return (
                                                        <UserCardAdmin key={i} user={user} handleRoleChange={handleRoleChange} />
                                                    )
                                                })
                                            ) : (
                                                <NoDataMessage message="No User Found" />
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {users.results.length > 0 && (
                            <div className="relative mt-4">
                                <div className="absolute right-0 transform translate-x-[-0.5rem] sm:translate-x-0 sm:mt-4 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-4 px-2 py-1 bg-purple/20 rounded-md">
                                    <button className="rounded-md px-2 py-1 bg-black text-grey text-xl" disabled={users.page <= 1} onClick={handlePrevPage}>
                                        <i className="fi fi-rr-angle-left" />
                                    </button>
                                    <button className="rounded-md px-2 py-1 bg-grey text-black text-xl" onClick={handleNextPage}>
                                        <i className="fi fi-rr-angle-right" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </AnimationWrapper>
                )
                }

                {users?.results?.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fi fi-rr-search text-xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 capitalize">No users found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default ManageUsers;