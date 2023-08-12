import PropTypes from "prop-types"; // Importă modulul PropTypes

const Button = ({
  text,
  onClick,
  bgColor = "bg-sky-600",
  hoverBgColor = "hover:bg-sky-700",
  color = "text-white",
}) => {
  return (
    <button
      className={`${bgColor} ${color} ${hoverBgColor} rounded-md py-2 px-4 uppercase transition duration-100 ease-in`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

// Definim tipurile așteptate pentru fiecare prop
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  hoverBgColor: PropTypes.string,
  color: PropTypes.string,
};

export default Button;
