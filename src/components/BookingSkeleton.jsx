/**
 * Skeleton loader cards — shown while bookings are being fetched.
 * Improves perceived performance vs a plain spinner.
 */
function SkeletonBox({ width = '100%', height = 16, style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, var(--color-800) 25%, var(--color-750) 50%, var(--color-800) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease infinite',
        borderRadius: 6,
        ...style,
      }}
    />
  );
}

export default function BookingSkeleton({ count = 6 }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div
        className="booking-grid"
        aria-label="Loading bookings"
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="booking-card" style={{ gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SkeletonBox height={18} width="60%" />
                <SkeletonBox height={13} width="45%" />
              </div>
              <SkeletonBox height={22} width={80} />
            </div>
            <SkeletonBox height={13} width="80%" />
            <SkeletonBox height={13} width="65%" />
            <SkeletonBox height={13} width="55%" />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <SkeletonBox height={28} width={64} />
              <SkeletonBox height={28} width={64} />
              <SkeletonBox height={28} width={64} style={{ marginLeft: 'auto' }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
