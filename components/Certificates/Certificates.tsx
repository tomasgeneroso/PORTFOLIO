"use client";
import React from "react";
import Image from "next/image";
import { TitleSeparator } from "../TitleSeparator/TitleSeparator";
import { useKeenSlider } from "keen-slider/react";
import { useI18n } from "@/lib/i18n/context";
import { certificatesTranslations } from "@/lib/i18n/userDataTranslations";
import "keen-slider/keen-slider.min.css";

interface Certificate {
  id: number;
  title: string;
  imagePath: string;
  issuer?: string;
  date?: string;
}

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  const { locale, t } = useI18n();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    drag: true,
    slides: {
      perView: 1,
      spacing: 20,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <section className="flex flex-col w-full py-8" id="certificatesSection">
      <TitleSeparator titleText={t.certificates.title} />

      <div className="relative px-4 md:px-8 py-8">
        {/* Carousel */}
        <div
          ref={sliderRef}
          className="keen-slider"
          style={{ cursor: "grab" }}
        >
          {certificates.map((certificate) => {
            const translation =
              certificatesTranslations[certificate.id]?.[locale];
            return (
              <div
                key={certificate.id}
                className="keen-slider__slide flex justify-center"
              >
                <div
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
                  bg-white dark:bg-[#1a1a1a]
                  border border-gray-200 dark:border-gray-700 w-full max-w-md"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-[#252525]">
                    <Image
                      src={certificate.imagePath}
                      alt={translation?.title || certificate.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a]">
                    <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">
                      {translation?.title || certificate.title}
                    </h3>

                    {(translation?.issuer || certificate.issuer) && (
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {translation?.issuer || certificate.issuer}
                      </p>
                    )}

                    {certificate.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {certificate.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Navigation */}
        {loaded && instanceRef.current && (
          <div className="flex gap-2 mt-4 justify-center">
            {Array.from({ length: certificates.length }).map((_, idx) => (
              <span
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: "#c2c2c2aa",
                  opacity: currentSlide === idx ? 1 : 0.4,
                  transform: currentSlide === idx ? "scale(1.2)" : "scale(1)",
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
