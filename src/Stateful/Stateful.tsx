import { ReactNode, useState } from "react";
import { Presentation } from "../Presentation/Presentation";
import { useCache } from "../cache/useCache";
import { FakeResult } from "../cache/fakeData";

export const Stateful = () => {
  const [queryString, setQueryString] = useState("");

  const results = useCache(queryString);

  return (
    <Presentation<FakeResult>
      searchQuery={queryString}
      onUpdateSearchQuery={setQueryString}
      searchResults={results}
      renderResult={function (result: FakeResult): ReactNode {
        return <div>{result.label}</div>;
      }}
      onResultSelect={function (result: FakeResult): void {
        alert(`${result.id}, ${result.label}`);
      }}
    />
  );
};
