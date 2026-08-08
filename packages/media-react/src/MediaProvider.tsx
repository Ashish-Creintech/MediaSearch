import React, { createContext, useContext, useMemo } from "react";
import { MediaClient, MediaClientConfig } from "media-core";

const MediaClientContext = createContext<MediaClient | null>(null);

export interface MediaProviderProps {
  apiKey: string;
  baseUrl?: string;
  children: React.ReactNode;
}

// Creates exactly one MediaClient for the whole subtree and puts it on
// context. This is the only place a MediaClient gets constructed — hooks
// below just read it back out via useMediaClient().
export function MediaProvider({ apiKey, baseUrl, children }: MediaProviderProps) {
  const client = useMemo(() => {
    const config: MediaClientConfig = { apiKey, baseUrl };
    return new MediaClient(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, baseUrl]);

  return <MediaClientContext.Provider value={client}>{children}</MediaClientContext.Provider>;
}

export function useMediaClient(): MediaClient {
  const client = useContext(MediaClientContext);
  if (!client) {
    throw new Error("useMediaClient must be used within a <MediaProvider>");
  }
  return client;
}
