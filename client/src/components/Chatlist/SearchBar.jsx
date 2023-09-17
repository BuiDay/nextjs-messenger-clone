import React from "react";
import {BiSearchAlt2} from 'react-icons/bi'
import { BsFilter } from "react-icons/bs";

function SearchBar() {
  return (
    <div className="bg-search-input-container-background flex p-3 items-center gap-3 h-14">
        <div className="bg-panel-header-background flex items-center rounded-lg flex-grow overflow-hidden">
            <div className="p-2 cursor-pointer">
              <BiSearchAlt2 className="text-white text-2xl" title="Search"/>
            </div>
              <input type="text" placeholder="Search or start a new chat" className="bg-transparent w-full text-md focus:outline-none text-white"/>
        </div>
        <div className="pr-5 pl-3">
            <BsFilter className="text-panel-header-icon cursor-pointer text-xl" title="Filter"/>
        </div>
    </div>
  )
}

export default SearchBar;
