import ElemBox from 'components/other/ElemBox'
import React from 'react'
import { Board, User } from 'types'

interface LeftPanelProps {
  board: Board,
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
  onDropBox: (e: React.DragEvent<HTMLDivElement>, board: Board) => void,
}

const LeftPanel = ({
  board,
  onDragOver,
  onDropBox,
}: LeftPanelProps) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDropBox(e, board)
  }

  return (
    <div
      key="box_container_1"
      className="w-100 good-border mt-0 flex-grow-1" //
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {
        board.panel.map(({ items, title }: { items: User[], title: string }) => {
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

export default LeftPanel
