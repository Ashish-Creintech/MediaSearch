// import { useCallback, useEffect, useRef, useState } from "react";
// import { MediaItem, MediaPage } from "media-core";
// import { useMediaClient } from "./MediaProvider";

// // Every fetching hook returns this same shape — keep it consistent so
// // consumers (and the SKILL.md docs) can describe one pattern, not three.
// export interface AsyncState<T> {
//   data: T | null;
//   loading: boolean;
//   error: Error | null;
// }

// /**
//  * Search Pexels by query, with pagination. Re-fetches page 1 whenever the
//  * query changes; call loadMore() to append the next page.
//  */
// export function useMediaSearch(query: string) {
//   const client = useMediaClient();
//   const [state, setState] = useState<AsyncState<MediaItem[]>>({
//     data: null,
//     loading: false,
//     error: null,
//   });
//   const [page, setPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const accumulated = useRef<MediaItem[]>([]);

//   useEffect(() => {
//     if (!query) {
//       setState({ data: null, loading: false, error: null });
//       accumulated.current = [];
//       return;
//     }

//     let cancelled = false;
//     accumulated.current = [];
//     setPage(1);
//     setState({ data: null, loading: true, error: null });

//     client
//       .search({ query, page: 1 })
//       .then((result: MediaPage) => {
//         if (cancelled) return;
//         accumulated.current = result.items;
//         setHasNextPage(result.hasNextPage);
//         setState({ data: result.items, loading: false, error: null });
//       })
//       .catch((err: Error) => {
//         if (cancelled) return;
//         setState({ data: null, loading: false, error: err });
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [client, query]);

//   const loadMore = useCallback(async () => {
//     if (!query || state.loading || !hasNextPage) return;
//     const nextPage = page + 1;
//     setState((prev) => ({ ...prev, loading: true }));
//     try {
//       const result = await client.search({ query, page: nextPage });
//       accumulated.current = [...accumulated.current, ...result.items];
//       setPage(nextPage);
//       setHasNextPage(result.hasNextPage);
//       setState({ data: accumulated.current, loading: false, error: null });
//     } catch (err) {
//       setState((prev) => ({ ...prev, loading: false, error: err as Error }));
//     }
//   }, [client, query, page, state.loading, hasNextPage]);

//   return { ...state, hasNextPage, loadMore };
// }

// /** Curated/trending feed, paginated the same way as search. */
// export function useMediaCurated() {
//   const client = useMediaClient();
//   const [state, setState] = useState<AsyncState<MediaItem[]>>({
//     data: null,
//     loading: true,
//     error: null,
//   });
//   const [page, setPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const accumulated = useRef<MediaItem[]>([]);

//   useEffect(() => {
//     let cancelled = false;
//     client
//       .curated(1)
//       .then((result) => {
//         if (cancelled) return;
//         accumulated.current = result.items;
//         setHasNextPage(result.hasNextPage);
//         setState({ data: result.items, loading: false, error: null });
//       })
//       .catch((err) => {
//         if (cancelled) return;
//         setState({ data: null, loading: false, error: err });
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [client]);

//   const loadMore = useCallback(async () => {
//     if (state.loading || !hasNextPage) return;
//     const nextPage = page + 1;
//     setState((prev) => ({ ...prev, loading: true }));
//     try {
//       const result = await client.curated(nextPage);
//       accumulated.current = [...accumulated.current, ...result.items];
//       setPage(nextPage);
//       setHasNextPage(result.hasNextPage);
//       setState({ data: accumulated.current, loading: false, error: null });
//     } catch (err) {
//       setState((prev) => ({ ...prev, loading: false, error: err as Error }));
//     }
//   }, [client, page, state.loading, hasNextPage]);

//   return { ...state, hasNextPage, loadMore };
// }

// /** Fetch a single item by id — used for direct-link / detail views. */
// export function useMediaItem(id: string | null) {
//   const client = useMediaClient();
//   const [state, setState] = useState<AsyncState<MediaItem>>({
//     data: null,
//     loading: false,
//     error: null,
//   });

//   useEffect(() => {
//     if (!id) {
//       setState({ data: null, loading: false, error: null });
//       return;
//     }
//     let cancelled = false;
//     setState({ data: null, loading: true, error: null });
//     client
//       .getById(id)
//       .then((item) => {
//         if (!cancelled) setState({ data: item, loading: false, error: null });
//       })
//       .catch((err) => {
//         if (!cancelled) setState({ data: null, loading: false, error: err });
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [client, id]);

//   return state;
// }

// /**
//  * Exposes trackView/trackDownload so components can fire SDK events without
//  * reaching into media-core directly. Kept separate from the data hooks above
//  * since not every component that needs to fire an event also needs to fetch.
//  */
// export function useMediaEvents() {
//   const client = useMediaClient();

//   const trackView = useCallback((itemId: string) => client.trackView(itemId), [client]);
//   const trackDownload = useCallback((itemId: string) => client.trackDownload(itemId), [client]);

