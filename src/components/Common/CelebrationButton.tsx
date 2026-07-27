import type { ReactNode } from "react";

type CelebrationButtonProps = {
  children: ReactNode;
  className?: string;
  hoverBackgroundClassName?: string;
};

const CelebrationButton = ({
  children,
  className = "",
  hoverBackgroundClassName = "bg-primary",
}: CelebrationButtonProps) => {
  return (
    <span
      className={`group relative inline-flex overflow-hidden ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1500 ease-out group-hover:h-24 group-hover:w-24 ${hoverBackgroundClassName}`}
      />
      <span className="relative z-10 inline-flex h-full w-full items-center justify-center">
        {children}
      </span>
    </span>
  );
};

export default CelebrationButton;
