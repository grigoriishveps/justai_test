import {Input} from "@material-ui/core";
import ElemBox from "./ElemBox";
import React from "react";
import {Panel, User} from "./types";

const LeftPanel = (props:any)=>{

    const {board} = props;
    return (
        <div className='w-100 good-border mt-0 flex-grow-1' //
             key='box_container_1'
             onDragOver={props.handleDragOver}
             onDrop={(e) => {
                 props.handleDropBox(e, board)
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
    )
}

export default LeftPanel;
