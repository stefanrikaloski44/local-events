import { useEffect, useState } from 'react'
import type { Event, EventRequest } from '../types'

type EventModalProps = {
  show: boolean
  onClose: () => void
  onSave: (event: EventRequest, imageFile?: File) => Promise<void>
  initialEvent?: Event | null
}

export default function EventModal({ show, onClose, onSave, initialEvent }: EventModalProps) {
  const [formData, setFormData] = useState<EventRequest>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Concert',
    imageUrl: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title,
        description: initialEvent.description,
        // convert ISO string to datetime-local compatible
        date: initialEvent.date.slice(0, 16),
        location: initialEvent.location,
        category: initialEvent.category,
        imageUrl: initialEvent.imageUrl,
      })
      setImagePreview(
        initialEvent.imageUrl ? `http://localhost:30080${initialEvent.imageUrl}` : null,
      )
      setImageFile(null)
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Concert',
        imageUrl: '',
      })
      setImageFile(null)
      setImagePreview(null)
    }
  }, [initialEvent, show])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSave(formData, imageFile || undefined)
      // Reset only when creating a new event; when editing, HomePage will close modal
    } catch (err: any) {
      setError(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Event</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    disabled={loading}
                  >
                    <option value="Concert">Concert</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Theater">Theater</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Event Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                        }}
                        className="rounded"
                      />
                    </div>
                  )}
                  <small className="text-muted">Optional. Max size: 5MB</small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
