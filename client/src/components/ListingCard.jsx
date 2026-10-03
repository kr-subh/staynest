import { Link, useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListingCard({ listing, onWishlistToggle }) {
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(listing._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await toggleWishlist(listing._id);
      if (onWishlistToggle) {
        onWishlistToggle(listing._id, res?.isWishlisted);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  return (
    <Link to={`/stays/${listing._id}`} className="card listing-card">
      <div className="listing-card-media">
        <img src={listing.images?.[0] || 'https://placehold.co/800x500?text=StayNest'} alt={listing.title} />
        <button
          type="button"
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>
      <div className="card-body">
        <div className="row-between">
          <span className="tag">{listing.type}</span>
          <span className="muted">
            {listing.reviewCount > 0 ? `★ ${listing.avgRating} (${listing.reviewCount})` : 'New'}
          </span>
        </div>
        <strong className="listing-title">{listing.title}</strong>
        <span className="muted">{listing.city}, {listing.state}</span>
        <span>
          <strong>{formatINR(listing.pricePerNight)}</strong> <span className="muted">/ night</span>
        </span>
      </div>
    </Link>
  );
}
