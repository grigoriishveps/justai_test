import React, {useCallback, useContext, useMemo} from "react";
import {FunctionContext} from "./Table";
import {UserContext} from "./ElemBox";

const ContElem = () => {

    const {user, board} = useContext(UserContext);
    const {handleClick } = useContext(FunctionContext)
    const handleClickDelete = useCallback((e) => handleClick(e, user), [handleClick, user])
    return useMemo(() => {
        return (
            <>
                <div className="good-border" style={{width: "50px"}}>
                    <img src={user.picture.thumbnail} alt="" width={50}/>
                </div>
                <div className="flex-grow-1 good-border ml-0">
                    <div className="text-left pl-2 good-border flex-grow-1 ">
                        <span> {user.name.first}</span>
                        <span>&nbsp;</span>
                        <span> {user.name.last}, </span>
                        <span> {user.registered.age}, </span>
                        <span> {new Date(user.registered.date).toLocaleDateString('ru')}</span>
                    </div>
                    <div className="text-left pl-2 good-border flex-grow-1 mt-0">
                        {user.email}
                    </div>
                </div>
                {board.id === 2 && <div className="d-flex justify-content-center align-items-center good-border ml-0 "
                                       style={{width: "50px"}}>
                    <a href='javascript:void(0)' className="d-inline" onClick={handleClickDelete}>
                    {/*<a href='about:blank' className="d-inline" onClick={handleClickDelete}>*/}
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                             className="bi bi-trash" viewBox="0 0 16 16">
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </a>
                </div>}
            </>
        )
    }, [user, handleClickDelete])
}

export default React.memo(ContElem);

