import type SettingsData from "@/interfaces/data/SettingsData";
import { Preferences } from '@capacitor/preferences';

export default async function updateSettings(data: Partial<SettingsData>) {
    for (const key in data) {
        await Preferences.set({
            key: `settings.${key}`,
            value: data[key as keyof SettingsData]?.toString() || '',
        });
    }
    return data as SettingsData;
}