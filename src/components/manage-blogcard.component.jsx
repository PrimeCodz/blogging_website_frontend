import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getDay, getFullDate } from "../common/date";
import { UserContext } from "../App";
import axios from "axios";

const BlogStats = ({ stats }) => {
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
            {
                Object.keys(stats).map((key, i) => {
                    return !key.includes("parent") ? (
                        <div key={i} className={"flex flex-col items-center w-full h-full p-4 px-6 " + (i != 0 ? "border-grey border-1" : "")}>
                            <h1 className="text-xl lg:text-2xl mb-2">{stats[key].toLocaleString()}</h1>
                            <p className="capitalize max-lg:text-dark-grey">{key.split("_")[1]}</p>
                        </div>
                    ) : ("")
                })
            }
        </div>
    )
}

export const ManagePublishedBlogCard = ({ blog }) => {

    let { banner, blog_id, title, publishedAt, activity } = blog;
    let { userAuth: { access_token } } = useContext(UserContext);
    let [showStat, setShowStat] = useState(false);

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">

                <img src={banner} className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link to={`/blog/${blog_id}`} className="blog-title mb-4 hover:underline">{title}</Link>
                        <p className="line-clamp-1">Published On {getDay(publishedAt)}</p>
                    </div>
                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className="pr-4 py-2 hover:underline">Edit</Link>
                        <button className="lg:hidden pr-4 py-2 hover:underline" onClick={() => setShowStat(preVal => !preVal)}>Stats</button>
                        <button className="pr-4 py-2 hover:underline text-red" onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>
                    </div>
                </div>

                <div className="max-lg:hidden">
                    <BlogStats stats={activity} />
                </div>

            </div>

            {showStat ? (
                <div className="lg:hidden"><BlogStats stats={activity} /></div>
            ) : ("")
            }
        </>
    )
}

export const ManageDraftBlogCard = ({ blog }) => {

    let { title, des, blog_id, index } = blog;
    let { userAuth: { access_token } } = useContext(UserContext);
    index++;
    return (
        <>
            <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">

                <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">{index < 10 ? "0" + index : index}</h1>

                <div className>
                    <h1 className="blog-title mb-3">{title}</h1>
                    <p className="line-clamp-2 font-gelasio text-dark-grey">{des.length ? des : "No Description"}</p>
                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className="pr-4 py-2 hover:underline">Edit</Link>
                        <button className="pr-4 py-2 hover:underline text-red" onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export const ManageAllBlogCard = ({ blog, adminId }) => {

    let { title, banner, des, blog_id, publishedAt, tags, status, reviewedAt } = blog;
    let { fullname, username } = adminId || {};
    // console.log(adminId);
    // console.log(blog);

    return (
        <>
            <div className="border border-grey overflow-hidden my-4 rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="mb-4">
                                <Link to={`/blog/${blog_id}`} className="blog-title hover:underline">{title}</Link>
                                <p className="line-clamp-1 pt-1">Published On {getFullDate(publishedAt)}</p>
                            </div>

                            <p className="line-clamp-2 text-dark-grey mb-4">{des}</p>

                            <div className="flex gap-6 mt-3">
                                <Link to={`/editor/${blog_id}`} className="py-2 hover:underline">Edit</Link>
                                <button className="py-2 hover:underline text-red" onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>
                            </div>

                        </div>

                        <div className="ml-4 flex flex-col gap-2 items-end space-y-2 md:space-y-4 md:items-end">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(status)}`}>
                                {getStatusIcon(status)}
                                <span className="ml-1 capitalize text-sm sm:text-base">{status}</span>
                            </span>

                            <img src={banner} className="w-full max-w-[7rem] h-auto bg-dark-grey aspect-square object-cover rounded" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {tags.map((tag) => {
                            return (
                                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base bg-purple/20 text-purple">
                                    {tag}
                                </span>
                            )
                        })

                        }
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-200/50">
                        <div className="text-dark-grey">
                            {adminId ? (
                                <>
                                    <p className="text-sm">Verified By: {fullname}</p>
                                </>
                            ) : (
                                <p className="text-sm">Verified By: Not Verified Yet ?</p>
                            )

                            }
                            <p className="text-sm">Accepted On: {getFullDate(reviewedAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const deleteBlog = (blog, access_token, target) => {

    let { index, blog_id, setStateFunc } = blog;

    target.setAttribute("disabled", true);

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", { blog_id }, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
        .then(({ data }) => {

            target.removeAttribute("disabled");

            setStateFunc(preVal => {
                let { deletedDocCount, totalDocs, results } = preVal;
                results.splice(index, 1);

                if (!deletedDocCount) {
                    deletedDocCount = 0;
                }

                if (!results.length && totalDocs - 1 > 0) {
                    return null;
                }
                console.log({ ...preVal, totalDocs: totalDocs - 1, deleteDocCount: deletedDocCount + 1 });
                return { ...preVal, totalDocs: totalDocs - 1, deleteDocCount: deletedDocCount + 1 }
            })
        })
        .catch(err => {
            console.log(err);
        })
}

const getStatusIcon = (status) => {
    switch (status) {
        case 'pending':
            return <i className="fi fi-rr-clock mt-1.5 text-sm sm:text-base" />;
        case 'updated':
            return <i className="fi fi-rr-refresh mt-1.5 text-sm sm:text-base" />;
        case 'approved':
            return <i className="fi fi-rr-check mt-1.5 text-sm sm:text-base" />;
        case 'rejected':
            return <i className="fi fi-rr-cross-small mt-1.5 text-sm sm:text-base" />;
        default:
            return <i className="fi fi-rr-document mt-1.5 text-sm sm:text-base" />;
    }
}

const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'updated':
            return 'bg-blue-100 text-blue-800';
        case 'approved':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-red/20 text-red/80';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}