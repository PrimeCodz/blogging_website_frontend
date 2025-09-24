import { useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
const LandingPage = () => {

    let navigate = useNavigate();

    return (
        <>
            <AnimationWrapper>
                <section className="flex flex-col h-cover">
                    {/* Hero Section */}
                    <div className="h-[80vh] w-full flex justify-around items-center border-b border-dark-grey gap-10 rounded-tr-md relative overflow-hidden px-10">
                        {/* Text Section */}
                        <div className="flex flex-col gap-10 justify-center items-start z-10 w-full md:w-1/2 max-w-[600px]">
                            <h1 className="font-bold text-5xl font-gelasio leading-tight">Whispers That Resonate, Thoughts That Matter</h1>
                            <p className="text-xl md:text-2xl text-dark-grey"><span className="font-bold font-gelasio text-xl md:text-2xl">'Whispought'</span> — a peaceful place to write, reflect, and discover the stories that live within you.</p>
                            <button className="btn-dark" onClick={() => navigate("/home")}>Start Reading</button>
                        </div>
                        {/* Image Section */}
                        <div className="hidden md:block w-1/2 h-full relative z-0">
                            <div className="absolute -top-[20px] -right-[80px] rotate-6 w-[500px] h-[500px] rounded-[60px] shadow-2xl shadow-dark-grey/40 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1555601568-c9e6f328489b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGJsb2d8ZW58MHx8MHx8fDA%3D" alt="..." className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700 ease-in-out" />
                            </div>
                        </div>
                    </div>
                    {/* Footer Section */}
                    <footer className="mt-1 py-2 px-3 md:px-20 flex flex-row flex-wrap items-center gap-2 md:gap-4 justify-center text-sm text-dark-grey/40">
                        <p className="hover:text-dark-grey text-sm md:text-base cursor-pointer">About</p>
                        <p className="hover:text-dark-grey text-sm md:text-base cursor-pointer">Help</p>
                        <p className="hover:text-dark-grey text-sm md:text-base cursor-pointer">Privacy Policy</p>
                        <p className="hover:text-dark-grey text-sm md:text-base cursor-pointer">Terms & Conditions</p>
                        <p className="hover:text-dark-grey text-sm md:text-base cursor-pointer">Contact</p>
                    </footer>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default LandingPage;