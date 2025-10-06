import React from "react";
import Image from "next/image";
const TestimonialCard = ({ author, logo, projectLink, testimonial }) => {
    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-full">
            <Image
                src={logo}
                alt={author}
                width={60}
                height={60}
                className="rounded-full mb-4"

            />
            <h5 className="text-lg md:text-xl font-semibold">{author}</h5>
            <a href={projectLink} className="text-base md:text-lg text-blue-500 hover:underline">
                {projectLink}
            </a>
            <p className="mt-2 text-base md:text-lg text-wrap">{testimonial}</p>
        </div>
    );
};
export default TestimonialCard; 
