import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSnapshot, orderBy, limit, query, where } from "firebase/firestore";
import {
  setCounter,
  setCurrentRequest,
  setProduct,
  setTime,
  setTopProduct,
} from "../../redux/slices/product_slice";
import { PRODUCT_QUERY } from "../../service/product_service";
import { PICKUP_QUERY } from "../../service/request_service";
import {
  setProject,
  setRefresh,
  setUnreadNotificationCount,
  setUnreadStatus,
} from "../../redux/slices/response_slice";
import { QUERY_APP } from "../../service/app_setting_service";
import { getUnreadIndieNotificationInboxCount } from "native-notify";

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
          dispatch(setRefresh());
          if (!snap.empty) {
            const collection = [];
            snap.forEach((doc) => {
              collection.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            dispatch(setCurrentRequest(collection[0]));
            dispatch(setCounter());
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

export const useGetTimer = async () => {
  const { currentRequest } = useSelector((state) => state.product);
  const { refresh } = useSelector((state) => state.response);
  const dispatch = useDispatch();

  useEffect(() => {
    const date2 = new Date(currentRequest?.release_date?.toDate()) ?? null;
    const date1 = new Date();
    const dataTime = date2.getTime() / 1000 - date1.getTime() / 1000;

    if (!isNaN(dataTime) && currentRequest?.release_date?.toDate() !== null) {
      console.log(dataTime);
      dispatch(setTime(dataTime));
    }
  }, [currentRequest, refresh]);
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

export const useGetNotificationRedIcon = () => {
  const { user } = useSelector((state) => state.user);
  const { refresh } = useSelector((state) => state.response);
  const dispatch = useDispatch();

  const getUnreadNotification = async () => {
    const unreadCount = await getUnreadIndieNotificationInboxCount(
      user?.id,
      2746,
      "33W2w1mWUguk3y6DPPFDWL"
    );

    return unreadCount;
  };

  useEffect(async () => {
    dispatch(setUnreadNotificationCount(await getUnreadNotification()));
  }, [refresh]);
};
