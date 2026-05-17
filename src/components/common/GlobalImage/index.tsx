import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface GlobalImageProps {
  src: string | StaticImport;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

const GlobalImage: React.FC<GlobalImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority,
}) => {
  return (
    <Image
      src={src || "/path/to/placeholder.png"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fill={fill}
      priority={priority}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent looping
        target.src = "/path/to/placeholder.png";
      }}
    />
  );
};

export default GlobalImage;
