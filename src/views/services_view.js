import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FaTruckPickup, FaWalking } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import NavbarComponent from "../components/common/navbar_component";
import SidebarComponent from "../components/common/sidebar_component";
import { DragableElements } from "../components/services_components";
import {
  setPickUpData,
  setWalkInData,
} from "../redux/slice/service_product_slice";

const sidebarItems = [
  {
    label: "Walk In",
    value: 1,
    icon: <FaWalking size={20} />,
  },
  {
    label: "Picp Up",
    value: 2,
    icon: <FaTruckPickup size={20} />,
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

  const { walk_in } = useSelector((state) => state.service_product);
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

    dispatch(setWalkInData(listCopy));
  };

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

    dispatch(setPickUpData(listCopy));
  };

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
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};
