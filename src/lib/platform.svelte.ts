import { platform } from '@tauri-apps/plugin-os';
function get_platform() {
    try {
        return platform()
    } catch {
        return "web"
    }
}

export const currentPlatform = get_platform();
console.debug("[SYSTEM] Current platform ", currentPlatform)

export function isDesktop() : boolean {
    return currentPlatform == "windows" || currentPlatform == "linux"
}