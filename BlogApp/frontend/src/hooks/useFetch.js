import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";

// GET `url` and keep the result. Pass null to skip fetching.
// `data` keeps the previous result while a new request is loading, so lists don't flash empty.
export default function useFetch(url) {
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  const key = url ? `${nonce}:${url}` : null;

  useEffect(() => {
    if (!key) return undefined;
    let active = true;

    API.get(url)
      .then(({ data }) => active && setResult({ key, data, error: null }))
      .catch((error) => active && setResult({ key, data: null, error }));

    return () => {
      active = false;
    };
  }, [key, url]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const setData = useCallback(
    (update) =>
      setResult((r) => ({ ...r, data: typeof update === "function" ? update(r.data) : update })),
    []
  );

  return {
    data: result.data,
    error: result.key === key ? result.error : null,
    loading: key !== null && result.key !== key,
    reload,
    setData,
  };
}
