import { memo } from "react";
import { useCallback } from "react";
import OrderInfo from "../order-info/order-info";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useOrders } from "../../services/orders";

import Modal from "../modal/modal";

const OrderInfoModal = memo(() => {
  const { id } = useParams();
  const history = useHistory();

  const { orders } = useSelector((store) => store.feed);

  const { ordersList } = useOrders(orders);

  const order = ordersList.find(({ number }) => number === Number(id));

  const modalOnClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const header = (
    <div className="text text_type_digits-default">#{order.number}</div>
  );

  return (
    order && (
      <Modal header={header} visible={true} onClose={modalOnClose}>
        <OrderInfo order={order} isInModal={true} />
      </Modal>
    )
  );
});

export default OrderInfoModal;
