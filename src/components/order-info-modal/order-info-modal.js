import { memo } from "react";
import { useCallback } from "react";
import OrderInfo from "../order-info/order-info";
import { useHistory, useParams } from "react-router-dom";

import Modal from "../modal/modal";
import { ordersList } from "../../services/data";

const OrderInfoModal = memo(() => {
  const { id } = useParams();
  const history = useHistory();
  const order = ordersList.find(({ number }) => number === id);

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
