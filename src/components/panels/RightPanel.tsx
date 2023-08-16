import ElemBox from 'components/other/ElemBox'
import React from 'react'
import { Board, User } from 'types'

interface RightPanelProps {
  board: Board,
  currentItem: User | null,
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
  onDropBox: (e: React.DragEvent<HTMLDivElement>, board: Board) => void
}

const RightPanel = ({
  board,
  onDragOver,
  currentItem,
  onDropBox,
}: RightPanelProps) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDropBox(e, board)
  }

  return (
    <div
      className={`w-100 h-auto good-border mt-0 flex-grow-1 pb-4 ${(currentItem) ? 'bg-right' : ''} `}
      key="box_container_2"
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {
        board.panel.map(({items, title}: { items: User[], title: string }) => {
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

export default RightPanel
