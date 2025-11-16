import React from "react";

const ListingCard = ({ img, imgAlt, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='
        group
        flex 
        flex-col 
        gap-4 
        bg-[#2A2A2A] 
        p-6 
        rounded-2xl 
        w-96
        border 
        border-[#333333]
        hover:border-[#9D5CFF]
        hover:drop-shadow-[0_0_20px_rgba(157,92,255,0.3)]
        drop-shadow-[0_0_10px_rgba(108,43,217,0.2)]
        hover:scale-[1.02] 
        transition-all 
        duration-300 
        cursor-pointer
        relative
        overflow-hidden
      '
    >
      {/* Background Glow Effect */}
      <div
        className='
        absolute 
        inset-0 
        bg-linear-to-br 
        from-transparent 
        via-transparent 
        to-[#6C2BD9]/10 
        group-hover:to-[#9D5CFF]/20 
        transition-all 
        duration-500
      '
      />

      {/* Icon Container */}
      <div
        className='
        flex 
        items-center 
        justify-center 
        w-12 
        h-12 
        bg-[#1A1A1A] 
        rounded-xl 
        border 
        border-[#333333]
        group-hover:border-[#9D5CFF]
        group-hover:bg-[#6C2BD9]/10
        transition-all 
        duration-300
        relative
        z-10
      '
      >
        <img
          src={img}
          alt={imgAlt}
          className='w-6 h-6 object-contain filter brightness-0 invert'
        />
      </div>

      {/* Content */}
      <div className='flex flex-col gap-3 relative z-10'>
        <h1
          className='
          font-bold 
          text-2xl 
          text-white
          group-hover:text-[#CCCCCC]
          transition-colors 
          duration-300
        '
        >
          {title}
        </h1>

        <p
          className='
          text-[#888888] 
          text-[1rem] 
          leading-relaxed
          group-hover:text-[#AAAAAA]
          transition-colors 
          duration-300
        '
        >
          {description}
        </p>
      </div>

      {/* Hover Indicator */}
      <div
        className='
        absolute 
        bottom-0 
        left-0 
        w-0 
        h-1 
        bg-linear-to-r 
        from-[#6C2BD9] 
        to-[#9D5CFF]
        group-hover:w-full
        transition-all 
        duration-300
      '
      />
    </div>
  );
};

export default ListingCard;
