import React from "react";
import { CustomSvgIconProps } from "@/types";
const CustomIcon: React.FC<CustomSvgIconProps> = ({
  svgContent,
  className,
}) => {
  return (
    <div className={className}>
      {React.isValidElement(svgContent) &&
        React.cloneElement(svgContent as React.ReactElement<any>, {
          className: className || "",
        })}
    </div>
  );
};
export default CustomIcon;
