import ElemBox, {UserContext} from "./ElemBox";
import React from "react";
import {Panel} from "./types";

const RightPanel = (props:any)=>{
    const {board} = props;
    return(<>
        <div
            className="w-100 d-flex flex-row justify-content-center align-items-center good-border table-head">
            Избранное
        </div>
        <div
            className={`w-100 h-auto good-border mt-0 flex-grow-1 pb-4 ${(props.currentItem) ? "bg-right" : ""} `}
            key='box_container_2'
            onDragOver={props.handleDragOver}
            onDrop={(e) => {
                props.handleDropBox(e, board)
            }}
        >
            {
                board.panel.map(({items, title}:{items:Panel[], title:number}) => {
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
