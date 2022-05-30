import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FaTruckPickup, FaUser, FaWalking } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import NavbarComponent from "../components/common/navbar_component";
import { errorPopup } from "../components/common/response_component";
import SidebarComponent from "../components/common/sidebar_component";
import { DragableElements } from "../components/services_components";
import LatestCustomerTable from "../components/tables/latest_customer_table";
import { useGetPickupUpdate } from "../helpers/hooks/useStartDepHooks";
import {
  setPickUpData,
  setWalkInData,
} from "../redux/slice/service_product_slice";
import RequestService from "../services/request_service";

const sidebarItems = [
  {
    label: "Walk In",
    value: 1,
    icon: <FaWalking size={20} />,
  },
  {
    label: "Picp Up / Delivery",
    value: 2,
    icon: <FaTruckPickup size={20} />,
  },
  {
    label: "Client Records",
    value: 3,
    icon: <FaUser size={20} />,
  },
];

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const ServicesView = () => {
  const [page, setPage] = useState(1);
  return (
    <React.Fragment>
      <div className="flex flex-row">
        <div className="h-screen">
          <SidebarComponent item={sidebarItems} setItem={setPage} />
        </div>
        <div className="flex-grow">
          <NavbarComponent title="SERVICES" />
          <div className="mt-5 mx-5">
            <div>
              {page === 1 && <ServiceWalkin />}
              {page === 2 && <ServicePickup />}
              {page === 3 && <ServiceClientRecord />}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ServicesView;

const ServiceWalkin = () => {
  const tabList = [
    {
      label: "WALK-IN REQUESTS",
      value: "request",
    },
    {
      label: "CLEANING PROCESS",
      value: "clean",
    },
    {
      label: "DONE",
      value: "done",
    },
  ];
  const { user } = useSelector((state) => state.user);
  const { walk_in } = useSelector((state) => state.service_product);
  const { refresh } = useSelector((state) => state.response);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const listCopy = { ...walk_in?.data };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    if (
      result.source.droppableId === "request" &&
      result.destination.droppableId === "clean"
    ) {
      RequestService.requestTableModify(
        removedElement.id,
        result.destination.droppableId,
        true,
        user.id
      );
      return dispatch(setWalkInData(listCopy));
    }

    if (
      result.source.droppableId === "clean" &&
      result.destination.droppableId === "done"
    ) {
      RequestService.requestTableModify(
        removedElement.id,
        result.destination.droppableId,
        true,
        user.id
      );
      return dispatch(setWalkInData(listCopy));
    }

    if (user?.role === "admin") {
      if (
        result.source.droppableId === "clean" &&
        result.destination.droppableId === "request"
      ) {
        RequestService.requestTableModify(
          removedElement.id,
          result.destination.droppableId,
          true,
          user.id
        );
        return dispatch(setWalkInData(listCopy));
      }
      if (
        result.source.droppableId === "done" &&
        result.destination.droppableId === "clean"
      ) {
        RequestService.requestTableModify(
          removedElement.id,
          result.destination.droppableId,
          true,
          user.id
        );
        return dispatch(setWalkInData(listCopy));
      }
    }

    if (
      result.source.droppableId === "request" &&
      result.destination.droppableId === "done"
    ) {
      return errorPopup("Can't jump from request to done");
    }

    if (
      result.source.droppableId === "done" &&
      result.destination.droppableId === "request"
    ) {
      return errorPopup("Can't jump from done to request");
    }

    if (result.destination.droppableId === result.source.droppableId) {
      return dispatch(setWalkInData(listCopy));
    }

    errorPopup("Can't revert Item from previous state");
  };

  useEffect(() => {
    RequestService.readRequest()
      .then((value) => {
        dispatch(setWalkInData(value));
      })
      .catch((err) => {
        errorPopup(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row gap-8">
        {tabList.map((item) => {
          return (
            <DragableElements
              elements={walk_in?.data[item.value]}
              key={item.value}
              colTitle={item.label}
              colID={item.value}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

const ServicePickup = () => {
  const tabList = [
    {
      label: "PICK-UP REQUESTS",
      value: "request",
    },
    {
      label: "CLEANING PROCESS",
      value: "clean",
    },
    {
      label: "DONE",
      value: "done",
    },
  ];

  const { pick_up } = useSelector((state) => state.service_product);
  const { user } = useSelector((state) => state.user);
  const { refresh } = useSelector((state) => state.response);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const listCopy = { ...pick_up?.data };

    const sourceList = listCopy[result.source.droppableId];

    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );

    listCopy[result.source.droppableId] = newSourceList;

    const destinationList = listCopy[result.destination.droppableId];

    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    if (
      result.source.droppableId === "request" &&
      result.destination.droppableId === "clean"
    ) {
      RequestService.requestTableModify(
        removedElement.id,
        result.destination.droppableId,
        false,
        user.id
      );
      return dispatch(setPickUpData(listCopy));
    }

    if (
      result.source.droppableId === "clean" &&
      result.destination.droppableId === "done"
    ) {
      RequestService.requestTableModify(
        removedElement.id,
        result.destination.droppableId,
        false,
        user.id
      );
      return dispatch(setPickUpData(listCopy));
    }

    if (user?.role === "admin") {
      if (
        result.source.droppableId === "clean" &&
        result.destination.droppableId === "request"
      ) {
        RequestService.requestTableModify(
          removedElement.id,
          result.destination.droppableId,
          false,
          user.id
        );
        return dispatch(setPickUpData(listCopy));
      }
      if (
        result.source.droppableId === "done" &&
        result.destination.droppableId === "clean"
      ) {
        RequestService.requestTableModify(
          removedElement.id,
          result.destination.droppableId,
          false,
          user.id
        );
        return dispatch(setPickUpData(listCopy));
      }
    }

    if (
      result.source.droppableId === "request" &&
      result.destination.droppableId === "done"
    ) {
      return errorPopup("Can't jump from request to done");
    }

    if (
      result.source.droppableId === "done" &&
      result.destination.droppableId === "request"
    ) {
      return errorPopup("Can't jump from done to request");
    }

    if (result.destination.droppableId === result.source.droppableId) {
      return dispatch(setPickUpData(listCopy));
    }

    errorPopup("Can't revert Item from previous state");
  };

  useEffect(() => {
    RequestService.readRequest(false)
      .then((value) => {
        dispatch(setPickUpData(value));
      })
      .catch((err) => {
        errorPopup(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useGetPickupUpdate();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row gap-8">
        {tabList.map((item) => {
          return (
            <DragableElements
              elements={pick_up?.data[item.value]}
              key={item.value}
              colTitle={item.label}
              colID={item.value}
              is_walkin={false}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

const ServiceClientRecord = () => {
  return (
    <React.Fragment>
      <LatestCustomerTable />
    </React.Fragment>
  );
};
