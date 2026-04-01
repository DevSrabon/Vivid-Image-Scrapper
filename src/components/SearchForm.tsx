import { Loader2, Search } from "lucide-react";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  limit: number;
  setLimit: (l: number) => void;
  loading: boolean;
  onSearch: (e: React.FormEvent) => void;
}

export const SearchForm = ({
  query,
  setQuery,
  limit,
  setLimit,
  loading,
  onSearch,
}: Props) => (
  <form className="search-section" onSubmit={onSearch}>
    <div className="input-group">
      <label htmlFor="query" className="input-label">
        Search Query
      </label>
      <input
        id="query"
        type="text"
        className="input"
        placeholder="e.g. Iphone 17 Pro Max"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
    </div>
    <div
      className="input-group"
      style={{ flex: "0 1 120px", minWidth: "120px" }}
    >
      <label htmlFor="limit" className="input-label">
        Limit
      </label>
      <input
        id="limit"
        type="number"
        className="input"
        min="1"
        max="100"
        value={limit}
        onChange={(e) => setLimit(parseInt(e.target.value) || 1)}
        disabled={loading}
      />
    </div>
    <button type="submit" className="btn" disabled={loading || !query.trim()}>
      {loading ? <Loader2 className="spinner" /> : <Search size={20} />}
      {loading ? "Searching..." : "Search"}
    </button>
  </form>
);
