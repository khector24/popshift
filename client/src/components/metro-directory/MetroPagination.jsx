import "../../styles/components/metro-directory/MetroPagination.css";

export default function MetroPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <section className="metro-pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="metro-pagination__button"
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
        className="metro-pagination__button"
      >
        →
      </button>
    </section>
  );
}
