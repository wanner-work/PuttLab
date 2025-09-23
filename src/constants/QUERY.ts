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
        SETTINGS: 'SETTINGS',
        SESSION: 'SESSION',
        ALL_SESSIONS: 'ALL_SESSIONS',
        SESSIONS_SUM: 'SESSIONS_SUM',
        DEVICE: 'DEVICE',
    }
}

export default QUERY