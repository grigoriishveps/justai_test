import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import DragElem from "./DragElem";
import ElemBox, {UserContext} from "./ElemBox";
import '@material-ui/core/Input'
import {Input} from "@material-ui/core";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import {Board, User} from "./types";

export const FunctionContext = React.createContext({
    handleClick: (e: any, user: object) => {},
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => {},
    handleDrop: (e: React.DragEvent<HTMLDivElement>, board: any, card: any) => {},
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, board: any, card: any) => {},
});

export const SearchContext = React.createContext("")
function splitArr(users: any) {
    const res_arr: { title: string, items: any[] }[] = [
        {title: "1-10", items: []},
        {title: "11-20", items: []},
        {title: "21-30", items: []},
        // {title: "31-40", items: []},
    ]
    let j = 0;
    for (let x of users) {
        if ((j + 1) * 10 < x.registered.age)
            j++;
        res_arr[j].items.push(x);
    }
    return res_arr
}

function Table(props: any) {
    const [appReady, setAppReady] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [boards, setBoards] = useState<Board[]>([
        {id: 1, panel: []}, {id: 2, panel: []}
    ])

    useEffect(() => {
        const inc = "name,login,registered,id,email,picture"
        axios.get('https://randomuser.me/api/', {params: {results: 50, nat: 'us', inc}}).then(response => {
            setBoards([{id: 1, panel: splitArr(response.data.results.sort(sortUsers))}, {id: 2, panel: [{title:"", items:[]}]}])
            setAppReady(true);
        })
    }, []);
    const [currentBoard, setCurrentBoard] = useState<Board|null>(null)
    const [currentItem, setCurrentItem] = useState<User|null>(null)

    const ref = useRef<{currentBoard:Board|null,currentItem:User|null, boards:Board[] }>({currentBoard, currentItem, boards})

    useEffect(() => {
        ref.current = {currentBoard, currentItem, boards}
    })

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {
        setCurrentBoard(board);
        setCurrentItem(card);
    }, [])

    const sortUsers = useCallback((a: User , b: User) => {
        if (a.registered.age > b.registered.age)
            return 1;
        if (a.registered.age < b.registered.age)
            return -1;
        return 0;
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {
        e.preventDefault();

        if (board.id === 1) {
            setCurrentItem(null);
            e.stopPropagation()
            return;
        }
        const {boards, currentBoard, currentItem} = ref.current
        const {age} = currentItem!.registered;
        let items;
        if (currentBoard ===null || currentItem === null){
            console.log("ошибка")
            return
        }

        if (currentBoard.id === 2) {
            items = currentBoard.panel[0].items
            const currentIndex = items.indexOf(currentItem)
            items.splice(currentIndex, 1);
        } else {
            items = currentBoard.panel[~~((age - 1) / 10)].items
            const currentIndex = items.indexOf(currentItem)
            currentBoard.panel[~~((age - 1) / 10)].items = items.filter((b: any, index: number) => {
                return currentIndex !== index;
            })
        }

        if (board.id === 2) {
            items = currentBoard.panel[0].items
            const dropIndex = items?.indexOf(card)
            items.splice(dropIndex, 0, currentItem);
        } else {
            items = board.panel[~~((age - 1) / 10)].items;
            const dropIndex = items.indexOf(card)
            items.splice(dropIndex, 0, currentItem);
            board.panel[0].items = [...items.sort(sortUsers)]
        }

        setBoards(boards.map(b => {
            if (b.id === board.id)
                return board;
            if (b.id === currentBoard.id)
                return currentBoard
            return b
        }))
        setCurrentItem(null);
        e.stopPropagation()
    }, [])

    const handleDropBox = useCallback((e: React.DragEvent<HTMLDivElement>, board: any) => {
        const {boards, currentBoard, currentItem} = ref.current
        if (currentBoard ===null || currentItem === null){
            console.log("ошибка")
            return
        }
        if (board.id === 1) {
            setCurrentItem(null);
            return;
        }
        const {age} = currentItem.registered;
        // board.panel[0].items.push(currentItem);
        const currentIndex = currentBoard.panel[~~((age - 1) / 10)].items.indexOf(currentItem)
        const indexPanel = ~~((age - 1) / 10)
        currentBoard.panel[indexPanel].items = currentBoard.panel[indexPanel].items.filter((b: User, index: number) => {
            return currentIndex !== index;
        })
        board.panel[0].items = [...board.panel[0].items, currentItem]
        // setBoards(boards.map(b => {
        //     if (b.id === board.id)
        //         return board;
        //     if (b.id === currentBoard.id)
        //         return currentBoard;
        //     return b
        // }))

        setBoards([{id: 1, panel: boards[0].panel.map((b, index) => {
                    if (index === indexPanel){
                        return {title: b.title, items: [...b.items]}
                    } else
                        return b
                }
                )
            }, {id: 2, panel: [{title:"", items:[...board.panel[0].items]}]}]
        )
        setCurrentItem(null);
    }, [])

    const handleClick = useCallback((e: any, elem: any) => {
        const {boards} = ref.current
        const {age} = elem.registered;
        const indexPanel = ~~((age - 1) / 10);
        const arr1: User[] = boards[0].panel[indexPanel].items;
        arr1.push(elem)
        const arr2 = boards[1].panel[0].items;
        const currentIndex = arr2.indexOf(elem);
        arr2.splice(currentIndex, 1)
        setBoards([{id: 1, panel: boards[0].panel.map((b, index) => {
                    if (index === indexPanel) {
                        return {title: b.title, items: arr1.sort(sortUsers)}
                    } else
                        return b
                }
                )
            }, {id: 2, panel: [{title:"", items:arr2}]}]
        )
    }, [])

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }, [])

    return (
        <FunctionContext.Provider value={{
            handleDragStart,
            handleDragOver,
            handleClick,
            handleDrop
        }}>
            <SearchContext.Provider value={searchText}>
            {!appReady && <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
            </svg>
            }
            {appReady &&
            <div className="card  card-body main-wrapper">
                <div className='w-75 mt-3 d-flex flex-row good-border'>
                    <LeftPanel
                        handleDropBox={handleDropBox}
                        handleOnChange={handleOnChange}
                        handleDragOver={handleDragOver}
                        currentItem={currentItem}
                        board={boards[0]}
                    />
                    <div className="h-100 col p-0 good-border ml-0 d-flex flex-column">
                        <RightPanel
                            board={boards[1]}
                            handleDropBox={handleDropBox}
                            handleOnChange={handleOnChange}
                            handleDragOver={handleDragOver}
                            currentItem={currentItem}
                        />
                    </div>
                </div>
            </div>}
            </SearchContext.Provider>
        </FunctionContext.Provider>
    )
}

export default Table;
