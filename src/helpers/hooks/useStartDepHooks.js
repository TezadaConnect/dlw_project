import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PRODUCT_QUERY } from "../../services/product_service";
import { onSnapshot, query } from "@firebase/firestore";
import { setProduct } from "../../redux/slice/service_product_slice";

export const useGetProducts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = onSnapshot(query(PRODUCT_QUERY), (snap) => {
      const collection = [];
      snap.forEach((doc) => {
        collection.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      dispatch(setProduct(collection));
    });
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
