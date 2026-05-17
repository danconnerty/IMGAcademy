
import React from 'react';

const logos = [
    "/TeamLogos/RFK.png",
    "/TeamLogos/Appollon.png",
    "/TeamLogos/BC.png",
    "/TeamLogos/Hofstra.png",
    "/TeamLogos/McLennan.png",
    "/TeamLogos/USMMA.png",
    "/TeamLogos/FAU.png",
    "/TeamLogos/Michigan%20State.png",
    "/TeamLogos/Syracuse.svg.png",
    "/TeamLogos/Richmond.png",
    "/TeamLogos/Butler.png",
    "/TeamLogos/Northwood.png",
    "/TeamLogos/Missouri%20State.png",
    "/TeamLogos/CMU.png",
    "/TeamLogos/Davenport.png",
    "/TeamLogos/VA%20Glory.png",
    "/TeamLogos/Texas%20Glory.png",
    "/TeamLogos/UIndy.png",
    "/TeamLogos/Utah%20Valley.png",
    "/TeamLogos/UWaterloo.png",
    "/TeamLogos/Carleton.png",
    "/TeamLogos/Mcgill.png",
    "/TeamLogos/Concordia.png",
];

const TrustedTeams: React.FC = () => {
    // Tripling the logos to ensure seamless loop on large screens
    const allLogos = [...logos, ...logos, ...logos];

    return (
        <section className="w-full bg-black text-white py-12 md:py-16 border-y border-white/5 overflow-hidden relative min-h-[200px]">

            {/* Tech Background Overlay */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container mx-auto px-6 mb-10 text-center relative z-10">
                <div className="inline-flex items-center gap-2 mb-2">
                    <h2 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gray-400">
                        BUILT FOR ELITE PROGRAMS
                    </h2>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for sleek fade-in/out */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

                <div className="flex items-center gap-12 md:gap-20 animate-infinite-scroll w-max hover:[animation-play-state:paused]">
                    {allLogos.map((src, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-28 md:w-40 h-16 flex items-center justify-center group"
                        >
                            <img
                                src={src}
                                alt="Team Logo"
                                loading="lazy"
                                width="160"
                                height="64"
                                className="max-w-full max-h-full object-contain opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 drop-shadow-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes infinite-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* 1/3 of the width since we have 3 sets */
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 60s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default TrustedTeams;
