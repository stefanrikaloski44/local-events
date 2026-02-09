export type Event = {
  id: number
  title: string
  description: string
  date: string
  location: string
  category: string
  imageUrl?: string
  interestedCount: number
  goingCount: number
  myStatus?: 'INTERESTED' | 'GOING' | null
}

export type EventRequest = {
  title: string
  description: string
  date: string
  location: string
  category: string
  imageUrl?: string
}

export type User = {
  username: string
  role: 'ADMIN' | 'USER'
}
