import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import '@material-ui/core/Input'
import {Input} from "@material-ui/core";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import {Board, User} from "./types";

export const FunctionContext = React.createContext({
    handleClick: (e: any, user: User) => {},
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => {},
    handleDrop: (e: React.DragEvent<HTMLDivElement>, board: Board, card:User) => {},
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {},
});

export const SearchContext = React.createContext("")
function splitArr(users: User[]) {
    const res_arr: { title: string, items: User[] }[] = [
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
    const [boards, setBoards] = useState<Board[]>([])
    const [currentBoard, setCurrentBoard] = useState<Board|null>(null)
    const [currentItem, setCurrentItem] = useState<User|null>(null)
    const ref = useRef<{currentBoard:Board|null,currentItem:User|null, boards:Board[] }>({currentBoard, currentItem, boards})

    useEffect(() => {
        const inc = "name,login,registered,id,email,picture"
        axios.get('https://randomuser.me/api/', {params: {results: 2000, nat: 'us', inc}}).then(response => {
            setBoards([{id: 1, panel: splitArr(response.data.results.sort(sortUsers))}, {id: 2, panel: [{title:"", items:[]}]}])
            setAppReady(true);
        })
    }, []);

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
        const {boards, currentBoard, currentItem} = ref.current
        if (currentBoard ===null || currentItem === null){
            console.log("ошибка")
            return
        }
        const {age} = currentItem.registered;
        const indexPanel = ~~((age - 1) / 10) // индекс панели в левой доске
        let items;
        if (board.id === 1) {
            setCurrentItem(null);
            e.stopPropagation()
            return;
        }

        items = currentBoard.panel[(currentBoard.id === 2)?0:indexPanel].items
        const currentIndex = items.indexOf(currentItem)
        items.splice(currentIndex, 1);
        items = board.panel[0].items
        const dropIndex = items.indexOf(card)
        items.splice(dropIndex, 0, currentItem);
        setBoards([...boards])
        setCurrentItem(null);
        e.stopPropagation()
    }, [])

    const handleDropBox = useCallback((e: React.DragEvent<HTMLDivElement>, board: Board) => {
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
        const indexPanel = ~~((age - 1) / 10) // индекс панели в левой доске
        const currentIndex = currentBoard.panel[indexPanel].items.indexOf(currentItem)
        currentBoard.panel[indexPanel].items.splice(currentIndex,1);
        board.panel[0].items.push(currentItem)
        setBoards([...boards])
        setCurrentItem(null);
    }, [])

    const handleClick = useCallback((e: any, elem: User) => {
        const {boards} = ref.current
        const {age} = elem.registered;
        const indexPanel = ~~((age - 1) / 10);// индекс панели в левой доске
        const arr2 = boards[1].panel[0].items;
        const currentIndex = arr2.indexOf(elem);
        arr2.splice(currentIndex, 1)
        boards[0].panel[indexPanel].items = [...boards[0].panel[indexPanel].items, elem].sort(sortUsers)
        setBoards([...boards])

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
            <div className="card card-body main-wrapper">
                <div className='w-75 mt-3 d-flex flex-row good-border'>
                    <div className="col p-0 h-100 good-border d-flex flex-column">
                        <div className="w-100 d-flex flex-row align-items-center good-border table-head">
                            <span className="d-inline mx-3"> Поиск </span>
                            <Input onChange={handleOnChange} value={searchText}/>
                        </div>
                        <LeftPanel
                            handleDropBox={handleDropBox}
                            handleDragOver={handleDragOver}
                            board={boards[0]}
                        />
                    </div>
                    <div className="h-100 col p-0 good-border ml-0 d-flex flex-column">
                        <div className="w-100 d-flex flex-row justify-content-center align-items-center good-border table-head">
                            Избранное
                        </div>
                        <RightPanel
                            board={boards[1]}
                            handleDropBox={handleDropBox}
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
