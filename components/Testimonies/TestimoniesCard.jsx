import React from 'react';
const TestimonialCard = ({ author, logo, projectLink, testimonial }) => {
    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-full">
            <img
                src={logo}
                alt={author}
                width={60}
                height={60}
                className="rounded-full mb-4"
            />
            <h5>{author}</h5>
            <a href={projectLink} className="text-blue-500 hover:underline">
                {projectLink}
            </a>
            <p className="mt-2 text-wrap">{testimonial}</p>
        </div>
    );
};
export default TestimonialCard; 
