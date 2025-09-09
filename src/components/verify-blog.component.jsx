import { getFullDate } from "../common/date";
import BlogContent from "./blog-content.component";

const VerifyBlogCard = ({ content, handleStatusChange, author, setSelectedBlog, adminId }) => {

    let { _id, title, des, banner, tags, status, publishedAt, reviewedAt } = content;
    let { fullname, username, profile_img } = author;
    let { fullname: adminFullname, username: adminUsername } = adminId || {};

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <i className="fi fi-rr-clock mt-1.5" />;
            case 'updated':
                return <i className="fi fi-rr-refresh mt-1.5" />;
            case 'approved':
                return <i className="fi fi-rr-check mt-1.5" />;
            case 'rejected':
                return <i className="fi fi-rr-cross-small mt-1.5" />;
            default:
                return <i className="fi fi-rr-document mt-1.5" />;
        }
    };

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
    };

    return (
        <>
            <div className="bg-white shadow-sm rounded-lg border border-gray-200/50 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={profile_img}
                                    alt={fullname}
                                />
                                <div>
                                    <p className="font-medium text-black capitalize">
                                        {fullname}
                                    </p>
                                    <p className="text-sm font-medium text-dark-grey">@{username}</p>
                                    <p className="text-sm text-gray-500">
                                        Published: {getFullDate(publishedAt)}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-black mb-2">
                                {title}
                            </h3>

                            <p className="text-gray-400 mb-4 line-clamp-2">
                                {des}...
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple/20 text-purple"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="ml-4 flex flex-col gap-2 items-end space-y-2 md:space-y-4 md:items-end">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                {getStatusIcon(status)}
                                <span className="ml-1 capitalize">{status}</span>
                            </span>

                            <img src={banner} alt={title} className="w-full max-w-[7rem] h-auto aspect-square object-cover rounded mt-2" />

                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-200/50">
                        <button
                            onClick={() => setSelectedBlog(content)}
                            className="inline-flex items-center px-3 py-2 border border-gray-200/50 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-400 bg-white hover:bg-gray-500/20 transition-colors duration-200"
                        >
                            <i className="fi fi-rr-eye mr-2" />
                            Blog Preview
                        </button>

                        {status === 'pending' || status === 'updated' ? (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleStatusChange(_id, 'rejected')}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-50 bg-red/80 hover:bg-red/90 transition-colors duration-200"
                                >
                                    <i className="fi fi-rr-cross-small mr-1" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusChange(_id, 'approved')}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-50 bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                >
                                    <i className="fi fi-rr-check mr-1" />
                                    Approve
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    {adminId ? <p className="text-sm text-dark-grey">Reviewed By: {adminFullname} @{adminUsername}</p> : <p className="text-sm text-dark-grey">Reviewed By: Not Yet Reviewed</p>}
                                    <p className="text-sm text-dark-grey line-clamp-1">Reviewed On: {getFullDate(reviewedAt)}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

const BlogPreviewCard = ({ selectedBlog, setSelectedBlog, author, handleStatusChange }) => {

    let { _id, banner, title, tags, status, publishedAt, updatedAt } = selectedBlog;
    let { fullname, profile_img, username } = author;

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border border-gray-200/50 w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-black">Blog Preview</h2>
                            <button
                                onClick={() => setSelectedBlog(null)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <i className="fi fi-rr-cross" />
                            </button>
                        </div>

                        <div className="prose max-w-none">
                            <img src={banner} alt={title} className="aspect-video" />
                            <h1 className="text-4xl font-bold border-t border-gray-200/20 mt-10 mb-4">{title}</h1>
                            <div className="flex items-center space-x-3 mb-6 text-sm text-gray-500">
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src={profile_img}
                                    alt={fullname}
                                />
                                <span className="capitalize">{fullname}</span>
                                <span>•</span>
                                <span>@{username}</span>
                                <span>•</span>
                                <span>Published: {getFullDate(publishedAt)}</span>
                                <span>•</span>
                                <span>Updated: {getFullDate(updatedAt)}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple/20 text-purple/90"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {selectedBlog.content[0].blocks.map((block, i) => {
                                    return (
                                        <div key={i}>
                                            <BlogContent block={block} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {status === 'pending' && (
                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200/50">
                                <button
                                    onClick={() => handleStatusChange(_id, 'rejected')}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-50 bg-red/80 hover:bg-red/90 transition-colors duration-200"
                                >
                                    <i className="fi fi-rr-cross-small mr-1" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusChange(_id, 'approved')}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-50 bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                >
                                    <i className="fi fi-rr-check mr-1" />
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export { VerifyBlogCard, BlogPreviewCard }