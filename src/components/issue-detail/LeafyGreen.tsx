
import React from 'react';

interface LeafyGreenProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const LeafyGreen: React.FC<LeafyGreenProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 22c1.25-1.25 2.5-2.5 3.75-2.5 2.5 0 0 2.5 2.5 2.5 1.25 0 2.5-1.25 3.75-2.5"/>
    <path d="M8 16.75c1.25-1.25 2.5-2.5 3.75-2.5 2.5 0 0 2.5 2.5 2.5 1.25 0 2.5-1.25 3.75-2.5"/>
    <path d="M14 11.5c1.25-1.25 2.5-2.5 3.75-2.5 2.5 0 0 2.5 2.5 2.5"/>
    <path d="M20 6.25c1.25-1.25 2.5-2.5 0-2.5s-2.5 1.25-3.75 2.5"/>
    <path d="M14 11.5c-1.25-1.25-2.5-2.5-3.75-2.5-2.5 0 0 2.5-2.5 2.5-1.25 0-2.5-1.25-3.75-2.5"/>
    <path d="M8 16.75c-1.25-1.25-2.5-2.5-3.75-2.5"/>
  </svg>
);

export default LeafyGreen;
