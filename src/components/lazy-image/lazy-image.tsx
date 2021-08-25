import {
  useState,
  useEffect,
  useRef,
  memo,
  ImgHTMLAttributes,
  RefObject,
} from "react";
import cn from "classnames";

import styles from "./lazy-image.module.css";

function useImageLoaded(src: string, ref: RefObject<HTMLDivElement>) {
  const [isLoaded, setLoaded] = useState(false);

  const loadImage = async (src: string) => {
    if (!src) return;
    const img = new Image();
    img.src = src;

    return new Promise((resolve, reject) => {
      img.onload = () => resolve(src);
      img.onerror = reject;
    });
  };

  useEffect(() => {
    if (ref.current === null || !src) {
      return;
    }

    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // если элемент является наблюдаемым
          if (entry.isIntersecting) {
            loadImage(src).then(() => setLoaded(true));
          }
        });
      },
      {
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.unobserve(el);
  }, [isLoaded, src, ref]);

  return isLoaded;
}

interface ILazyImage extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  responsive?: boolean;
  className?: string;
  width?: number;
  height?: string;
}

const LazyImage: React.FC<ILazyImage> = memo(
  ({
    src,
    responsive = true,
    className = "",
    alt = "",
    width = 250,
    height = "50%",
    ...props
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const imageLoaded = useImageLoaded(src, ref);
    const style = {
      "--img-width": `${width}px`,
      "--img-height": height,
    } as React.CSSProperties;
    return (
      <>
        {imageLoaded ? (
          <img
            className={cn(className, { [styles.imageResponsive]: responsive })}
            src={src}
            {...(responsive ? {} : { width })}
            alt={alt}
            {...props}
          />
        ) : (
          <div
            className={cn(styles.imagePreloader, className, {
              [styles.imagePreloaderResponsive]: responsive,
            })}
            ref={ref}
            style={style}
          ></div>
        )}
      </>
    );
  }
);

export default LazyImage;
