import React, { useCallback, useContext, useMemo } from 'react'
import ContElem from 'components/other/ContElem'
import { UserContext } from 'components/other/ElemBox'
import { Board, User } from 'types'
import { FunctionContext, SearchContext } from 'components/Table/Table'

const DragElem = () => {
  const { user, board }: { user: User, board: Board } = useContext(UserContext)
  const { onDragOver, onDrop, onDragStart } = useContext(FunctionContext)
  const searchText = useContext(SearchContext)

  const handleDropContext = useCallback((e) => {
    onDrop(e, board, user)
  }, [user, board, onDrop])

  const handleDragStartContext = useCallback((e) => {
    onDragStart(e, board, user)
  }, [user, board, onDragStart])

  const open = (searchText === '' || (`${user.name.first} ${user.name.last}`)
    .toLowerCase()
    .indexOf(searchText.toLowerCase()) !== -1)

  return useMemo(() => {
    return (
      <div
        className={`${open ? 'd-flex' : 'd-none'} w-100 drag-elem good-border`}
        onDragStart={handleDragStartContext}
        onDrop={handleDropContext}
        onDragOver={onDragOver}
        draggable={true}
      >
        <ContElem/>
      </div>
    )
  }, [handleDragStartContext, handleDropContext, onDragOver, open])
}

export default DragElem

