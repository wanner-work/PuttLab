import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export default async function vibrate(style: ImpactStyle = ImpactStyle.Heavy) {
    if (Capacitor.getPlatform() === "web") {
        return;
    }

    await Haptics.impact({ style })
}