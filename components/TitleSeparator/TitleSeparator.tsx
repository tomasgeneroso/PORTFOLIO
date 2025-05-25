import { title } from "@/components/primitives";
import { FunctionComponent } from "react";
interface TitleSeparatorProps {
  titleText: string;
}

export const TitleSeparator: FunctionComponent<TitleSeparatorProps> = ({
  titleText,
}) => {
  return (
    <div className="flex h-10 w-full items-center px-2 mb-10 ">
      <h1 className={title({ size: "md" })}>{titleText}</h1>
      <div
        className="flex-1 ml-10 w-full h-1 mt-4 bg-amber-100 dark:bg-[#777272]"
        style={{ alignSelf: "center" }}
      ></div>
    </div>
  );
};
