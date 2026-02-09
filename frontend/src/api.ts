import type {Event, EventRequest} from './types'

const API_BASE = 'http://localhost:8080'

const getAuthHeader = (): Record<string, string> => {
    const auth = localStorage.getItem('auth')
    return auth ? {Authorization: `Basic ${auth}`} : {}
}

export const fetchEvents = async (): Promise<Event[]> => {
    // const response = await fetch(`${API_BASE}/events`)
    const headers: HeadersInit = {...getAuthHeader()}
    const response = await fetch(`${API_BASE}/events`, { headers })
    if (!response.ok) throw new Error('Failed to fetch events')
    return response.json()
}
export const removeParticipation = async (eventId: number): Promise<void> => {
    const headers: HeadersInit = {...getAuthHeader()}

    const response = await fetch(`${API_BASE}/events/${eventId}/participation`, {
        method: 'DELETE',
        headers,
    })
    if (!response.ok) throw new Error('Failed to remove participation');
}

export const createEvent = async (event: EventRequest): Promise<Event> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
    }

    const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            ...event,
            date: new Date(event.date).toISOString(),
        }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to create event')
    }
    return response.json()
}

export const deleteEvent = async (id: number): Promise<void> => {
    const headers: HeadersInit = {...getAuthHeader()}

    const response = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
        headers,
    })
    if (!response.ok) throw new Error('Failed to delete event')
}

export const updateEvent = async (id: number, event: EventRequest): Promise<Event> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
    }

    const response = await fetch(`${API_BASE}/events/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            ...event,
            date: new Date(event.date).toISOString(),
        }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to update event')
    }
    return response.json()
}

export const markParticipation = async (
    eventId: number,
    status: 'INTERESTED' | 'GOING',
): Promise<void> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
    }

    const response = await fetch(`${API_BASE}/events/${eventId}/participation`, {
        method: 'POST',
        headers,
        body: JSON.stringify({status}),
    })
    if (!response.ok) throw new Error('Failed to mark participation')
}

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const headers: HeadersInit = {
        ...getAuthHeader(),
        // no Content-Type here; browser sets correct multipart boundary
    }

    const response = await fetch(`${API_BASE}/api/upload/image`, {
        method: 'POST',
        headers,
        body: formData,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to upload image')
    }

    const data = await response.json()
    return data.imageUrl
}
