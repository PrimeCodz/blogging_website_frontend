import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import { ManagePublishedBlogCard, ManageDraftBlogCard, ManageAllBlogCard } from "../components/manage-blogcard.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () => {

    const [blogs, setBlogs] = useState(null);
    const [allBlogs, setAllBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [searchParam, setSearchParam] = useSearchParams();
    const [statusFilter, setStatusFilter] = useState(searchParam.get("status") || "all");
    const [query, setQuery] = useState(searchParam.get("query") || "");

    let activeTab = searchParam.get("tab") || "all";
    let { userAuth: { access_token } } = useContext(UserContext);

    let tabIndexMap = {
        all: 0,
        published: 1,
        draft: 2
    }

    const defaultActiveIndex = tabIndexMap[activeTab] ?? 0;

    useEffect(() => {
        if (!searchParam.get("tab")) {
            const tabFromIndex = Object.keys(tabIndexMap).find(key => tabIndexMap[key] === defaultActiveIndex);
            const newParams = new URLSearchParams(searchParam.toString());
            newParams.set("tab", tabFromIndex);
            setSearchParam(newParams);
        }
    }, []);

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", { page, draft, query, deletedDocCount }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: draft ? drafts : blogs,
                    data: data.blogs,
                    page,
                    user: access_token,
                    countRoute: "/user-written-blogs-count",
                    data_to_send: { draft, query }
                })
                //console.log("draft ->" + draft, formatedData);
                if (draft) {
                    setDrafts(formatedData);
                }
                else {
                    setBlogs(formatedData);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    const getAllBlogs = ({ page = 1, deletedDocCount = 0, status }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/all-written-blogs", { page, query, deletedDocCount, status }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(async ({ data }) => {
                // console.log(data);
                let formatedData = await filterPaginationData({
                    state: allBlogs,
                    data: data.blogs,
                    page,
                    user: access_token,
                    countRoute: "/all-written-blogs-count",
                    data_to_send: { query, status }
                })

                formatedData.hasMore = data.hasMore;
                setAllBlogs(formatedData);
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        if (access_token) {
            if (blogs == null) {
                getBlogs({ page: 1, draft: false })
            }
            if (allBlogs == null) {
                getAllBlogs({ page: 1, draft: false, status: statusFilter })
            }
            if (drafts == null) {
                getBlogs({ page: 1, draft: true })
            }
        }

    }, [access_token, blogs, drafts, query, statusFilter])

    const handleSearch = (e) => {
        let searchQuery = e.target.value;
        setQuery(searchQuery);

        const newParams = new URLSearchParams(searchParam.toString());
        if (!searchQuery.length || searchQuery == " ") {
            newParams.delete('query');
        } else {
            newParams.set('query', searchQuery);
        }
        setSearchParam(newParams);

        if (e.keyCode == 13 && searchQuery.length) {
            setBlogs(null);
            setDrafts(null);
            setAllBlogs(null);
        }
    }

    const handleChange = (e) => {
        let searchQuery = e.target.value;
        setQuery(searchQuery);

        const newParams = new URLSearchParams(searchParam.toString());

        if (!searchQuery.length) {
            newParams.delete('query');
            setQuery("");
            setBlogs(null);
            setDrafts(null);
            setAllBlogs(null);
        }
        setSearchParam(newParams);
    }

    const handleTabChange = (newIndex) => {
        const tabFromIndex = Object.keys(tabIndexMap).find(key => tabIndexMap[key] === newIndex);
        const newParams = new URLSearchParams(searchParam);
        newParams.set('tab', tabFromIndex);
        setSearchParam(newParams);
    }

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);

        const newParams = new URLSearchParams(searchParam);
        newParams.set('status', value);

        setSearchParam(newParams);
        setAllBlogs(null); // reset allBlogs on status change

    }

    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>

            <Toaster />

            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input type="search" className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey" placeholder="Search Blogs" onChange={handleChange} onKeyDown={handleSearch} />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-[0.8rem] text-xl text-dark-grey" />
            </div>

            <InPageNavigation routes={["All Blogs", "Published Blogs", "Drafts"]} defaultActiveIndex={defaultActiveIndex} onTabChange={handleTabChange}>

                {allBlogs == null ? (//all blogs
                    <Loader />
                ) : (
                    <>
                        <div className="flex items-center justify-end">
                            <div className="px-3 py-2 max-w-[7rem] rounded-lg bg-grey focus-within:outline focus-within:outline-2 focus-within:outline-purple/30 group">
                                <select value={statusFilter} onChange={handleStatusChange} className="bg-transparent text-black outline-none group-hover:cursor-pointer">
                                    <option className="bg-grey" value="all">All Status</option>
                                    <option className="bg-grey" value="pending">Pending</option>
                                    <option className="bg-grey" value="updated">Updated</option>
                                    <option className="bg-grey" value="approved">Approved</option>
                                    <option className="bg-grey" value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {allBlogs.results.length ? (
                            <>
                                {allBlogs.results.map((blog, i) => {
                                    return (
                                        <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                            <ManageAllBlogCard blog={{ ...blog, index: i, setStateFunc: setAllBlogs }} adminId={blog.reviewedBy?.personal_info || null} />
                                        </AnimationWrapper>
                                    )
                                })
                                }

                                {allBlogs.hasMore && (
                                    <LoadMoreDataBtn state={allBlogs} fetchDataFun={getAllBlogs} additionalParam={{ draft: false, deletedDocCount: allBlogs.deletedDocCount }} />
                                )}
                            </>
                        ) : (
                            <NoDataMessage message="No Blogs" />
                        )
                        }
                    </>
                )}

                {blogs == null ? (//published blogs
                    <Loader />
                ) : (
                    blogs.results.length ? (
                        <>
                            {blogs.results.map((blog, i) => {
                                return (
                                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                        <ManagePublishedBlogCard blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
                                    </AnimationWrapper>
                                )
                            })
                            }

                            <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} additionalParam={{ draft: false, deletedDocCount: blogs.deletedDocCount }} />
                        </>
                    ) : (
                        <NoDataMessage message="No Published Blogs" />
                    )
                )
                }

                {drafts == null ? (//draft blogs
                    <Loader />
                ) : (
                    drafts.results.length ? (
                        <>
                            {drafts.results.map((blog, i) => {
                                return (
                                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                        <ManageDraftBlogCard blog={{ ...blog, index: i, setStateFunc: setDrafts }} />
                                    </AnimationWrapper>
                                )
                            })
                            }

                            <LoadMoreDataBtn state={drafts} fetchDataFun={getBlogs} additionalParam={{ draft: true, deletedDocCount: drafts.deletedDocCount }} />
                        </>
                    ) : (
                        <NoDataMessage message="No Draft Blogs" />
                    )
                )
                }

            </InPageNavigation>
        </>
    )
}

export default ManageBlogs;