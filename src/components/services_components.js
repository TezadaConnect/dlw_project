import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { MdAdd, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { creationTypeEnum } from "../helpers/constant";
import { setRefresh } from "../redux/slice/response_slice";
import { errorPopup, successPopup } from "./common/response_component";

import { AiFillEye } from "react-icons/ai";
import CreateRequestModal from "./modals/create_request_modal";
import UpdateStatusModal from "./modals/update_status_modal";

const MySwal = withReactContent(Swal);
const COLORS = {
  request: "bg-green-600",
  clean: "bg-blue-600",
  done: "bg-red-500",
};

export const DragableElements = ({
  colTitle,
  colID,
  elements,
  is_walkin = true,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white w-1/3 rounded border shadow-sm">
      <div
        className={`p-3 font-bold text-white rounded-t flex justify-between items-center cursor-default ${COLORS[colID]}`}
      >
        {colTitle}
        <div className="text-white hover:text-gray-300 active:translate-y-1 object-contain">
          {colID === "request" && is_walkin && (
            <MdAdd
              size={20}
              onClick={() =>
                addTodoModal(
                  () => dispatch(setRefresh()),
                  is_walkin,
                  creationTypeEnum.new,
                  null,
                  true
                )
              }
            />
          )}
        </div>
      </div>
      <Droppable droppableId={`${colID}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements?.map((item, index) => {
              return (
                <div key={item.id}>
                  <ItemCard
                    req_id={item.id}
                    item={item}
                    index={index}
                    table={colID}
                    is_walk={is_walkin}
                  />
                </div>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const addTodoModal = async (
  onClose = () => {},
  is_walk = true,
  type = creationTypeEnum.new,
  req_id,
  isAdmin = false
) => {
  MySwal.fire({
    width: "700px",
    html: (
      <CreateRequestModal
        type={type}
        is_walk={is_walk}
        req_id={req_id}
        isAdmin={isAdmin}
      />
    ),
    showCloseButton: true,
    showConfirmButton: false,
  }).then((result) => {
    if (result.isDenied) {
      errorPopup("Action Failed! Try again later.");
    }
    if (result.isConfirmed) {
      onClose();
      successPopup("Successfully added new Request");
    }
  });
};

const ItemCard = ({ item, index, is_walk = true, req_id }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const updateItem = (admin = false) => {
    addTodoModal(
      () => dispatch(setRefresh()),
      is_walk,
      creationTypeEnum.update,
      req_id,
      admin
    );
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            className="bg-white m-3 p-3 border shadow cursor-pointer rounded select-none"
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <p className="text-xl font-bold">Item: {item.id}</p>
            <div className="flex flex-row justify-between">
              <p className="text-gray-500">{item.content}</p>
              <div className="flex flex-row gap-2 items-center">
                <p
                  className="font-bold text-red-900 hover:text-red-600 active:translate-y-1"
                  onClick={() =>
                    updateStatus(
                      item.user_id,
                      req_id,
                      item.status,
                      is_walk,
                      user?.role === "admin",
                      () => dispatch(setRefresh())
                    )
                  }
                >
                  {item.status}
                </p>
                {user.role === "admin" ? (
                  <div
                    className=" hover:text-gray-700 cursor-pointer"
                    onClick={() => updateItem(true)}
                  >
                    <MdEdit size={25} />
                  </div>
                ) : (
                  <div
                    className=" hover:text-gray-700 cursor-pointer"
                    onClick={() => updateItem(false)}
                  >
                    <AiFillEye size={25} />
                  </div>
                )}
              </div>
            </div>
            <p className="text-green-500 font-bold">COST: ${item.price}</p>
          </div>
        );
      }}
    </Draggable>
  );
};

const updateStatus = (
  user_id,
  req_id,
  status,
  is_walk,
  isAdmin = false,
  callback = () => {}
) => {
  MySwal.fire({
    html: (
      <UpdateStatusModal
        user_id={user_id}
        id={req_id}
        value={status}
        is_walk={is_walk}
        isAdmin={isAdmin}
      />
    ),
    showConfirmButton: false,
    showCloseButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
      successPopup("Changes Saved!");
    }
    if (result.isDenied) {
      errorPopup("Failed to change, Try again later");
    }
  });
};
