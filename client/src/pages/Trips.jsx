import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { formatDate, formatINR } from '../utils/format.js';

export default function Trips() {
  const location = useLocation();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [tripToCancel, setTripToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = () =>
    api
      .get('/bookings/mine')
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && tripToCancel && !cancelling) {
        setTripToCancel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tripToCancel, cancelling]);

  const confirmCancel = async (id) => {
    try {
      setCancelling(true);
      await api.patch(`/bookings/${id}/cancel`);
      setTripToCancel(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
      setTripToCancel(null);
    } finally {
      setCancelling(false);
    }
  };

  if (!bookings && !error) return <Loader />;

  return (
    <section>
      <h1>My Trips</h1>
      {location.state?.booked && <p className="success">Booking request sent to the host!</p>}
      {error && <p className="error">{error}</p>}
      {bookings?.length === 0 && (
        <p className="muted">No trips yet. <Link to="/">Find a stay</Link></p>
      )}
      <div className="trip-list">
        {bookings?.map((b) => (
          <div key={b._id} className="card trip">
            <img src={b.listing?.images?.[0]} alt={b.listing?.title} />
            <div className="grow">
              <Link to={`/stays/${b.listing?._id}`}><strong>{b.listing?.title}</strong></Link>
              <p className="muted">{b.listing?.city}</p>
              <p>
                {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.nights} night{b.nights > 1 ? 's' : ''} · {b.guests} guest{b.guests > 1 ? 's' : ''}
              </p>
            </div>
            <div className="trip-side">
              <span className={`status status-${b.status}`}>{b.status}</span>
              <strong>{formatINR(b.totalPrice)}</strong>
              {['pending', 'confirmed'].includes(b.status) && (
                <button className="btn btn-danger" onClick={() => setTripToCancel(b)}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tripToCancel && (
        <div className="modal-backdrop" onClick={() => !cancelling && setTripToCancel(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Trip</h3>
            <p>
              Are you sure you want to cancel your stay at{' '}
              <strong>{tripToCancel.listing?.title}</strong>?
            </p>
            <p className="muted small">
              {formatDate(tripToCancel.checkIn)} → {formatDate(tripToCancel.checkOut)} ·{' '}
              {tripToCancel.nights} night{tripToCancel.nights > 1 ? 's' : ''}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setTripToCancel(null)}
                disabled={cancelling}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => confirmCancel(tripToCancel._id)}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
