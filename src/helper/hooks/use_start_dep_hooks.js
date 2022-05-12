import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSnapshot, orderBy, limit, query, where } from "firebase/firestore";
import {
  setCurrentRequest,
  setProduct,
} from "../../redux/slices/product_slice";
import { PRODUCT_QUERY } from "../../service/product_service";
import { PICKUP_QUERY } from "../../service/request_service";

export const useGetProducts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = onSnapshot(query(PRODUCT_QUERY), (snap) => {
      const collection = [];
      snap.forEach((doc) => {
        if (doc.data().platform === "mobile") {
          collection.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      dispatch(setProduct(collection));
    });
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useGetCurrentRequest = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user != null) {
      const unSub = onSnapshot(
        query(PICKUP_QUERY, where("user_id", "==", user.id), limit(1)),
        (snap) => {
          if (!snap.empty) {
            const collection = [];
            snap.forEach((doc) => {
              collection.push({
                id: doc.id,
                ...doc.data(),
              });
            });

            dispatch(setCurrentRequest(collection[0]));
          }

          if (snap.empty) {
            dispatch(setCurrentRequest(null));
          }
        }
      );
      return unSub;
    }
  }, [user]);
};
