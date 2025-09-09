import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import lightLogo from "../imgs/logo-light.png"
import darkLogo from "../imgs/logo-dark.png"
import AnimationWrapper from "../common/page-animation";
import darkBanner from "../imgs/blog-banner-dark.png";
import lightBanner from "../imgs/blog-banner-light.png";
import { uploadImage } from "../common/aws";
import { EditorContext } from "../pages/editor.pages";
import { tools } from "./tools.component";
import { ThemeContext, UserContext } from "../App";
import { useState } from "react";


const BlogEditor = () => {

    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    let { userAuth: { access_token } } = useContext(UserContext);
    let { theme } = useContext(ThemeContext);
    let { blog_id } = useParams();
    let navigate = useNavigate();

    const [isDragging, setIsDragging] = useState(false);

    // useEffect textEditor
    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Let's Write an Awesome Story"
            }))
        }
    }, [])

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleBannerUpload({ target: { files: [file] } });
        } else {
            toast.error("Invalid file type. Please upload an image.");
        }
    }

    const handleBannerUpload = (e) => {

        let img = e.target.files[0];

        if (img) {

            let loadingToast = toast.loading("Uploading...")

            uploadImage(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Image Uploaded Successfully 👍");

                    setBlog({ ...blog, banner: url })
                }
            })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
        }
    }

    const handleTitleKeyDown = (e) => {
        //console.log(e);
        if (e.keyCode == 13) { // enter key
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        //console.log(e);
        let input = e.target;

        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value })
    }

    const handleError = (e) => {
        let img = e.target;
        //console.log(img);
        img.src = theme == "light" ? lightBanner : darkBanner;
    }

    const handlePublishEvent = () => {

        if (!banner.length) {
            return toast.error("Please Upload a Blog Banner Image");
        }
        if (!title.length) {
            return toast.error("Please Enter a Blog Title");
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    setEditorState("publish")
                }
                else {
                    return toast.error("Write Something In Your Blog to Publish It");
                }
            })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }
        if (!title.length) {
            return toast.error("Write Blog Title Before Saving It As a Draft")
        }

        let loadingToast = toast.loading("Saving As Draft....");

        e.target.classList.add('disable');

        if (textEditor.isReady) {
            textEditor.save().then(content => {

                let blogObj = {
                    title, banner, des, content, tags, draft: true
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                    .then(() => {
                        e.target.classList.remove('disable');
                        toast.dismiss(loadingToast);
                        toast.success("Saved As Draft 👍");

                        setTimeout(() => {
                            navigate("/dashboard/blogs?tab=draft")
                        }, 500);
                    })
                    .catch(({ response }) => {
                        e.target.classList.remove('disable');
                        toast.dismiss(loadingToast);
                        return toast.error(response.data.error);
                    })
            })
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={theme == "light" ? darkLogo : lightLogo} />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">{title.length ? title : "New Blog"}</p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>Publish</button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>Save As Draft</button>
                </div>

            </nav>

            <Toaster />

            <AnimationWrapper>
                <section>

                    <div className="mx-auto max-w-[900px] w-full">

                        <div className={"relative aspect-video bg-white border-4 hover:opacity-80 transition-all duration-300 " + (isDragging ? "border-purple/30" : "border-grey")} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                            <label htmlFor="uploadBanner">
                                <img src={banner || (theme == "light" ? lightBanner : darkBanner)} onError={handleError} className="z-20" />
                                <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
                            </label>
                        </div>

                        <textarea defaultValue={title} placeholder="Blog Title" className="text-4xl font-medium w-full h-20 bg-white outline-none resize-none mt-10 leading-tight placeholder:opacity-40" onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>

                    </div>

                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;