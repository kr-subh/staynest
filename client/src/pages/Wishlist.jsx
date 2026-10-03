import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Wishlist() {
  const [listings, setListings] = useState(null);
  const [error, setError] = useState('');

  const loadWishlist = () => {
    api
      .get('/auth/wishlist')
      .then(({ data }) => setListings(data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleWishlistToggle = (listingId, isWishlisted) => {
    if (!isWishlisted) {
      setListings((prev) => (prev ? prev.filter((item) => item._id !== listingId) : []));
    }
  };

  if (!listings && !error) return <Loader />;

  return (
    <section>
      <h1>My Wishlist</h1>
      {error && <p className="error">{error}</p>}
      {listings?.length === 0 && (
        <p className="muted">
          No saved stays yet. <Link to="/">Explore stays</Link>
        </p>
      )}
      <div className="grid">
        {listings?.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>
    </section>
  );
}
