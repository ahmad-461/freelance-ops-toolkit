import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "text-blue-600 dark:text-blue-500", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Freelance Ops Logo"
      role="img"
    >
      <path
        d="M24 8H8V21C8 23.8 11 26 17 26C22 26 26 22 26 17C26 12 22 8 17 8C12.5 8 9 11.5 8 17"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16H16"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
