import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import '@material-ui/core/Input'
import { Input } from '@material-ui/core'
import RightPanel from 'components/panels/RightPanel'
import LeftPanel from 'components/panels/LeftPanel'
import { Board, User } from 'types'
import { sortUsers, splitArr } from 'components/Table/utils'

export const FunctionContext = React.createContext({
  onClick: (e: any, user: User) => {},
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => {},
  onDrop: (e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {},
  onDragStart: (e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {},
})

export const SearchContext = React.createContext('')

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault()
}

interface TableRef {
  currentBoard: Board | null,
  currentItem: User | null,
  boards: Board[],
}

const Table = () => {
  const [appReady, setAppReady] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [boards, setBoards] = useState<Board[]>([])
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [currentItem, setCurrentItem] = useState<User | null>(null)

  const ref = useRef<TableRef>({
    currentBoard,
    currentItem,
    boards
  })

  useEffect(() => {
    const inc = 'name,login,registered,id,email,picture'

    axios.get('https://randomuser.me/api/', { params: { results: 500, nat: 'us', inc } }).then(response => {
      setBoards([
        {
          id: 1,
          panel: splitArr(response.data.results.sort(sortUsers)),
        }, {
          id: 2,
          panel: [{ title: '', items: [] }],
        }])
      setAppReady(true)
    })
  }, [])

  useEffect(() => {
    ref.current = { currentBoard, currentItem, boards }
  })

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {
    setCurrentBoard(board)
    setCurrentItem(card)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, board: Board, card: User) => {
    e.preventDefault()
    const { boards, currentBoard, currentItem } = ref.current

    if (currentBoard === null || currentItem === null) {
      console.log('ошибка')
      return
    }

    const { age } = currentItem.registered
    const indexPanel = ~~((age - 1) / 10) // индекс панели в левой доске
    let items
    if (board.id === 1) {
      setCurrentItem(null)
      e.stopPropagation()

      return
    }

    items = currentBoard.panel[(currentBoard.id === 2) ? 0 : indexPanel].items
    const currentIndex = items.indexOf(currentItem)
    items.splice(currentIndex, 1)
    items = board.panel[0].items
    const dropIndex = items.indexOf(card)
    items.splice(dropIndex, 0, currentItem)
    setBoards([...boards])
    setCurrentItem(null)
    e.stopPropagation()
  }, [])

  const handleDropBox = useCallback((e: React.DragEvent<HTMLDivElement>, board: Board) => {
    const { boards, currentBoard, currentItem } = ref.current

    if (currentBoard === null || currentItem === null) {
      console.log('ошибка')
      return
    }

    if (board.id === 1) {
      setCurrentItem(null)
      return
    }

    const { age } = currentItem.registered
    const indexPanel = ~~((age - 1) / 10) // индекс панели в левой доске
    const currentIndex = currentBoard.panel[indexPanel].items.indexOf(currentItem)

    currentBoard.panel[indexPanel].items.splice(currentIndex, 1)
    board.panel[0].items.push(currentItem)

    setBoards([...boards])
    setCurrentItem(null)
  }, [])

  const handleClick = useCallback((e: any, elem: User) => {
    const { boards } = ref.current
    const { age } = elem.registered
    const indexPanel = ~~((age - 1) / 10)// индекс панели в левой доске
    const arr2 = boards[1].panel[0].items
    const currentIndex = arr2.indexOf(elem)
    arr2.splice(currentIndex, 1)

    boards[0].panel[indexPanel].items = [
      ...boards[0].panel[indexPanel].items,
      elem,
    ].sort(sortUsers)

    setBoards([...boards])
  }, [])

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }, [])

  return (
    <FunctionContext.Provider value={{
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onClick: handleClick,
      onDrop: handleDrop,
    }}>
      <SearchContext.Provider value={searchText}>
        {!appReady &&
          <svg className="spinner" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
          </svg>
        }
        {appReady &&
          <div className="card card-body main-wrapper">
            <div className="w-75 mt-3 d-flex flex-row good-border">
              <div className="col p-0 h-100 good-border d-flex flex-column">
                <div className="w-100 d-flex flex-row align-items-center good-border table-head">
                  <span className="d-inline mx-3"> Поиск </span>
                  <Input onChange={handleOnChange} value={searchText}/>
                </div>
                <LeftPanel
                  onDropBox={handleDropBox}
                  onDragOver={handleDragOver}
                  board={boards[0]}
                />
              </div>
              <div className="h-100 col p-0 good-border ml-0 d-flex flex-column">
                <div className="w-100 d-flex flex-row justify-content-center align-items-center good-border table-head">
                  Избранное
                </div>
                <RightPanel
                  board={boards[1]}
                  onDropBox={handleDropBox}
                  onDragOver={handleDragOver}
                  currentItem={currentItem}
                />
              </div>
            </div>
          </div>}
      </SearchContext.Provider>
    </FunctionContext.Provider>
  )
}

export default Table
