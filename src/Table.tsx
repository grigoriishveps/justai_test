import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import DragElem from "./DragElem";
import ElemBox, {UserContext} from "./ElemBox";
import '@material-ui/core/Input'
import {Input} from "@material-ui/core";

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
        {title: "31-40", items: []},
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
    const [boards, setBoards] = useState([
        {id: 1, items: []}, {id: 2, items: []}
    ])

    useEffect(() => {
        const inc = "name,login,registered,id,email,picture"
        axios.get('https://randomuser.me/api/', {params: {results: 5000, nat: 'us', inc}}).then(response => {
            // @ts-ignore
            setBoards([{id: 1, items: splitArr(response.data.results.sort(sortUsers))}, {id: 2, items: []}])
            setAppReady(true);
        })
    }, []);
    const [currentBoard, setCurrentBoard]: [currentBoard: any, setCurrentBoard: (elem: any) => void] = useState({})
    const [currentItem, setCurrentItem]: [currentItem: any, setCurrentItem: (elem: any) => void] = useState(null)

    const ref = useRef({currentBoard, currentItem, boards})

    useEffect(() => {
        ref.current = {currentBoard, currentItem, boards}
    })

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, board: any, card: any) => {
        setCurrentBoard(board);
        setCurrentItem(card);
    }, [])

    const sortUsers = useCallback((a: { registered: { age: number } }, b: { registered: { age: number } }) => {
        if (a.registered.age > b.registered.age)
            return 1;
        if (a.registered.age < b.registered.age)
            return -1;
        return 0;
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, board: any, card: any) => {
        e.preventDefault();
        if (board.id === 1) {
            setCurrentItem(null);
            e.stopPropagation()
            return;
        }

        const {boards, currentBoard, currentItem} = ref.current
        const {age} = currentItem.registered;
        let items;

        if (currentBoard.id === 2) {
            items = currentBoard.items
            const currentIndex = items.indexOf(currentItem)
            items.splice(currentIndex, 1);
        } else {
            items = currentBoard.items[~~((age - 1) / 10)].items
            const currentIndex = items.indexOf(currentItem)
            currentBoard.items[~~((age - 1) / 10)].items = items.filter((b: any, index: number) => {
                return currentIndex !== index;
            })
        }
        // @ts-ignore
        if (board.id === 2) {
            const dropIndex = board.items.indexOf(card)
            board.items.splice(dropIndex, 0, currentItem);
        } else {
            items = board.items[~~((age - 1) / 10)].items;
            const dropIndex = items.indexOf(card)
            items.splice(dropIndex, 0, currentItem);
            board.items = [items.sort(sortUsers)]
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
        if (board.id === 1) {
            setCurrentItem(null);
            return;
        }
        const {age} = currentItem.registered;
        board.items.push(currentItem);
        const currentIndex = currentBoard.items[~~((age - 1) / 10)].items.indexOf(currentItem)
        currentBoard.items[~~((age - 1) / 10)].items = currentBoard.items[~~((age - 1) / 10)].items.filter((b: number, index: number) => {
            return currentIndex !== index;
        })
        setBoards(boards.map(b => {
            if (b.id === board.id)
                return board;
            // @ts-ignore
            if (b.id === currentBoard.id)
                return currentBoard;
            return b
        }))
        setCurrentItem(null);
    }, [])

    const handleClick = useCallback((e: any, elem: any) => {
        const {boards} = ref.current
        const {age} = elem.registered;
        // @ts-ignore
        const arr1: object[] = boards[0].items[~~((age - 1) / 10)].items;
        arr1.push(elem)
        // @ts-ignore
        const arr2 = boards[1].items;
        // @ts-ignore
        const currentIndex = arr2.indexOf(elem);
        arr2.splice(currentIndex, 1)
        // @ts-ignore
        setBoards([{id: 1, items: boards[0].items.map((b, index) => {
                    // @ts-ignore
                    if (index === (~~((age - 1) / 10))) { // @ts-ignore
                        return {title: b.title, items: arr1.sort(sortUsers)}
                    } else
                        return b
                }
                )
            }, {id: 2, items: arr2}]
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
                    <div className="col p-0 h-100 good-border d-flex flex-column">
                        <div className="w-100 d-flex flex-row align-items-center good-border table-head">
                            <span className="d-inline mx-3"> Поиск </span>
                            <Input onChange={handleOnChange} value={searchText}/>
                        </div>
                        <div className='w-100 good-border mt-0 flex-grow-1' //
                             key='box_container_1'
                             onDragOver={handleDragOver}
                             onDrop={(e) => {
                                 handleDropBox(e, boards[0])
                             }}
                        >
                            {
                                boards[0].items.map(({items, title}) => {
                                    return <ElemBox
                                        key={title}
                                        title={title}
                                        board={boards[0]}
                                        users={items}
                                    />
                                })
                            }
                        </div>
                    </div>
                    <div className="h-100 col p-0 good-border ml-0 d-flex flex-column">
                        <div
                            className="w-100 d-flex flex-row justify-content-center align-items-center good-border table-head">
                            Избранное
                        </div>
                        <div
                            className={`w-100 h-auto good-border mt-0 flex-grow-1 ${(currentItem) ? "bg-right" : ""} `}
                            key='box_container_2'
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                                handleDropBox(e, boards[1])
                            }}
                        >
                            {
                                boards[1].items.map((user: any) => {
                                    return <UserContext.Provider value={{board: boards[1], user}} key={user.login.uuid}>
                                        <DragElem/>
                                    </UserContext.Provider>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>}
            </SearchContext.Provider>
        </FunctionContext.Provider>
    )
}

export default Table;
