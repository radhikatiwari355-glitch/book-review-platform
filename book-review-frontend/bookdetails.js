// src/pages/BookDetails.js

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function BookDetails() {
  const { id } = useParams(); // bookId from URL
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: '', comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch book + reviews on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data.book);
        setReviews(res.data.reviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to load book.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating || !form.comment) {
      alert('Please fill all fields');
      return;
    }

    try {
      await API.post('/reviews', {
        bookId: id,
        rating: parseInt(form.rating),
        comment: form.comment,
      });
      // Refresh reviews after submitting
      const res = await API.get(`/books/${id}`);
      setReviews(res.data.reviews);
      setForm({ rating: '', comment: '' });
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-lg text-gray-700 mb-1">By {book.author}</p>
      <p className="mb-4 text-gray-600">{book.description}</p>

      <hr className="my-4" />

      <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review._id} className="border p-3 rounded">
              <p className="font-semibold">{review.userId?.name || 'User'}</p>
              <p className="text-yellow-600">⭐ {review.rating}/5</p>
              <p className="text-gray-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Show review form only if logged in */}
      {token && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Add a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 && 's'}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Your review..."
              className="border p-2 rounded w-full"
              rows="4"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
            ></textarea>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Submit Review
            </button>
          </form>
        </div>
      )}

      {!token && (
        <p className="mt-4 text-sm text-gray-500 italic">
          * Login to add a review.
        </p>
      )}
    </div>
  );
}
