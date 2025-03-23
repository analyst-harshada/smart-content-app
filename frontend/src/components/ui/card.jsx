import React from 'react';
import { cn } from '../lib/utils'; // Utility for conditional class merging

// Card wrapper component
const Card = ({ 
  className, 
  children, 
  variant = "default", 
  elevation = "md", 
  onClick,
  ...props 
}) => {
  // Define variant styles
  const variantStyles = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-amber-50 border border-amber-200",
    danger: "bg-red-50 border border-red-200",
    info: "bg-sky-50 border border-sky-200"
  };

  // Define elevation styles (shadow levels)
  const elevationStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-md",
    xl: "shadow-lg"
  };

  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-200",
        variantStyles[variant],
        elevationStyles[elevation],
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card header component
const CardHeader = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("px-6 py-4 border-b border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card title component
const CardTitle = ({ className, children, as = "h3", ...props }) => {
  const Tag = as;
  
  return (
    <Tag 
      className={cn(
        "font-medium text-gray-900",
        as === "h1" && "text-2xl",
        as === "h2" && "text-xl",
        as === "h3" && "text-lg",
        as === "h4" && "text-base",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Card subtitle component
const CardSubtitle = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("mt-1 text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card content/body component
const CardContent = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card media component for images
const CardMedia = ({ className, src, alt = "", aspectRatio = "16/9", ...props }) => {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden bg-gray-100",
        className
      )}
      style={{ aspectRatio }}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          No image
        </div>
      )}
    </div>
  );
};

// Card footer component
const CardFooter = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("px-6 py-3 bg-gray-50 border-t border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card badge component
const CardBadge = ({ className, children, variant = "default", ...props }) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Export all components
export {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardMedia,
  CardFooter,
  CardBadge
};