import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import cn from "classnames";
import PropTypes from "prop-types";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag, useDrop } from "react-dnd";

import { REORDER_CONSTRUCTOR_INGREDIENTS } from "../../../services/actions/constructor";

import { animate } from "../../../services/utils";

import styles from "./drag-element.module.css";

// Хук: получаем предыдущее значение пропса или состояния
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function DragElement({ item, index, onDelete = () => {} }) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [isHoverTop, setHoverTop] = useState(false);
  const [isTransition, setTransition] = useState(false);

  const element = ref.current?.querySelector(".constructor-element");

  useEffect(() => {
    const el = ref.current;
    el.style.opacity = 0;
    animate({
      draw(progress) {
        el.style.opacity = progress;
      },
      duration: 500,
      timing: "easeOut",
    });
  }, []);

  const [{ isDrag }, dragTargetRef] = useDrag({
    type: "constructorItem",
    item: () => {
      return { id: item.id, index };
    },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const [{ isOver, didDrop }, dropTargetRef] = useDrop({
    accept: "constructorItem",
    drop(item) {
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
      const offset = monitor.getSourceClientOffset();
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

  const height = ref.current?.getBoundingClientRect().height;

  dragTargetRef(dropTargetRef(ref));

  return (
    <li
      className={cn(styles.container, "pb-4")}
      ref={ref}
      style={{
        opacity: isDrag ? 0 : 1,
        display: dragLeave && didDrop ? "none" : "",
        marginTop: isDrag && overLeave ? -height : 0,
        paddingBottom: !isDrag && isOver && !isHoverTop ? 80 + 16 * 2 : 16,
        paddingTop: !isDrag && isOver && isHoverTop ? 80 + 16 : 0,
        transitionDuration: isTransition ? "0.3s" : "0s",
      }}
    >
      <i className={cn(styles.dragItem, "mr-2")}>
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
}

DragElement.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
};

export default DragElement;
