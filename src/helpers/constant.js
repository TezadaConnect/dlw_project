import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const creationTypeEnum = { new: "new", update: "update" };
export const roleTypeEnum = {
  client: "client",
  manager: "manager",
  employee: "employee",
  admin: "admin",
};
export const roleSelect = [
  { label: "Client", value: roleTypeEnum.client },
  { label: "Manager", value: roleTypeEnum.manager },
  { label: "Admin", value: roleTypeEnum.admin },
  { label: "Employee", value: roleTypeEnum.employee },
];

export const MySwal = withReactContent(Swal);