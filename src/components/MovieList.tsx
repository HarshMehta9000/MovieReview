import React, { useState, useEffect, useRef } from "react";
import { Movie } from "../types/movies"; // Make sure this path is correct
import { movies } from "../data/moviedata_with_directors";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 25;

export const MovieList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Remove or keep the setter if you plan to use it
  const [directorFilter] = useState<string>("All");
  // const [directorFilter, setDirectorFilter] = useState<string>("All");

  const [showTopRated] = useState<boolean>(false);
  // const [showTopRated, setShowTopRated] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isGenreDropdownOpen, setGenreDropdownOpen] = useState<boolean>(false);

  const [expandedMovie, setExpandedMovie] = useState<number | null>(null);

  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const missingMoviesRef = useRef<{ id: number; title?: string }[]>([]);

  const allGenres = Array.from(new Set(movies.flatMap((m) => m.genres || [])));
  const totalMovies = movies.length;
  const expectedTotalMovies = 667;

  // Verify dataset
  useEffect(() => {
    if (!movies || movies.length === 0) {
      console.error("Error: The movie dataset is empty or not loaded.");
    }
  }, []);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setGenreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Log missing movies once
  useEffect(() => {
    if (!missingMoviesRef.current.length && totalMovies < expectedTotalMovies) {
      const missingIDs = Array.from({ length: expectedTotalMovies }, (_, i) => i + 1).filter(
        (id) => !movies.some((movie) => movie.id === id)
      );
      missingMoviesRef.current = missingIDs.map((id) => ({
        id,
        title: movies.find((m) => m.id === id)?.title || "Unknown",
      }));
      console.error(
        `Critical Error: Expected ${expectedTotalMovies} movies, found ${totalMovies}. 
         Missing ${expectedTotalMovies - totalMovies} entries.`,
        missingMoviesRef.current
      );
    }
  }, [totalMovies]);

  // Filter movies based on user inputs
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenres =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => movie.genres?.includes(genre));

    const matchesDirector =
      directorFilter === "All" || movie.director === directorFilter;

    const matchesTopRated =
      !showTopRated ||
      (movie.ratings?.imdb && movie.ratings?.imdb >= 8.5) ||
      (movie.ratings?.rottenTomatoes && movie.ratings?.rottenTomatoes >= 90);

    return matchesSearch && matchesGenres && matchesDirector && matchesTopRated;
  });

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredMovies.length);
  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
    setGenreDropdownOpen(false);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleExpandMovie = (movieId: number) => {
    setExpandedMovie((prev) => (prev === movieId ? null : movieId));
  };

  return (
    <div
      style={{
        padding: "20px",
        color: isDarkMode ? "#fff" : "#000",
        backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
      }}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: isDarkMode ? "#fff" : "#333",
          color: isDarkMode ? "#333" : "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by title or director..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            color: isDarkMode ? "#000" : "#333",
            backgroundColor: isDarkMode ? "#fff" : "#ddd",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <div ref={genreDropdownRef} style={{ position: "relative", flex: 1 }}>
          <button
            onClick={() => setGenreDropdownOpen(!isGenreDropdownOpen)}
            style={{
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Select Genres
          </button>
          {isGenreDropdownOpen && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {allGenres.map((genre) => (
                <label key={genre} style={{ marginBottom: "5px" }}>
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                    style={{ marginRight: "10px" }}
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <p style={{ marginBottom: "20px", fontStyle: "italic" }}>
        Showing {filteredMovies.length} movies (Out of {totalMovies}). Missing Data:{" "}
        {expectedTotalMovies - totalMovies} entries.
      </p>

      <div>
        {currentMovies.map((movie: Movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            <h2 onClick={() => handleExpandMovie(movie.id)}>
              {movie.title || "Untitled Movie"} ({movie.year || "Unknown Year"})
            </h2>
            {expandedMovie === movie.id && (
              <>
                <p>
                  <strong>Director:</strong> {movie.director || "Unknown"}
                </p>
                <p>
                  <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Ratings:</strong> IMDb: {movie.ratings?.imdb || "N/A"},{" "}
                  RT: {movie.ratings?.rottenTomatoes || "N/A"},{" "}
                  Metascore: {movie.ratings?.metascore || "N/A"}
                </p>
                <p>{movie.summary || "No summary available."}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
