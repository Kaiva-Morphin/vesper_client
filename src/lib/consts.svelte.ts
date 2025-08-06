import { isDesktop } from "./platform.svelte";
export const TITLEBAR_SIZE = isDesktop() ? 24 : 0;
