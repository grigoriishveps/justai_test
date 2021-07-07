import React, {useCallback, useContext, useMemo} from "react";
import {FunctionContext, SearchContext} from "./Table";
import ContElem from "./ContElem";
import {UserContext} from "./ElemBox";
import {Board, User} from "./types";

const DragElem = (props:any)=>{
    const {user, board}: {user: User, board: Board} = useContext(UserContext);
    const { handleDragOver, handleDrop,handleDragStart} = useContext(FunctionContext)
    const searchText = useContext(SearchContext)

    const handleDropContext = useCallback((e)=>{handleDrop(e, board, user)},[user,board, handleDrop]) ;
    const handleDragStartContext = useCallback((e)=>{handleDragStart(e, board, user)},[user,board,handleDragStart]) ;
    const open = (searchText === '' || (`${user.name.first} ${user.name.last}`).toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

    return useMemo(() => {
        return (
        <div className={`${open?"d-flex":"d-none"} w-100 drag-elem good-border`}
             onDragStart={handleDragStartContext}
             onDrop={handleDropContext}
             onDragOver={handleDragOver}
             draggable={true}
        >
            <ContElem/>
        </div>
        )
    },[handleDragStartContext, handleDropContext,handleDragOver,  open])
}

export default DragElem;

