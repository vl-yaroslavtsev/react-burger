import cn from "classnames";
import PropTypes from "prop-types";
import Modal from "../modal/modal";
import statusIcon from "../../images/done.svg";

import styles from "./order-details.module.css";

function OrderDetails({ order, visible = false, onClose = () => {} }) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <div className={cn(styles.container, "pl-15 pr-15 pb-20")}>
        <h1
          className={cn(styles.title, "text text_type_digits-large mt-4 mb-8")}
        >
          {order.id}
        </h1>
        <p className="text text_type_main-medium mb-15">Идентификатор заказа</p>
        <img width="120" height="120" src={statusIcon} alt={order.status} />
        <p className="text text_type_main-default mt-15 mb-2">{order.status}</p>
        <p className="text text_type_main-default text_color_inactive">
          {order.status_desc}
        </p>
      </div>
    </Modal>
  );
}

OrderDetails.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    status_desc: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default OrderDetails;
