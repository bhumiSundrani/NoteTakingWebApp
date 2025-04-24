import React from 'react'

function Button({type, text, bgColor, textColor, onClick, className}) {
  return (
    <div>
        <button
        type={type}
        className={`bg-white text-black rounded-lg font-semibold cursor-pointer outline-0 border-0 ${className} block ${bgColor} ${textColor}`}
        onClick={onClick}
        >{text}</button>
    </div>
  )
}

export default Button