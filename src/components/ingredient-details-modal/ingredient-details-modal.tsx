import { memo, useCallback } from "react";
import { useSelector } from "../../services/hooks";
import { useHistory, useParams } from "react-router-dom";

import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";

const IngredientDetailsModal: React.FC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { items: ingredients } = useSelector((store) => store.ingredients);

  const ingredient = ingredients.find(({ _id }) => _id === id) || null;

  const modalOnClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    ingredient && (
      <Modal header="Детали ингридиента" visible={true} onClose={modalOnClose}>
        <IngredientDetails ingredient={ingredient} />
      </Modal>
    )
  );
});

export default IngredientDetailsModal;