//   return { trackView, trackDownload };
// }


import { useCallback, useEffect, useRef, useState } from "react";
import { MediaItem, MediaPage } from "media-core";
import { useMediaClient } from "./MediaProvider";

// Every fetching hook returns this same shape — keep it consistent so
// consumers (and the SKILL.md docs) can describe one pattern, not three.
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Search Pexels by query, with pagination. Re-fetches page 1 whenever the
 * query changes; call loadMore() to append the next page.
 */
export function useMediaSearch(query: string) {
  const client = useMediaClient();
  const [state, setState] = useState<AsyncState<MediaItem[]>>({
    data: null,
    loading: false,
    error: null,
  });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const accumulated = useRef<MediaItem[]>([]);

  useEffect(() => {
    if (!query) {
      setState({ data: null, loading: false, error: null });
      accumulated.current = [];
      return;
    }

    let cancelled = false;
    accumulated.current = [];
    setPage(1);
    setState({ data: null, loading: true, error: null });

    client
      .search({ query, page: 1 })
      .then((result: MediaPage) => {
        if (cancelled) return;
        accumulated.current = result.items;
        setHasNextPage(result.hasNextPage);
        setState({ data: result.items, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      cancelled = true;
    };
  }, [client, query]);

  const loadMore = useCallback(async () => {
    if (!query || state.loading || !hasNextPage) return;
    const nextPage = page + 1;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await client.search({ query, page: nextPage });
      accumulated.current = [...accumulated.current, ...result.items];
      setPage(nextPage);
      setHasNextPage(result.hasNextPage);
      setState({ data: accumulated.current, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err as Error }));
    }
  }, [client, query, page, state.loading, hasNextPage]);

  return { ...state, hasNextPage, loadMore };
}

/** Curated/trending feed, paginated the same way as search. */
export function useMediaCurated() {
  const client = useMediaClient();
  const [state, setState] = useState<AsyncState<MediaItem[]>>({
    data: null,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const accumulated = useRef<MediaItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    client
      .curated(1)
      .then((result) => {
        if (cancelled) return;
        accumulated.current = result.items;
        setHasNextPage(result.hasNextPage);
        setState({ data: result.items, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ data: null, loading: false, error: err });
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const loadMore = useCallback(async () => {
    if (state.loading || !hasNextPage) return;
    const nextPage = page + 1;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await client.curated(nextPage);
      accumulated.current = [...accumulated.current, ...result.items];
      setPage(nextPage);
      setHasNextPage(result.hasNextPage);
      setState({ data: accumulated.current, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err as Error }));
    }
  }, [client, page, state.loading, hasNextPage]);

  return { ...state, hasNextPage, loadMore };
}

/**
 * Search Pexels videos by query, with pagination. Same shape/behavior as
 * useMediaSearch, just backed by the video endpoints in media-core.
 */
export function useVideoSearch(query: string) {
  const client = useMediaClient();
  const [state, setState] = useState<AsyncState<MediaItem[]>>({
    data: null,
    loading: false,
    error: null,
  });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const accumulated = useRef<MediaItem[]>([]);

  useEffect(() => {
    if (!query) {
      setState({ data: null, loading: false, error: null });
      accumulated.current = [];
      return;
    }

    let cancelled = false;
    accumulated.current = [];
    setPage(1);
    setState({ data: null, loading: true, error: null });

    client
      .searchVideos({ query, page: 1 })
      .then((result: MediaPage) => {
        if (cancelled) return;
        accumulated.current = result.items;
        setHasNextPage(result.hasNextPage);
        setState({ data: result.items, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      cancelled = true;
    };
  }, [client, query]);

  const loadMore = useCallback(async () => {
    if (!query || state.loading || !hasNextPage) return;
    const nextPage = page + 1;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await client.searchVideos({ query, page: nextPage });
      accumulated.current = [...accumulated.current, ...result.items];
      setPage(nextPage);
      setHasNextPage(result.hasNextPage);
      setState({ data: accumulated.current, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err as Error }));
    }
  }, [client, query, page, state.loading, hasNextPage]);

  return { ...state, hasNextPage, loadMore };
}

/** Fetch a single item by id — used for direct-link / detail views. */
export function useMediaItem(id: string | null) {
  const client = useMediaClient();
  const [state, setState] = useState<AsyncState<MediaItem>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    client
      .getById(id)
      .then((item) => {
        if (!cancelled) setState({ data: item, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err });
      });
    return () => {
      cancelled = true;
    };
  }, [client, id]);

  return state;
}

/**
 * Exposes trackView/trackDownload so components can fire SDK events without
 * reaching into media-core directly. Kept separate from the data hooks above
 * since not every component that needs to fire an event also needs to fetch.
 */
export function useMediaEvents() {
  const client = useMediaClient();

  const trackView = useCallback((itemId: string) => client.trackView(itemId), [client]);
  const trackDownload = useCallback((itemId: string) => client.trackDownload(itemId), [client]);

  return { trackView, trackDownload };
}