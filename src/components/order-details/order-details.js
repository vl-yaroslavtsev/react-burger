import cn from "classnames";
import PropTypes from "prop-types";
import statusIcon from "../../images/done.svg";

import styles from "./order-details.module.css";

function OrderDetails({ orderNumber }) {
  return (
    <div className={cn(styles.container, "pl-15 pr-15 pb-20")}>
      <h1 className={cn(styles.title, "text text_type_digits-large mt-4 mb-8")}>
        {orderNumber}
      </h1>
      <p className="text text_type_main-medium mb-15">Идентификатор заказа</p>
      <img
        width="120"
        height="120"
        src={statusIcon}
        alt="Заказ зарегистрирован"
      />
      <p className="text text_type_main-default mt-15 mb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
}

OrderDetails.propTypes = {
  orderNumber: PropTypes.number.isRequired,
};

export default OrderDetails;
