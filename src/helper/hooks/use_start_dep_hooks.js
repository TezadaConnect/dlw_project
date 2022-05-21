import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSnapshot, orderBy, limit, query, where } from "firebase/firestore";
import {
  setCurrentRequest,
  setProduct,
  setTime,
  setTopProduct,
} from "../../redux/slices/product_slice";
import { PRODUCT_QUERY } from "../../service/product_service";
import { PICKUP_QUERY } from "../../service/request_service";
import { setProject } from "../../redux/slices/response_slice";
import { QUERY_APP } from "../../service/app_setting_service";

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

export const useGetTopProducts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = onSnapshot(
      query(PICKUP_QUERY, where("status", "==", "DONE")),
      (snap) => {
        const collection = [];
        snap.forEach((doc) => {
          collection.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        dispatch(setTopProduct(collection));
      }
    );
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
        query(
          PICKUP_QUERY,
          where("user_id", "==", user.id),
          orderBy("create_at", "desc"),
          limit(1)
        ),
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

export const useGetTimer = () => {
  const { currentRequest, time } = useSelector((state) => state.product);
  const { refresh } = useSelector((state) => state.response);
  const dispatch = useDispatch();
  useEffect(() => {
    const date1 = new Date();
    const date2 = new Date(currentRequest?.release_date?.toDate());
    const countdownSeconds = Math.abs(date1 - date2) / 1000;
    console.log(countdownSeconds);
    dispatch(setTime(countdownSeconds));
  }, [refresh]);
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
