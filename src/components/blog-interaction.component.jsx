import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import { UserContext } from "../App";
import axios from "axios";

const BlogInteraction = () => {

    let { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, setCommentsWrapper } = useContext(BlogContext);
    let { userAuth: { username, access_token } } = useContext(UserContext);

    useEffect(() => {

        if(access_token) {
            // make request to server to get like information
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isLiked-by-user", { _id }, { 
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            .then(({data: {result}}) => {
                setIsLikedByUser(Boolean(result))
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [])

    const handleLike = () => {

        if (access_token) {
            // logic for like the blog
            setIsLikedByUser(preVal => !preVal)

            !isLikedByUser ? total_likes++ : total_likes-- ;
            setBlog({ ...blog, activity: { ...activity, total_likes } })
            //console.log(isLikedByUser);
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, { 
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            .then(({data}) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        else {
            // not logged in
            toast.error("Please Log In to Like this Blog")
        }
    }

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button className={"w-10 h-10 rounded-full flex items-center justify-center " + ( isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80" )} onClick={handleLike}>
                        <i className={"fi " + ( isLikedByUser ? "fi-sr-heart" : "fi-rr-heart" )} />
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={() => setCommentsWrapper(preVal => !preVal)}>
                        <i className="fi fi-rr-comment-dots" />
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>
                <div className="flex gap-6 items-center">
                    <>
                        {username == author_username ? (
                            <Link to={`/editor/${blog_id}`} className="hover:text-purple">Edit</Link>
                        ) : ("")

                        }
                    </>
                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}><i className="fi fi-brands-twitter text-xl hover:text-twitter" /></Link>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    )
}

export default BlogInteraction;