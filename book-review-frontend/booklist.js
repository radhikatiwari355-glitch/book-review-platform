import { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get('/books').then(res => setBooks(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Book List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map(book => (
          <Link key={book._id} to={`/books/${book._id}`} className="border p-4 rounded shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
