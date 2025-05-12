import { toast } from "react-toastify";

//Gestion des alertes
export function showToastMessage(message, type) {
  switch (type) {
    case "success":
      toast.success(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      break;
    case "update":
      toast.update(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      break;
    case "warn":
      toast.warn(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      break;
    case "error":
      toast.error(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      break;
    case "info":
      toast.info(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      break;
    case "loading":
      toast.loading(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      break;
    default:
      break;
  }
}
