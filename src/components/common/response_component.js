import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MYSWAL = withReactContent(Swal);

export const errorPopup = (message, title = "Fail") => {
  MYSWAL.fire({
    title: title,
    text: message,
    icon: "error",
    confirmButtonColor: "#d9534f",
  });
};

export const successPopup = (message, title = "Success") => {
  MYSWAL.fire({
    title: title,
    text: message,
    icon: "success",
    confirmButtonColor: "#5cb85c",
  });
};
