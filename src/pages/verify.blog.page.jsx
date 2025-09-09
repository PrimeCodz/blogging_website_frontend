import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import { getFullDate } from "../common/date";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import BlogContent from "../components/blog-content.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import { useSearchParams } from "react-router-dom";
import NoDataMessage from "../components/nodata.component";
import { BlogPreviewCard, VerifyBlogCard } from "../components/verify-blog.component";

const VerifyBlog = () => {

    let { userAuth: { access_token } } = useContext(UserContext);
    const [blogs, setBlogs] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isSearched, setIsSearched] = useState(false);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'pending');
    const [selectedBlog, setSelectedBlog] = useState(searchParams.get('blog_id') || null);

    const getBlogs = (page = 1, create_new_arr = false) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/get-blogs", { page }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(async ({ data }) => {
                // console.log(data.blogs);
                let formatData = await filterPaginationData({
                    state: blogs ?? null, // safe fallback
                    data: data.blogs,
                    page,
                    countRoute: "/admin/get-blogs-count",
                    user: access_token,
                    create_new_arr
                })
                // console.log(formatData);
                if (formatData) {
                    setBlogs({ ...formatData, page });
                } else {
                    toast.error("Failed to fetch blogs");
                }
            })
            .catch(err => {
                console.log(err);
                toast.error(err.response.data.error);
            })
    }

    const handleStatusChange = (blog_id, newStatus) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/blogs/update-status", { blog_id, status: newStatus }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((res) => {
                setBlogs(prev => ({
                    ...prev, results: prev.results.map(blog => blog._id === blog_id ? { ...blog, status: newStatus } : blog)
                }))
                toast.success(`Blog ${newStatus} successfully`);
                setSelectedBlog(null);
            })
            .catch(err => {
                console.log(err);
                toast.error(err.response?.data?.error || "Failed to update status");
            })
    };

    const handleSearch = (e) => {
        if (e.keyCode === 13) {
            setSearchTerm(searchQuery);
            setSearchQuery('');
            setIsSearched(true);

            const newParams = new URLSearchParams(searchParams);
            newParams.set('search', searchQuery);
            setSearchParams(newParams);
        }
    }

    const handleChange = (e) => {
        const value = e.target.value;

        setSearchQuery(value);
        if (!value.length) {
            setSearchTerm('');
            getBlogs(1, true);

            const newParams = new URLSearchParams(searchParams);
            newParams.delete('search');
            setSearchParams(newParams);
        }
    }

    const handleStatusFilter = (e) => {
        const value = e.target.value;
        setStatusFilter(value);

        const newParams = new URLSearchParams(searchParams);
        if (value === 'all') {
            newParams.delete('status');
        } else {
            newParams.set('status', value);
        }
        setSearchParams(newParams);
    }

    const handleGoBack = () => {
        setBlogs(null);
        setSearchTerm('');
        setIsSearched(false);
        setSearchQuery('');
        getBlogs(1, true);
    }

    const filteredBlogs = blogs?.results?.filter(blog => {
        const title = blog?.title?.toLowerCase() || '';
        const authorName = blog?.author?.personal_info?.fullname?.toLowerCase() || '';
        const matchesSearch = title.includes(searchTerm.toLowerCase()) || authorName.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    const resetState = () => {
        setSearchTerm('');
        setSearchQuery('');
        setIsSearched(false);
        setStatusFilter('all');
        setSelectedBlog(null);
    }


    useEffect(() => {
        resetState();
        getBlogs(1, true);
    }, []);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black flex items-center">
                    Blog Verification
                </h1>
                <Toaster />
                <p className="mt-2 text-gray-600">
                    Review and moderate blog content before publication.
                </p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="relative w-full md:max-w-[400px]">
                    <input type="text" className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey" placeholder="Search..." value={searchQuery} onChange={handleChange} onKeyDown={handleSearch} />
                    <i className="fi fi-rr-search absolute right-4 md:pointer-events-none md:left-5 top-1/2 -translate-y-[0.8rem] text-xl text-dark-grey" />
                </div>

                <div className="px-3 py-2 max-w-[7rem] rounded-lg bg-grey focus-within:outline focus-within:outline-2 focus-within:outline-purple/30 group">
                    <select value={statusFilter} onChange={handleStatusFilter} className="bg-transparent text-black outline-none group-hover:cursor-pointer">
                        <option className="bg-grey" value="all">All Status</option>
                        <option className="bg-grey" value="pending">Pending</option>
                        <option className="bg-grey" value="updated">Updated</option>
                        <option className="bg-grey" value="rejected">Rejected</option>
                        <option className="bg-grey" value="approved">Approved</option>
                    </select>
                </div>
            </div>

            <span className={`${!isSearched ? 'hidden' : 'flex'} items-center group w-fit`} onClick={handleGoBack}>
                <i className="fi fi-rr-arrow-small-left text-gray-400 group-hover:text-gray-500 cursor-pointer mt-1 mr-1" />
                <p className="text-gray-400 group-hover:text-gray-500 cursor-pointer">Back</p>
            </span>

            {blogs === null ? (
                <Loader />
            ) : (
                <div className="grid gap-6">
                    {filteredBlogs.length ? (
                        filteredBlogs.map((blog) => (
                            <AnimationWrapper key={blog._id}>
                                <VerifyBlogCard content={blog} author={blog.author.personal_info} adminId={blog.reviewedBy?.personal_info || null} handleStatusChange={handleStatusChange} setSelectedBlog={setSelectedBlog} />
                            </AnimationWrapper>
                        ))
                    ) : (
                        <NoDataMessage message="No Blog Found" />
                    )}
                </div>
            )}

            {blogs != null && blogs.totalDocs > blogs.results.length && (
                <div className="flex justify-center mt-4" onClick={() => (getBlogs(blogs?.page + 1))}>
                    <button className="transition-colors duration-200 text-dark-grey p-2 px-5 hover:bg-grey/30 rounded-md flex items-center justify-center gap-2">Load More</button>
                </div>
            )}

            {blogs?.results?.length === 0 && (
                <div className="text-center py-12">
                    <i className="fi fi-rr-edit text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or status filter.</p>
                </div>
            )}

            {/* Blog Preview Modal */}
            {selectedBlog && (
                <BlogPreviewCard selectedBlog={selectedBlog} setSelectedBlog={setSelectedBlog} author={selectedBlog.author.personal_info} handleStatusChange={handleStatusChange} />
            )}
        </div>
    )

}

export default VerifyBlog;