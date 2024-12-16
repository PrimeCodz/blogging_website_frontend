import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {

    let { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);
    let { userAuth: { access_token, username, profile_img, fullname } } = useContext(UserContext);
    const [comment, setComment] = useState("");

    const handleComment = () => {
        if (!access_token) {
            return toast.error("Please Login First to Comment");
        }
        if (!comment.length) {
            return toast.error("Write Something to Leave a Comment...");
        }
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", { _id, blog_author, comment, replying_to: replyingTo },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data }) => {
                setComment('');
                data.commented_by = { personal_info: { username, profile_img, fullname } }

                let newCommentArr;

                if (replyingTo) {

                    {/*commentsArr[index].children.push(data._id);

                    data.childrenLevel = commentsArr[index].childrenLevel + 1;
                    data.parentIndex = index;

                    commentsArr[index].isReplyLoaded = true;

                    commentsArr.splice(index + 1, 0, data);

                    newCommentArr = commentsArr;*/}
                    newCommentArr = [...commentsArr];
                    if (!newCommentArr[index].children) {
                        newCommentArr[index].children = [];
                    }
                    newCommentArr[index].children.push(data._id);

                    data.childrenLevel = (newCommentArr[index].childrenLevel || 0) + 1;
                    data.parentIndex = index;

                    newCommentArr[index].isReplyLoaded = true;

                    newCommentArr.splice(index + 1, 0, data)

                    setReplying(false);
                }
                else {

                    data.childrenLevel = 0;

                    newCommentArr = [data, ...commentsArr];
                }

                let parentCommentIncrementVal = replyingTo ? 0 : 1;

                setBlog({ ...blog, comments: { ...comments, results: newCommentArr }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementVal } })

                setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementVal)
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Toaster />
            <textarea value={comment} placeholder="Leave a Comment..." className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto0" onChange={(e) => setComment(e.target.value)} />
            <button className="btn-dark mt-5 px-10" onClick={handleComment}>{action}</button>
        </>
    )
}

export default CommentField;