import React from "react";
import { CustomSvgIconProps } from "@/types";

const CustomIcon: React.FC<CustomSvgIconProps> = ({
  svgContent,
  className,
}) => {
  console.log(svgContent);
  return (
    <div className={className}>
      {React.cloneElement(svgContent, {
        className: className || "", // añade clases CSS opcionalmente al SVG
      })}
    </div>
  );
};

export default CustomIcon;
