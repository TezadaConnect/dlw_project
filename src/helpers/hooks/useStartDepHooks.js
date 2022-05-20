import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PRODUCT_QUERY } from "../../services/product_service";
import { onSnapshot, query } from "@firebase/firestore";
import { setProduct } from "../../redux/slice/service_product_slice";
import { PICKUP_QUERY } from "../../services/request_service";
import { setProject, setRefresh } from "../../redux/slice/response_slice";
import { QUERY_APP } from "../../services/app_setting_services";

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

export const useGetPickupUpdate = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = onSnapshot(query(PICKUP_QUERY), (snap) => {
      dispatch(setRefresh());
    });
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useGetAppSetting = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = onSnapshot(query(QUERY_APP), (snap) => {
      const collection = [];
      snap.forEach((doc) => {
        collection.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      dispatch(setProject(collection[0]));
    });
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
