import React from "react";
import Head from "next/head";
import { scroller } from "react-scroll";
import ResourceCard from "@/components/ResourceCard";

export default function Home() {
    const resources = [
        {
            title: "Union Station Homeless Services",
            address: "412 S. Raymond Avenue, Pasadena, CA",
            date: "Feb 3, 2025",
            time: "8:30AM - 5:00PM",
            image: "/images/resource-1.jpg",
        },
        {
            title: "La Puente Food Distribution",
            address: "1720 N. Walnut Ave, La Puente, CA",
            date: "Feb 11, 2025",
            time: "3:00PM - 6:00PM",
            image: "/images/resource-2.jpg",
        },
        {
            title: "Compassion Connection",
            address: "1711 N Van Ness Ave, Hollywood, CA",
            date: "Feb 4, 2025",
            time: "9:30AM - 3:00PM",
            image: "/images/resource-3.jpg",
        },
        {
            title: "Food Pantry Distribution",
            address: "4368 Santa Anita Ave, El Monte, CA",
            date: "Feb 4, 2025",
            time: "9:00AM - 12:00PM",
            image: "/images/resource-4.jpg",
        },
    ];

    return (
        <div className="relative">
            <Head>
                <title>LA Relief - Discover Aid Near You</title>
                <meta
                    name="description"
                    content="Find aid and resources near you for emergencies and support."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400;700&family=Noto+Sans:wght@700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Mission Section */}
            <section id="next-section" className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden">
                <div
                    className="absolute top-0 right-0 h-full bg-[#267738] rounded-tl-[160px] rounded-bl-[100px]"
                    style={{
                        zIndex: 0,
                        width: "30.5%",
                        boxShadow: "-25px 1px 2px 0 rgba(0, 0, 0, 0.3)",
                    }}
                ></div>

                <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
                    <div className="md:w-[80%] lg:w-[50%] w-full z-10 flex flex-col justify-center items-center text-center h-full pl-16">
                        <h2
                            className="mb-6"
                            style={{
                                fontFamily: "'Noto Sans', sans-serif",
                                fontWeight: "900",
                                fontSize: "94px",
                                lineHeight: "1.1",
                                whiteSpace: "nowrap",
                                textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                            }}
                        >
                            VOLUNTEER
                        </h2>

                        <p
                            className="text-lg md:text-xl mb-8 leading-relaxed"
                            style={{
                                fontFamily: "'Noto Sans', sans-serif",
                                fontWeight: "400",
                                fontSize: "22px",
                            }}
                        >
                            Our mission is to stand with communities affected by the Los Angeles
                            wildfires. We’re here to make it easier to find the resources,
                            support, and opportunities needed to recover and rebuild. Whether
                            it’s through donations, volunteering, or simply offering a helping
                            hand, we believe in the power of coming together to make a real
                            difference.
                        </p>

                        <div className="flex gap-4">
                            <button
                                className="bg-white text-[#183917] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#183917] hover:text-white hover:border-white transition-all duration-300 cursor-pointer"
                                style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: "20px" }}
                                onClick={() =>
                                    scroller.scrollTo("resources", {
                                        smooth: true,
                                        duration: 500,
                                        offset: -72, // Adjust based on navbar height
                                    })
                                }
                            >
                                EXPLORE RESOURCES
                            </button>
                        </div>
                    </div>

                    <div className="md:w-[55%] relative h-full pl-16">
                        <div className="relative z-10">
                            <img
                                src="/images/mission-graphic.png"
                                alt="Support graphic"
                                className="w-[73%] h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section id="resources" className="py-16" style={{ backgroundColor: "#183917" }}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2
                        className="text-center text-white mb-12"
                        style={{
                            fontFamily: "'Noto Sans', sans-serif",
                            fontWeight: "900",
                            fontSize: "64px",
                            textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        SEARCH FOR RESOURCES
                    </h2>

                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                            {resources.map((resource, index) => (
                                <ResourceCard key={index} resource={resource} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
