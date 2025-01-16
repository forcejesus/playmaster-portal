import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function ImageLoader({ src, alt, className, fallback, ...props }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton 
          className={`absolute inset-0 ${className}`}
        />
      )}
      <img
        src={error && fallback ? fallback : src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}