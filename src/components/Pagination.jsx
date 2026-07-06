/**
 * Pagination component for large booking lists
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Booking list pagination"
      style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}
    >
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        ‹ Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onPageChange(page)}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next ›
      </button>
    </nav>
  );
}
