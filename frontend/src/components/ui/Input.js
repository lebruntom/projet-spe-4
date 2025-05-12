import { IoMdLock, IoMdMail } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";

// UI input qui permet un style global sur les boutons si on l'appelle
// Cett input gère l'affichage d'icon
const Input = ({ error, icon, label, ...props }) => {
  return (
    <div className="min-h-[75px]">
      <label
        className={`text-[12px] text-gray-700 ${
          error && error.name && error.touched && "text-redFlag"
        }`}
      >
        {label}
      </label>
      <div className="relative flex align-center">
        <input
          {...props}
          className={`${
            icon && "pl-10"
          }  text-primary bg-transparent bg-blue border rounded-lg text-sm focus:ring-blue2 focus:border-blue2 focus:bg-secondary focus:outline-none block w-full p-2 ${
            (error && error.name && error.touched && "border-redFlag") ||
            "border-brown"
          } `}
        ></input>
        {icon && icon === "IoMdMail" && (
          <IoMdMail className="text-brown absolute left-[10px] top-[11px]" />
        )}
        {icon && icon === "IoMdLock" && (
          <IoMdLock className="text-brown absolute left-[10px] top-[11px]" />
        )}
      </div>
      {error && error.name && error.touched ? (
        <div className="text-redFlag text-xs flex justify-end  h-2 flex items-center mt-1">
          <PiWarningCircle className="mr-1" />
          {error.name}
        </div>
      ) : (
        <div className="h-2">&nbsp;</div>
      )}
    </div>
  );
};

export default Input;
