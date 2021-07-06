import React, {useState} from 'react';
import DragElem from "./DragElem";
import {Board, User} from "./types";

export const UserContext = React.createContext<{user:User, board:Board}>(
    {user: {
            picture: {thumbnail:''},
            name:{first:'', last:''},
            registered:{age:1, date:new Date},
            email:""
        }, board:{id:0, panel:[{title:"", items:[]}]
    }});


function ElemBox({users, board, title}: any) {

    // const [open, setOpen] = useState(false)
    const [open, setOpen] = useState(title==="")
    const empty = users.length === 0;
    return (<>
        {title && <div className='good-border' style={{height: "40px"}}>
            <button className={`btn w-100 text-left ${empty ? 'disabled' : ''}`} onClick={() => {
                if (!empty)
                    setOpen(!open)
            }}>{title}</button>
        </div>
        }
        <div className={`${(open && !empty) ? '' : 'd-none'} elem-box`}>
            {
                users.map((user: any) => {
                    return<UserContext.Provider value={{board, user}} key={user.login.uuid}> <DragElem/></UserContext.Provider>
                })
            }
        </div>
    </>)
}

export default ElemBox;
