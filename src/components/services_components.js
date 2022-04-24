import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { MdAdd } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateRequestModal from "./modals/create_request_modal";

const MySwal = withReactContent(Swal);
const COLORS = {
  request: "bg-green-600",
  clean: "bg-blue-600",
  done: "bg-red-500",
};

export const DragableElements = ({ colTitle, colID, elements }) => {
  return (
    <div className="bg-white w-1/3 rounded border shadow-sm">
      <div
        className={`p-3 font-bold text-white rounded-t flex justify-between items-center cursor-default ${COLORS[colID]}`}
      >
        {colTitle}
        <div className="text-white hover:text-gray-300 active:translate-y-1 object-contain">
          {colID === "request" && (
            <MdAdd size={20} onClick={() => addTodoModal()} />
          )}
        </div>
      </div>
      <Droppable droppableId={`${colID}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements?.map((item, index) => {
              return <ItemCard key={item.id} item={item} index={index} />;
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const addTodoModal = () => {
  MySwal.fire({
    width: "700px",
    html: <CreateRequestModal />,
    showCloseButton: true,
    showConfirmButton: false,
  });
};

const ItemCard = ({ item, index }) => {
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
              <p className="font-bold text-red-900 hover:text-red-600 active:translate-y-1">
                REJECT
              </p>
            </div>
            <p className="text-green-500 font-bold">COST: ${item.price}</p>
          </div>
        );
      }}
    </Draggable>
  );
};
