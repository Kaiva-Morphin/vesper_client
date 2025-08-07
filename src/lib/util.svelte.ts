import { writable, type Writable } from "svelte/store";

export function oklchToRGB(oklch: string): {r: number, g: number, b: number} {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = oklch;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return {r: r, g: g, b: b};
}

export function easeOutQuint(x: number): number {
    return 1 - Math.pow(1 - x, 5);
}
export function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
}

export function shakeById(id: string) {
    const el : any = document.getElementById(id);
    if (el) {
      el.classList.remove("shake");
      void el.offsetWidth;
      el.classList.add("shake");
    }
}

export function parseJwt (token : string) : any {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


export function timeAgo(ms: number) {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
}

export function formatTimestamp(ms: number) {
    new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(ms).replace(',', ' at');
}


export function localState<T>(key: string, defaultValue: T): Writable<T> {
    const stored = localStorage.getItem(key);
    let w = writable(stored ? JSON.parse(stored) : defaultValue);
    w.subscribe(value => localStorage.setItem(key, JSON.stringify(value)));
    return w;
}

export const prettify = (t: String) => {
    return t.replaceAll("_", " ").split(" ").map((s) => s[0].toUpperCase() + s.slice(1)).join(" "); 
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}