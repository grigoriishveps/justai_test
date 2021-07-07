import ElemBox from "./ElemBox";
import React from "react";
import {Panel, User} from "./types";

const RightPanel = (props:any)=>{
    const {board, handleDragOver, currentItem,handleDropBox} = props;
    return(<>

        <div
            className={`w-100 h-auto good-border mt-0 flex-grow-1 pb-4 ${(currentItem) ? "bg-right" : ""} `}
            key='box_container_2'
            onDragOver={handleDragOver}
            onDrop={(e) => {
                handleDropBox(e, board)
            }}
        >
            {
                board.panel.map(({items, title}:{items:User[], title:string}) => {
                    return <ElemBox
                        key={`panel${title}`}
                        title={title}
                        board={board}
                        users={items}
                    />
                })
            }
        </div>
    </>)
}

export default RightPanel
