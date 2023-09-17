import React from "react";

function Input({name,state,setState,label=false,onKeyDown}) {
  return (
    <div className="flex gap-1 flex-col">
      {
        label && (
          <label htmlFor={name} className="text-teal-light text-lg px-1">
              {name}
          </label>
         
        )
      }
      <div>
        <input 
          type="text" 
          name={name} 
          onKeyDown={onKeyDown}
          onChange={(e)=>setState(e.target.value)} 
          value={state}
          className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
        />
      </div>
    </div>
  )
}

export default Input;
