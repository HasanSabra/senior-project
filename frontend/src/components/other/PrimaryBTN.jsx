import React from "react";

const PrimaryBTN = ({ text, onClickFunc, disabled, type = "button" }) => {
  const handleClick = (e) => {
    if (!disabled && onClickFunc) {
      onClickFunc(e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      disabled={disabled}
      className={`
        bg-[#6C2BD9] 
        rounded-lg 
        px-4 
        py-2 
        font-medium
        text-white
        border-none
        outline-none
        focus:ring-2 
        focus:ring-[#9D5CFF] 
        focus:ring-offset-2
        transition-all 
        duration-200
        hover:bg-[#9D5CFF] 
        active:bg-[#5A1FB8]
        disabled:opacity-50 
        disabled:cursor-not-allowed
        disabled:hover:bg-[#6C2BD9]
        min-w-[100px]
        select-none
        cursor-pointer
      `}
      aria-disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PrimaryBTN;
