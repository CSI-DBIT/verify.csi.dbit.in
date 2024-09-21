import { useEffect, useMemo, useState } from "react";

/**
 * Check if a media query matches the UI
 * @param {String} mediaQueryString - The media query string to evaluate
 * @returns {Boolean} - Whether the media query matches
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event
 *
 * Example:
 *    useMediaQuery('(max-width: 600px)');
 *    useMediaQuery('only screen and (min-width: 600px)');
 *    useMediaQuery('@media only screen and (min-width: 600px)');
 */
export function useMediaQuery(mediaQueryString: string): boolean {
  const queryString = removeReservedMediaKeyWord(mediaQueryString);
  const query = useMemo(() => window.matchMedia(queryString), [queryString]);
  const [matches, setMatches] = useState<boolean>(query.matches); // one-time, instantaneous check

  useEffect(() => {
    // Ensure the listener is properly typed
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * Remove the "@media" keyword from the media query string if present
 * @param {string} mediaQueryString - The media query string
 * @returns {string} - The cleaned media query string
 */
function removeReservedMediaKeyWord(mediaQueryString: string): string {
  return mediaQueryString.replace("@media", "").trim();
}

