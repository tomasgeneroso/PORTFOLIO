"use client";

import { useEffect, useRef, useState } from "react";
import { title } from "@/components/primitives";
import { FunctionComponent } from "react";
import clsx from "clsx";

interface TitleSeparatorProps {
  titleText: string;
}

export const TitleSeparator: FunctionComponent<TitleSeparatorProps> = ({
  titleText,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (lineRef.current) {
      observer.observe(lineRef.current);
    }
  }, [lineRef, isVisible, setIsVisible]);

  return (
    <div className="flex items-center w-full px-2 mb-10">
      <h1
        className={clsx(title({ size: "md" }), "whitespace-nowrap")}
        style={{ color: "#8c8c8c" }}
      >
        {titleText}
      </h1>
      <div
        ref={lineRef}
        className="ml-4 h-[2px] bg-amber-100 dark:bg-[#8c8c8c]"
        style={{
          transition: "width 0.9s ease-in-out",
          width: isVisible ? "100%" : "10%",
        }}
      />
    </div>
  );
};
