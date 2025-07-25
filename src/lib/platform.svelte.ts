import { platform } from '@tauri-apps/plugin-os';

export const currentPlatform = platform();

export function isDesktop() : boolean {
    return currentPlatform == "windows"
}