import {Input} from "@material-ui/core";
import ElemBox from "./ElemBox";
import React from "react";
import {Panel} from "./types";

const LeftPanel = (props:any)=>{

    const {board} = props;
    return (<div className="col p-0 h-100 good-border d-flex flex-column">
        <div className="w-100 d-flex flex-row align-items-center good-border table-head">
            <span className="d-inline mx-3"> Поиск </span>
            <Input onChange={props.handleOnChange} value={props.searchText}/>
        </div>
        <div className='w-100 good-border mt-0 flex-grow-1' //
             key='box_container_1'
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
    </div>)
}

export default LeftPanel;
