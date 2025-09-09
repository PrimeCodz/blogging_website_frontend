import { Link } from "react-router-dom";
import lightPageNotFoundImage from "../imgs/404-light.png";
import darkPageNotFoundImage from "../imgs/404-dark.png";
import lightFullLogo from "../imgs/full-logo-light.png";
import darkFullLogo from "../imgs/full-logo-dark.png";
import { useContext } from "react";
import { ThemeContext } from "../App";

const PageNotFound = () => {

    let { theme } = useContext(ThemeContext);

    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-16 text-center">
            <img src={theme == "light" ? darkPageNotFoundImage : lightPageNotFoundImage} className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" />
            <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
            <p>The page you are looking for does not exists. Head back to the <Link to="/" className="text-black underline">Home Page</Link> </p>
            <div className="mt-auto">
                <img src={theme == "light" ? darkFullLogo : lightFullLogo} className=" h-16 object-contain block mx-auto select-none" />
                <p className="mt-5 text-dark-grey">Read millions of stories about the world</p>
            </div>
        </section>
    )
}

export default PageNotFound;