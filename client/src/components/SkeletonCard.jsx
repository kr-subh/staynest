export default function SkeletonCard() {
  return (
    <div className="card listing-card" aria-hidden="true">
      <div className="skeleton thumb" />
      <div className="card-body">
        <div className="row-between">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-rating" />
        </div>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-price" />
      </div>
    </div>
  );
}
