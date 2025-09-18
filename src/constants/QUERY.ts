import { QueryClient } from "@tanstack/react-query"

const QUERY = {
    CLIENT: new QueryClient(),
    CACHE_KEYS: {
        SESSION: 'SESSION',
        ALL_SESSIONS: 'allSessions',
        DEVICE: 'DEVICE',
    }
}

export default QUERY