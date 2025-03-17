import Navbar from "./Navbar"
import Footer from "../../layout/Footer"

const About = () => {
    return (
        <>
            <Navbar />
            <section className="bg-white dark:bg-gray-900">
                <div className="relative flex">
                    <div className="min-h-screen lg:w-1/3" />
                    <div className="hidden w-3/4 min-h-screen bg-gray-100 dark:bg-gray-800 lg:block" />
                    <div className="container flex flex-col justify-center w-full min-h-screen px-6 py-10 mx-auto lg:absolute lg:inset-x-0">
                        <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">
                            What our <span className="text-blue-800">CEO</span> <br /> Has to Say
                        </h1>
                        <div className="mt-10 lg:mt-20 lg:flex lg:items-center">
                            <img
                                className="object-cover object-center w-full lg:w-[32rem] rounded-lg h-96"
                                src="/images/Rashi.jpeg"
                                alt=""
                            />
                            <div className="mt-8 lg:px-10 lg:mt-0">
                                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white lg:w-72">
                                    Hello, Wonderful Community,
                                </h1>
                                <p className="max-w-lg mt-6 text-gray-500 dark:text-gray-400">
                                    “At Go, we are committed to providing a safe and reliable cab service exclusively designed for All our citzens.
                                    Our team is dedicated to making your ride experience exceptional, and we are continuously working to improve our services to better serve you.”
                                </p>

                                <p className="max-w-lg mt-6 text-gray-500 dark:text-gray-400">
                                    Thank you for choosing Go, where your safety is our destination.
                                </p>
                                <h3 className="mt-6 text-lg font-medium text-blue-500">
                                    Muhammed Rashid T
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    CEO - Go Pvt Ltd
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default About