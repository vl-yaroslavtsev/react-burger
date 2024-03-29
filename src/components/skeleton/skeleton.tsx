import cn from "classnames";

import styles from "./skeleton.module.css";

interface ISkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  circle?: boolean;
  repeat?: number;
  tag?: keyof JSX.IntrinsicElements;
}

const Skeleton: React.FC<ISkeletonProps> = ({
  width,
  height,
  className,
  circle = false,
  repeat = 1,
  tag: Tag = "div",
}) => {
  const style = {
    ...(width ? { width } : {}),
    ...(circle ? { height: width } : {}),
    ...(height ? { height } : {}),
  };

  const classNameTotal = cn(styles.skeleton, className, {
    [styles.circle]: circle,
  });

  if (repeat > 1) {
    return (
      <>
        {Array(repeat)
          .fill(null)
          .map((item, index) => (
            <Tag key={index} className={classNameTotal} style={{ ...style }}>
              &nbsp;
            </Tag>
          ))}
      </>
    );
  }

  return (
    <Tag className={classNameTotal} style={{ ...style }}>
      &nbsp;
    </Tag>
  );
};

export default Skeleton;
