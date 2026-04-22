import { ReactNode } from "react";

export interface ControlledAutocompleteProps<Result> {
  searchQuery: string;
  onUpdateSearchQuery: (searchQuery: string) => void;

  isLoading?: boolean;

  searchResults: Result[];
  renderResult: (result: Result, index: number) => ReactNode;
  onResultSelect: (result: Result) => void;
}

export interface AutocompleteControllerProps<Result> {
  /**
   * Maximum number of results to show.
   * @default 10
   */
  maxResults?: number;
  /**
   * Required search query length before emitting the search query event
   * @default 3
   */
  minQueryLength?: number;

  search: (searchQuery: string) => Promise<Result[]> | Result[];
}

export interface AutocompleteCacheProps<Result> {
  initialResults?: Result[];
  toString: (result: Result) => string;
  maxSize?: number;
  ttl?: number;
}
