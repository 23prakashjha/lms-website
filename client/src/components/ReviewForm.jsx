import { useState } from 'react'
import { Star } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReviewForm = ({ courseId, existingReview, onReviewSubmitted }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) {
      toast.error('Please select a rating')
      return
    }
    setSubmitting(true)
    try {
      if (existingReview) {
        await axios.put(`/api/courses/${courseId}/reviews/${existingReview._id}`, { rating, comment })
        toast.success('Review updated!')
      } else {
        await axios.post(`/api/courses/${courseId}/reviews`, { rating, comment })
        toast.success('Review submitted!')
      }
      onReviewSubmitted()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return
    try {
      await axios.delete(`/api/courses/${courseId}/reviews/${existingReview._id}`)
      toast.success('Review deleted')
      onReviewSubmitted()
    } catch (err) {
      toast.error('Failed to delete review')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">
        {existingReview ? 'Your Review' : 'Write a Review'}
      </h3>
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
          >
            <Star
              className={`h-7 w-7 ${
                star <= (hover || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this course..."
        className="input-field w-full mb-4"
        rows={3}
      />
      <div className="flex items-center space-x-3">
        <button
          type="submit"
          disabled={submitting || !rating}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}

export default ReviewForm
