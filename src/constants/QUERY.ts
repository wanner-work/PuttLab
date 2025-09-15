import { QueryClient } from "@tanstack/react-query"

const QUERY = {
    CLIENT: new QueryClient(),
    CACHE_KEYS: {
        SESSION: 'SESSION',
        ALL_SESSIONS: 'allSessions',
    }
}

export default QUERY