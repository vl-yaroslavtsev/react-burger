import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import cn from "classnames";
import PropTypes from "prop-types";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag, useDrop } from "react-dnd";

import { REORDER_CONSTRUCTOR_INGREDIENTS } from "../../../services/actions/constructor";

import styles from "./drag-element.module.css";

function DragElement({ item, index, onDelete = () => {} }) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [isHoverTop, setHoverTop] = useState(false);

  const clientRect = ref.current?.getBoundingClientRect();

  const [{ isDrag }, dragTargetRef] = useDrag({
    type: "constructorItem",
    item: () => {
      return { id: item.id, index };
    },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropTargetRef] = useDrop({
    accept: "constructorItem",
    drop(item) {
      const hoverIndex = index - (isHoverTop ? 1 : 0);
      const dropIndex = item.index;
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
      const offset = monitor.getClientOffset();
      setHoverTop(offset.y < clientRect.y + clientRect.height / 2);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  dragTargetRef(dropTargetRef(ref));

  return (
    <li
      className={cn(styles.container, "pb-4")}
      ref={ref}
      style={{
        display: isDrag ? "none" : "",
        paddingBottom: isOver && !isHoverTop ? 80 : 16,
        paddingTop: isOver && isHoverTop ? 80 : 0,
        transitionDuration: isOver ? ".3s" : "0s",
      }}
    >
      <i className={cn(styles.dragItem, "mr-2")}>
        <DragIcon type="primary" />
      </i>
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onDelete(item)}
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
