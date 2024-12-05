import React from 'react';

export const UpIcon = ({ width = 24, fill = "#000", onClick }) => (
    <svg
      width={width || 24}   // Add fallback width
      height={width || 24}  // Ensure both width and height are set
      fill={fill || "#000"} // Add fallback fill
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 14l5-5 5 5H7z" />
    </svg>
  );
  
// Down Icon
export const DownIcon = ({ width = 24, fill = "#000", onClick }) => (
    <svg
      width={width || 24}
      height={width || 24}
      fill={fill || "#000"}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
  
  // Home Icon
  export const HomeIcon = ({ width = 24, fill = "#000", onClick }) => (
    <svg
      width={width || 24}
      height={width || 24}
      fill={fill || "#fff"}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
  
  // Cart Icon
  export const CartIcon = ({ width = 24, fill = "#000", onClick }) => (
    <svg
      width={width || 24}
      height={width || 24}
      fill={fill || "#fff"}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.16 6l.94 2h8.83l1.52-4H6.58l-.97-2H2v2h2l4.6 10H19v-2H9.42L7.16 6z" />
    </svg>
  );
  
  // Trash Icon
  export const TrashIcon = ({ width = 24, fill = "#000", onClick }) => (
    <svg
      width={width || 24}
      height={width || 24}
      fill={fill || "#000"}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 6l3 18h12l3-18H3zm5 2h2v12H8V8zm6 0h2v12h-2V8zM7 4V2h10v2h7v2H0V4h7z" />
    </svg>
  );
  