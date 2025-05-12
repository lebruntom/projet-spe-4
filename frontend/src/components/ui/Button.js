// UI button qui permet un style global sur les boutons si on l'appelle
const Button = ({ ...props }) => {
  return (
    <button
      {...props}
      className={`${
        props.disabled && "opacity-75"
      } border border-gray-500  rounded-lg py-2 px-4 cursor-pointer transition duration-200 hover:bg-gray-100 text-sm flex items-center`}
    />
  );
};

export default Button;
