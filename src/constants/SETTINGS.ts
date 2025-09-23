import type SettingsData from "@/interfaces/data/SettingsData"

const SETTINGS = {
    keys: {
        metric: 'settings.metric',
    },
    defaults: {
        metric: true,
    }
} satisfies {
    keys: Record<keyof SettingsData, string>,
    defaults: Record<keyof SettingsData, unknown>
}

export default SETTINGS