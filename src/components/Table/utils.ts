import { User } from 'types'

export const sortUsers = (a: User, b: User) => {
  if (a.registered.age > b.registered.age)
    return 1
  if (a.registered.age < b.registered.age)
    return -1
  return 0
}

export const splitArr = (users: User[]) => {
  const res_arr: { title: string, items: User[] }[] = [
    { title: '1-10', items: [] },
    { title: '11-20', items: [] },
    { title: '21-30', items: [] },
  ]

  let j = 0

  for (let x of users) {
    if ((j + 1) * 10 < x.registered.age)
      j++
    res_arr[j].items.push(x)
  }
  return res_arr
}

