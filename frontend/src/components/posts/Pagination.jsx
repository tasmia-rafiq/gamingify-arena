const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const pageNumbers = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  const handlePrev = () => {
    if (!prevDisabled) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!nextDisabled) onPageChange(currentPage + 1);
  };

  return (
    <nav>
      <ul className="flex items-center justify-center pagination">
        <li className={prevDisabled ? "hidden" : ""}>
          <button
            onClick={handlePrev}
            disabled={prevDisabled}
            aria-label="Previous page"
            className="flex items-center gap-2 border-none text-xl font-normal hover:bg-transparent! hover:text-primary! p-0! mr-4"
          >
            ← PREV
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li key={number}>
            <button onClick={() => onPageChange(number)} aria-current={currentPage === number ? "page" : undefined} className={currentPage === number ? "bg-primary! text-bg!" : ""}>{number}</button>
          </li>
        ))}

        <li className={nextDisabled ? "hidden" : ""}>
          <button
            onClick={handleNext}
            disabled={nextDisabled}
            aria-label="Next page"
            className="flex items-center gap-2 border-none text-xl font-normal hover:bg-transparent! hover:text-primary! p-0! ml-4"
          >
            NEXT →
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
