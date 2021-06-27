import { useRef } from "react";
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
      const hoverIndex = index;
      const dragIndex = item.index;
      if (dragIndex === hoverIndex) {
        return;
      }
      dispatch({
        type: REORDER_CONSTRUCTOR_INGREDIENTS,
        dragIndex,
        hoverIndex,
      });
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  dragTargetRef(dropTargetRef(ref));

  return (
    <li
      className={styles.container}
      ref={ref}
      style={{
        opacity: isDrag ? 0.2 : 1,
        paddingBottom: isOver && !isDrag ? 50 : 0,
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
  }),
  index: PropTypes.number,
  onDelete: PropTypes.func,
};

export default DragElement;
