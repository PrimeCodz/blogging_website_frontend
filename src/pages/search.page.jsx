import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
import UserCard from "../components/usercard.component";



const SearchPage = () => {

    let {query} = useParams();
    let [blogs, setBlog] = useState(null);
    let [users, setUser] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blog", {query, page})
        .then(async ({ data }) => {

            let formatData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: {query},
                create_new_arr
            })
            setBlog(formatData);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const fetchUser = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-user", {query})
        .then(({data: {users}}) => {
            setUser(users);
        })
    }

    const resetState = () => {
        setBlog(null);
        setUser(null);
    }

    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUser();
    }, [query])

    const UserCardWrapper = () => {
        return(
            <>
                {users == null ? (
                    <Loader />
                ) : (users.length ? (
                    users.map((user, i) => {
                        return(
                            <>
                                <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.08}}>
                                    <UserCard user={user} />
                                </AnimationWrapper>
                            </>
                        )
                    })
                ) : (
                    <NoDataMessage message="No User Found" />
                )
                )}
            </>
        )
    }

    return(
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={[`Search Results For "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Hidden"]}>
                    <>
                        {blogs == null ? (
                            <Loader />
                        ) : (
                            blogs.results.length ? (
                                blogs.results.map((blog, i) => {
                                    return(
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}><BlogPostCard content={blog} author={blog.author.personal_info} /></AnimationWrapper>
                                    );
                                })
                            ) : (
                                <NoDataMessage message="No Blogs Published" />
                            )
                        )}
                        <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />

                    </>

                    <>
                        <UserCardWrapper />
                    </>
                </InPageNavigation> 
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">User Related To Search<i className="fi fi-rr-user mt-1 pl-1" /></h1>
                <UserCardWrapper />
            </div>

        </section>
    );
}

export default SearchPage;