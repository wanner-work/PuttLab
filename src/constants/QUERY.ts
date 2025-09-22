import { QueryClient } from "@tanstack/react-query"

const QUERY = {
    CLIENT: new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 10,
                networkMode: 'always',
                refetchOnWindowFocus: false,
            },
        }
    }),
    CACHE_KEYS: {
        SESSION: 'SESSION',
        ALL_SESSIONS: 'allSessions',
        DEVICE: 'DEVICE',
    }
}

export default QUERY