import React, { useState } from 'react'
import DragElem from 'components/DragElem/DragElem'
import { Board, User } from 'types'

export const UserContext = React.createContext<{ user: User, board: Board }>(
  {
    user: {
      picture: { thumbnail: '' },
      name: { first: '', last: '' },
      registered: { age: 1, date: new Date() },
      email: '',
      login: { uuid: '' }
    }, board: {
      id: 0, panel: [{ title: '', items: [] }]
    }
  })


function ElemBox({ users, board, title }: { users: User[], board: Board, title: string }) {
  const [open, setOpen] = useState(title === '')
  const empty = users.length === 0

  const handleClick = () => {
    if (!empty) {
      setOpen(!open)
    }
  }

  return (<>
    {title &&
      <div className="good-border" style={{ height: '40px' }}>
        <button
          className={`btn w-100 text-left ${empty ? 'disabled' : ''}`}
          onClick={handleClick}
        >
          {title}
        </button>
      </div>
    }
    <div className={`${(open && !empty) ? '' : 'd-none'} elem-box`}>
      {
        users.map((user: User) => (
          <UserContext.Provider value={{ board, user }} key={user.login.uuid}>
            <DragElem/>
          </UserContext.Provider>
        ))
      }
    </div>
  </>)
}

export default ElemBox
