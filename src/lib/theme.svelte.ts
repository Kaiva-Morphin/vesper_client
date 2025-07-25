import { oklchToRGB } from "$lib/util.svelte";
import { writable, type Writable } from "svelte/store";

let themes = ["simple_dark", "night", "myabyss", "dracula", "synthwave", "retro", "forest", "night", "aqua"]

let theme_bindings : Record<string, number> = {};
let i = 0;
for (var theme of themes) {
    theme_bindings[theme] = i;
    i += 1;
}

let idx = 0;
const html = document.documentElement;


function get_primary_color(styles: CSSStyleDeclaration): [number, number, number] {
    return oklchToRGB(styles.getPropertyValue('--color-primary'))
}

function get_accent_color(styles: CSSStyleDeclaration): [number, number, number] {
    return oklchToRGB(styles.getPropertyValue('--color-accent'))
}

function get_bg_color(styles: CSSStyleDeclaration): [number, number, number] {
    return oklchToRGB(styles.getPropertyValue('--color-base-100'))
}

function get_target_colors(styles: CSSStyleDeclaration) : Record<string, [number, number, number]> {
    return {
        bg: get_bg_color(styles),
        primary: get_primary_color(styles),
        accent: get_accent_color(styles)
    }
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
    ];
}

let init_style = getComputedStyle(document.documentElement);
let prevColors = get_target_colors(init_style);
let currentColors = prevColors;
let targetColors = prevColors;
let interpolation_value = 1;
let interpolation_secs = 0.25;



export const bg_color = writable<[number, number, number]>(targetColors.bg);
export const primary_color = writable<[number, number, number]>(targetColors.primary);
export const accent_color = writable<[number, number, number]>(targetColors.accent);
const writables : Record<string, Writable<[number, number, number]>>  = {
    bg: bg_color,
    primary: primary_color,
    accent: accent_color
}

export function init(styles: CSSStyleDeclaration) {
    const colors = get_target_colors(styles);
	currentColors = colors;
	targetColors = colors;

	bg_color.set(targetColors.bg);
	primary_color.set(targetColors.primary);
	accent_color.set(targetColors.accent)
}


let lastFrameTime: number | null = null;
function tickInterpolateColors(timestamp: number) {
    if (lastFrameTime == null) lastFrameTime = timestamp;
    const dt = (timestamp - lastFrameTime) / 1000;
    interpolation_value += dt / interpolation_secs;
    interpolation_value = Math.min(interpolation_value, 1);
    for (const key of Object.keys(currentColors) as (keyof typeof currentColors)[]) {
        const interpolated = lerpColor(prevColors[key], targetColors[key], interpolation_value);
        currentColors[key] = interpolated;
        writables[key].set(interpolated);
    }
    if (interpolation_value != 1) {
        requestAnimationFrame(tickInterpolateColors)
    } else {
        lastFrameTime = null;
    }
}

function startInterpolateColors(){
	const style = getComputedStyle(document.documentElement);
    if (interpolation_value == 1) {
        currentColors = prevColors;
    } else {
        // If prev is unfinished - interpolate from current to target
        prevColors = currentColors;
    }
    interpolation_value = 0;
    requestAnimationFrame(tickInterpolateColors)
}


export function updateColor() {
	const style = getComputedStyle(document.documentElement);
    prevColors = targetColors;
    targetColors = get_target_colors(style);
    startInterpolateColors();
}

export function switchTheme(name: null | string = null) {
    let new_idx = null;
    if (name == null) {
        new_idx = (idx + 1) % themes.length;
    } else {
        new_idx = theme_bindings[name];
    }
    if (new_idx == null || new_idx == idx) {return}
    idx = new_idx;
    html.setAttribute('data-theme', themes[idx]);
    console.log(themes[idx].includes("simple"), themes[idx]);
    if (themes[idx].includes("simple")) {
        html.removeAttribute('data-neo');
    } else {
        html.setAttribute('data-neo',"");
    }
    updateColor();
}

// todo: unify and make ticker here

export function setThemeOverrideStyle(style: string = "") {
    html.style = style;
    updateColor();
}

