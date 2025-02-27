import React, { useState } from 'react';
import { FilmIcon, ChevronDownIcon, ChevronUpIcon,} from '@heroicons/react/24/outline';
import type { Movie } from '../types/movies';
import classNames from 'classnames';

interface MovieCardProps {
  movie: Movie;
  index: number;
  pageIndex: number; // Added for pagination-based numbering
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index, pageIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRatingColor = (score: number | null, type: 'imdb' | 'rt' | 'meta') => {
    if (score === null || score === undefined) return 'text-gray-500'; // For missing ratings
    if (type === 'imdb') {
      return score >= 7.5 ? 'text-green-500' : score >= 6 ? 'text-yellow-500' : 'text-red-500';
    }
    return score >= 75 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  };

  return (
    <div className={classNames(
      "group transition-all duration-300",
      "border border-noir-700 hover:border-noir-600",
      "bg-noir-800/50 hover:bg-noir-800/70 rounded-lg overflow-hidden"
    )}>
      {/* Main Card Content */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded} // Accessibility
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-silver-500 w-8 text-right">
            {pageIndex + index + 1} {/* Adjusted for pagination */}
          </span>
          <FilmIcon className="w-5 h-5 text-silver-600 group-hover:text-silver-400" />
          <div>
            <h3 className="font-cinema text-lg text-silver-100 group-hover:text-silver-200">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-silver-500 group-hover:text-silver-400">
                {movie.year}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-silver-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-silver-400" />
          )}
        </div>
      </div>

      {/* Expandable Details Section */}
      <div className={classNames(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[500px] border-t border-noir-700" : "max-h-0"
      )}>
        <div className="p-6 space-y-4">
          {/* Director */}
          <div>
            <h4 className="text-silver-400 text-sm mb-2">Director</h4>
            <p className="text-silver-300">{movie.director || "Unknown"}</p>
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-3 gap-4">
            {['imdb', 'rottenTomatoes', 'metascore'].map((type) => {
              const score = movie.ratings ? movie.ratings[type as keyof typeof movie.ratings] : null;
              return (
                <div key={type} className="bg-noir-900/50 p-3 rounded">
                  <p className={classNames(
                    type === 'imdb' && 'text-amber-500',
                    type === 'rottenTomatoes' && 'text-red-500',
                    type === 'metascore' && 'text-green-500',
                    "text-xs mb-1"
                  )}>
                    {type.toUpperCase()}
                  </p>
                  <p className={classNames(
                    "font-bold",
                    getRatingColor(score ?? 0, type as 'imdb' | 'rt' | 'meta')
                  )}>
                    {score !== null && score !== undefined ? score : 'N/A'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-silver-400 text-sm mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((Genres) => (
                <span 
                  key={Genres}
                  className="px-2 py-1 bg-noir-900/50 rounded text-silver-300 text-xs"
                >
                  {Genres}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          {movie.summary && (
            <div>
              <h4 className="text-silver-400 text-sm mb-2">Summary</h4>
              <p className="text-silver-300 text-sm leading-relaxed">
                {movie.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
