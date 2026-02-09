import {useState, useEffect} from 'react'
import {useAuth} from '../context/AuthContext'
import {
    fetchEvents,
    markParticipation,
    removeParticipation,
    createEvent,
    deleteEvent,
    uploadImage,
    updateEvent,
} from '../api'
import type {Event, EventRequest} from '../types'
import EventModal from '../components/EventModal'

export default function HomePage() {
    const {user, logout, isAdmin} = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [filterCategory, setFilterCategory] = useState<string>('All')
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    useEffect(() => {
        loadEvents()
    }, [])

    const loadEvents = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await fetchEvents()
            setEvents(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load events')
        } finally {
            setLoading(false)
        }
    }

    const handleParticipation = async (
        eventId: number,
        status: 'INTERESTED' | 'GOING',
        currentEvent?: Event,
    ) => {
        if (!user) {
            setError('Please login to mark participation')
            return
        }

        try {
            setError('')
            const isAlreadySelected = currentEvent?.myStatus === status
            if (isAlreadySelected) {
                await removeParticipation(eventId)
            } else {
                await markParticipation(eventId, status)
            }
            await loadEvents()
        } catch (err: any) {
            setError(err.message || 'Failed to update participation')
        }
    }

    const handleSaveEvent = async (eventData: EventRequest, imageFile?: File) => {
        try {
            setError('')
            let imageUrl = eventData.imageUrl

            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
            }

            if (editingEvent) {
                await updateEvent(editingEvent.id, {...eventData, imageUrl})
            } else {
                await createEvent({...eventData, imageUrl})
            }
            setShowModal(false)
            setEditingEvent(null)
            await loadEvents()
        } catch (err: any) {
            setError(err.message || 'Failed to save event')
            throw err
        }
    }

    const handleDeleteEvent = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return

        try {
            setError('')
            await deleteEvent(id)
            await loadEvents()
        } catch (err: any) {
            setError(err.message || 'Failed to delete event')
        }
    }

    const filteredEvents =
        filterCategory === 'All'
            ? events
            : events.filter((e) => e.category === filterCategory)

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <span className="navbar-brand fw-bold">Local Events Explorer</span>
                    <div className="d-flex align-items-center gap-3">
                        {user && (
                            <>
                <span className="text-white">
                  Welcome, <strong>{user.username}</strong>
                    {isAdmin && (
                        <span className="badge bg-warning text-dark ms-2">Admin</span>
                    )}
                </span>
                                {isAdmin && (
                                    <button
                                        className="btn btn-light btn-sm"
                                        onClick={() => {
                                            setEditingEvent(null)
                                            setShowModal(true)
                                        }}
                                    >
                                        + Add Event
                                    </button>
                                )}
                                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="container py-5">
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                        />
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Upcoming Events</h1>
                    <div className="btn-group" role="group">
                        {['All', 'Concert', 'Exhibition', 'Theater'].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`btn btn-sm ${
                                    filterCategory === cat ? 'btn-primary' : 'btn-outline-primary'
                                }`}
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No events found.</p>
                        {isAdmin && (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setEditingEvent(null)
                                    setShowModal(true)
                                }}
                            >
                                Create Your First Event
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm">
                                    {event.imageUrl && (
                                        <img
                                            src={`http://localhost:8080${event.imageUrl}`}
                                            className="card-img-top"
                                            alt={event.title}
                                            style={{height: '200px', objectFit: 'cover'}}
                                            onError={(e) => {
                                                ;(e.target as HTMLImageElement).style.display = 'none'
                                            }}
                                        />
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{event.title}</h5>
                                            <span className="badge bg-primary">{event.category}</span>
                                        </div>
                                        <p className="text-muted small mb-2">
                                            📅 {new Date(event.date).toLocaleString()}
                                        </p>
                                        <p className="text-muted small mb-2">📍 {event.location}</p>
                                        <p className="card-text flex-grow-1">{event.description}</p>
                                        <div
                                            className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                                            <div className="d-flex flex-column gap-1">
                                                <div className="d-flex gap-2">
                          <span className="badge bg-success">
                            Interested: {event.interestedCount}
                          </span>
                                                    <span className="badge bg-info text-dark">
                            Going: {event.goingCount}
                          </span>
                                                </div>
                                                {user && event.myStatus && (
                                                    <span className="small">
                                                            You: {' '}
                                                        <strong
                                                            className={event.myStatus === 'INTERESTED' ? 'text-success' : 'text-primary'}>
                                                            {event.myStatus === 'INTERESTED' ? 'Interested' : 'Going'}
                                                        </strong>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {user && (
                                            <div className="btn-group w-100 mt-3" role="group">
                                                <button
                                                    className={`btn btn-sm ${
                                                        event.myStatus === 'INTERESTED'
                                                            ? 'btn-success'
                                                            : 'btn-outline-success'
                                                    }`}
                                                    title={event.myStatus === 'INTERESTED' ? 'Click again to remove' : 'Mark as interested'}
                                                    onClick={() => handleParticipation(event.id, 'INTERESTED', event)}
                                                >
                                                    {event.myStatus === 'INTERESTED' ? 'Interested ✅' : 'Interested'}
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${
                                                        event.myStatus === 'GOING'
                                                            ? 'btn-primary'
                                                            : 'btn-outline-primary'
                                                    }`}
                                                    title={event.myStatus === 'GOING' ? 'Click again to remove' : 'Mark as going'}
                                                    onClick={() => handleParticipation(event.id, 'GOING', event)}
                                                >
                                                    {event.myStatus === 'GOING' ? 'Going ✅' : 'Going'}
                                                </button>
                                            </div>
                                        )}
                                        {isAdmin && (
                                            <div className="d-flex gap-2 mt-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary flex-grow-1"
                                                    onClick={() => {
                                                        setEditingEvent(event)
                                                        setShowModal(true)
                                                    }}
                                                >
                                                    Edit Event
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isAdmin && (
                <EventModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                        setEditingEvent(null)
                    }}
                    onSave={handleSaveEvent}
                    initialEvent={editingEvent}
                />
            )}
        </div>
    )
}
