interface User {
  picture: { thumbnail: string },
  name: { first: string, last: string },
  registered: { age: number, date: Date },
  email: string,
  login: { uuid: string }
}

interface Panel {
  title: string,
  items: User[]
}

interface Board {
  id: number,
  panel: Panel[],
}

export type { User, Panel, Board }
