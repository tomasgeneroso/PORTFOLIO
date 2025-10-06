"use client";
import React, { useState, useRef } from 'react';
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import TestimonialCard from '@/components/Testimonies/TestimoniesCard';
export default function Testimonies({ testimonies }) {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Create duplicated testimonies for infinite scroll
    const duplicatedTestimonies = [...testimonies, ...testimonies, ...testimonies];

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Velocidad del desplazamiento
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleMouseLeave = () => {
        setIsDragging(false);
    };
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };
    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Velocidad del desplazamiento
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Handle infinite scroll loop
    const handleScroll = () => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const singleSetWidth = scrollWidth / 3;

        // If scrolled to the end, jump back to the middle set
        if (scrollLeft >= singleSetWidth * 2) {
            carouselRef.current.scrollLeft = scrollLeft - singleSetWidth;
        }
        // If scrolled to the beginning, jump to the middle set
        else if (scrollLeft <= 0) {
            carouselRef.current.scrollLeft = scrollLeft + singleSetWidth;
        }
    };

    React.useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        // Set initial scroll position to the middle set
        const singleSetWidth = carousel.scrollWidth / 3;
        carousel.scrollLeft = singleSetWidth;

        carousel.addEventListener('scroll', handleScroll);
        return () => carousel.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="flex flex-col w-full mx-0 p-2 h-screen" id="testimoniesSection">
            <TitleSeparator titleText="Testimonies" />
            <div className="flex flex-wrap w-full gap-4">
                <div className="container mx-auto">
                    <div className="mt-8 relative">
                        <div
                            ref={carouselRef}
                            className="flex gap-4 px-2 w-full overflow-hidden"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{ scrollbarWidth: 'none', cursor: isDragging ? 'grabbing' : 'grab', }}
                        >
                            {duplicatedTestimonies.map((testimonial, index) => (
                                <div key={index} style={{ width: '100%' }} className="inline-block">
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}