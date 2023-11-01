import React from "react";
import Image from "next/image";

function Empty() {
  return (
    <div className="md:flex hidden border-conversation-border border-l w-full bg-panel-header-background flex-col justify-center items-center h-[100vh] border-b-icon-green border-b-4 ">
      <Image src="/favicon1.png" alt="whatsapp" height={300} width={300}/>
    </div>
  )
}

export default Empty;
