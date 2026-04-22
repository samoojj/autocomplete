import { ControlledAutocompleteProps } from "../types";

export const Presentation = <R,>({
  searchQuery,
  onUpdateSearchQuery,
  searchResults,
  renderResult,
  onResultSelect,
}: ControlledAutocompleteProps<R>) => {
  return (
    <div className="flex flex-col">
      <input
        className="border rounded-sm"
        value={searchQuery}
        onChange={(event) => onUpdateSearchQuery(event.target.value)}
      />
      {searchResults.length && (
        <div className="flex flex-col border">
          {searchResults.map((result, index) => {
            return (
              <div
                key={index}
                className="hover:bg-slate-400/10"
                onClick={() => onResultSelect(result)}
              >
                {renderResult(result, index)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
