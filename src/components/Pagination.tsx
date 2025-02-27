import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = (): (number | string)[] => {
    const delta = 2;

    // range = array of pages (numbers)
    const range: number[] = [];

    // rangeWithDots = array of numbers or '...'
    const rangeWithDots: (number | string)[] = [];

    // l is the last page number we added (starts undefined)
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-3">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={classNames(
          "p-2 rounded-lg transition-colors duration-300",
          "hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-silver-500"
        )}
      >
        <span className="text-silver-300 text-sm">First</span>
      </button>

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={classNames(
          "p-2 rounded-lg transition-colors duration-300",
          "hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-silver-500"
        )}
      >
        <ChevronLeftIcon className="w-5 h-5 text-silver-300" />
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="text-silver-500 px-2">...</span>
          ) : (
            <button
              onClick={() => onPageChange(Number(page))}
              className={classNames(
                "w-10 h-10 rounded-lg font-mono text-sm transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-silver-500",
                currentPage === page
                  ? "bg-silver-700 text-silver-100"
                  : "text-silver-400 hover:bg-noir-800"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={classNames(
          "p-2 rounded-lg transition-colors duration-300",
          "hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-silver-500"
        )}
      >
        <ChevronRightIcon className="w-5 h-5 text-silver-300" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={classNames(
          "p-2 rounded-lg transition-colors duration-300",
          "hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-silver-500"
        )}
      >
        <span className="text-silver-300 text-sm">Last</span>
      </button>
    </div>
  );
};
