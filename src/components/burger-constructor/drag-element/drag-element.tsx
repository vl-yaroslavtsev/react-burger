import { RefObject, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import cn from "classnames";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag, useDrop } from "react-dnd";

import { REORDER_CONSTRUCTOR_INGREDIENTS } from "../../../services/actions/constructor";
import { animate, usePrevious, useScreenSize } from "../../../services/utils";
import { IConstructorIngredient } from "../../../services/types/data";

import styles from "./drag-element.module.css";

interface IDragElementProps {
  item: IConstructorIngredient;
  index: number;
  onDelete: (
    item: IConstructorIngredient,
    ref: RefObject<HTMLLIElement>
  ) => void;
}

const DragElement: React.FC<IDragElementProps> = ({
  item,
  index,
  onDelete = () => {},
}) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLLIElement>(null);
  const [isHoverTop, setHoverTop] = useState(false);
  const [isTransition, setTransition] = useState(false);

  const element = ref.current?.querySelector(".constructor-element");

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.opacity = "0";
    animate({
      draw(progress) {
        el.style.opacity = `${progress}`;
      },
      duration: 500,
      timing: "easeOut",
    });
  }, []);

  const [{ isDrag }, dragTargetRef] = useDrag({
    type: "constructorItem",
    item: () => {
      return { id: item._id, index };
    },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const [{ isOver, didDrop }, dropTargetRef] = useDrop({
    accept: "constructorItem",
    drop(item: { id: string; index: number }) {
      const hoverIndex = index - (isHoverTop ? 1 : 0);
      const dropIndex = item.index;
      setTransition(false);

      if (dropIndex === hoverIndex) {
        return;
      }

      dispatch({
        type: REORDER_CONSTRUCTOR_INGREDIENTS,
        dropIndex,
        hoverIndex,
      });
      item.index = hoverIndex;
    },
    hover(item, monitor) {
      if (!element) return;
      setTransition(true);
      const clientRect = element.getBoundingClientRect();
      const offset = monitor.getSourceClientOffset() || { y: 0 };
      setHoverTop(offset.y <= clientRect.y);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      didDrop: monitor.didDrop(),
    }),
  });

  const prevIsDrag = usePrevious(isDrag);
  const prevIsOver = usePrevious(isOver);

  const overLeave = prevIsOver && !isOver;
  const dragLeave = prevIsDrag && !isDrag;

  const height = ref.current?.getBoundingClientRect().height || 0;

  dragTargetRef(dropTargetRef(ref));

  const screenSize = useScreenSize();
  const padding = screenSize === "desktop" ? 16 : 0;
  const defHeight = screenSize === "desktop" ? 80 : 56;

  return (
    <li
      className={cn(styles.container)}
      ref={ref}
      style={{
        opacity: isDrag ? 0 : 1,
        display: dragLeave && didDrop ? "none" : "",
        marginTop: isDrag && overLeave ? -height : 0,
        paddingBottom:
          !isDrag && isOver && !isHoverTop ? defHeight + padding * 2 : padding,
        paddingTop: !isDrag && isOver && isHoverTop ? defHeight + padding : 0,
        transitionDuration: isTransition ? "0.3s" : "0s",
      }}
      data-test-id={`ctr-item-${item._id}`}
    >
      <i className={cn(styles.dragItem)}>
        <DragIcon type="primary" />
      </i>
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onDelete(item, ref)}
      />
    </li>
  );
};

export default DragElement;
