import React from 'react';
import Image from 'next/image';

const ReactionMenu = ({ reacttionMenuList,contextMenuCordinates,chatId }) => {
    const handle = (item) =>{

    }
    return (
        <div className='bg-gray-500 w-fit px-3 py-2 rounded-3xl absolute z-20' style={{top:contextMenuCordinates.y < 550 ? 40 : -50, left:contextMenuCordinates.x > 550 ? "" : 0}}>
            <div className='flex gap-2'>
                {
                    reacttionMenuList.map((item, index) => {
                        return (
                            <div key={index} className='cursor-pointer' onClick={()=>handle(item)}>
                                <Image src={item.img} alt='icon' width={30} height={30} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ReactionMenu;