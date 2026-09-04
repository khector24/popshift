import "../../styles/components/city-directory/CityPagination.css";

export default function CityPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <section className="city-pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="city-pagination__button"
        aria-label="Previous page"
      >
        ←
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="city-pagination__button"
        aria-label="Next page"
      >
        →
      </button>
    </section>
  );
}
