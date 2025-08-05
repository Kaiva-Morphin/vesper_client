import { oklchToRGB } from "$lib/util.svelte";
import type { RgbaColor } from "svelte-awesome-color-picker";
import { get, writable, type Writable } from "svelte/store";

export const default_themes = ["simple_dark", "night", "myabyss", "dracula", "synthwave", "retro", "forest", "night", "aqua"]

let theme_bindings : Record<string, number> = {};
let i = 0;
for (let theme of default_themes) {
    theme_bindings[theme] = i;
    i += 1;
}

let idx = 0;

export type RGB = { r: number, g: number, b: number };
export const rgbToCss = (c: RgbaColor) => `rgb(${c.r}, ${c.g}, ${c.b})`;
export const percentToCss = (c: number) => `${c}%`;
export const pxToCss = (c: number) => `${c}px`;
export const rgbToArr = (c: RgbaColor) : [number, number, number] => [c.r, c.g, c.b];


export type ThemeColor = {
    base_content: RgbaColor,
    primary: RgbaColor,
    primary_content: RgbaColor,
    secondary: RgbaColor,
    secondary_content: RgbaColor,
    accent: RgbaColor,
    accent_content: RgbaColor,
    info: RgbaColor,
    info_content: RgbaColor,
    success: RgbaColor,
    success_content: RgbaColor,
    error: RgbaColor,
    error_content: RgbaColor
}

export type ThemePercent = {
    tint_100: number,
    tint_200: number
}

export type ThemePx = {
    radius_selector: number,
    radius_field: number
    radius_box: number
}

export type ThemeBoolean = {
    neo: boolean
}


const colorVarMap: Record<keyof ThemeColor, string> = {
    primary: '--color-primary',
    primary_content: '--color-primary-content',
    secondary: '--color-secondary',
    secondary_content: '--color-secondary-content',
    accent: '--color-accent',
    accent_content: '--color-accent-content',
    info: '--color-info',
    info_content: '--color-info-content',
    success: '--color-success',
    success_content: '--color-success-content',
    error: '--color-error',
    error_content: '--color-error-content',
    base_content: '--color-base-content'
};

const percentVarMap: Record<keyof ThemePercent, string> = {
    tint_100: '--tint-100o',
    tint_200: '--tint-200o',
};

const pxVarMap: Record<keyof ThemePx, string> = {
    radius_selector: '--radius_selector',
    radius_field: '--radius_field',
    radius_box: '--radius_box'
};

    
export const themeColorKeys = Object.keys(colorVarMap) as (keyof ThemeColor)[];
export const themePercentKeys = Object.keys(percentVarMap) as (keyof ThemePercent)[];
export const themePxKeys = Object.keys(pxVarMap) as (keyof ThemePx)[];

function parseColor(styles: CSSStyleDeclaration, cssVar: string): RGB {
    return oklchToRGB(styles.getPropertyValue(cssVar));
}

function parsePercent(value: string): number {
    const trimmed = value.trim();
    if (trimmed.endsWith('%')) {
        const num = parseFloat(trimmed.slice(0, -1));
        if (!isNaN(num)) return num;
    }
    return 0;
}

function parsePx(value: string): number {
    const trimmed = value.trim();
    if (trimmed.endsWith('px')) {
        const num = parseFloat(trimmed.slice(0, -2));
        if (!isNaN(num)) return num;
    }
    return 0;
}


export function toTheme(styles: CSSStyleDeclaration): Theme {
    const colors = {} as ThemeColor;
    for (const key in colorVarMap) {
        colors[key as keyof ThemeColor] = {...parseColor(styles, colorVarMap[key as keyof ThemeColor]), a: 1.0};
    }
    const percents = {} as ThemePercent;
    for (const key in percentVarMap) {
        percents[key as keyof ThemePercent] = parsePercent(styles.getPropertyValue(percentVarMap[key as keyof ThemePercent]));
    }
    const px = {} as ThemePx;
    for (const key in pxVarMap) {
        px[key as keyof ThemePx] = parsePx(styles.getPropertyValue(pxVarMap[key as keyof ThemePx]));
    }
    return {percent: percents, color: colors, px: px};
}

export function applyColorThemeToElement(el: HTMLElement, theme: ThemeColor) {
    for (const key in theme) {
        const cssVar = colorVarMap[key as keyof ThemeColor];
        el.style.setProperty(cssVar, rgbToCss(theme[key as keyof ThemeColor]));
    }
}

export function applyPercentThemeToElement(el: HTMLElement, theme: ThemePercent) {
    for (const key in theme) {
        const cssVar = percentVarMap[key as keyof ThemePercent];
        el.style.setProperty(cssVar, percentToCss(theme[key as keyof ThemePercent]));
    }
}

export function applyPxThemeToElement(el: HTMLElement, theme: ThemePx) {
    for (const key in theme) {
        const cssVar = pxVarMap[key as keyof ThemePx];
        el.style.setProperty(cssVar, pxToCss(theme[key as keyof ThemePx]));
    }
}

export function applyThemeToElement(el: HTMLElement, theme: Theme) {
    applyColorThemeToElement(el, theme.color);
    applyPercentThemeToElement(el, theme.percent);
    applyPxThemeToElement(el, theme.px);
}

export type Theme = {
    percent: ThemePercent,
    color: ThemeColor,
    px: ThemePx
}







const root = document.documentElement;

let init_style = getComputedStyle(document.documentElement);
let current_theme : string | Theme = toTheme(init_style);
let theme_override : null | Theme = null;

export let THEME : Writable<Theme> = writable(current_theme);

THEME.subscribe((new_theme) => {
    applyThemeToElement(root, new_theme);
    setDataToElement(root, "data-theme", null);
    console.log("APPLY", new_theme)
})
console.log("THEME HERE")




export function setDataToElement(el: HTMLElement, k: string, v: string | null) {
    if (v == null) {el.removeAttribute(k); return}
    el.setAttribute(k, v);
}




export function clearTheme(el: HTMLElement){
    for (const key of themeColorKeys) {
        const cssVar = colorVarMap[key];
        el.style.removeProperty(cssVar);
    }
    for (const key of themePercentKeys) {
        const cssVar = percentVarMap[key];
        el.style.removeProperty(cssVar);
    }
}


export function setDefaultTheme(t: string) {
    current_theme = t;
    applyThemes();
}

export function applyThemes() {
    if (theme_override != null) {
        console.log("OVER");
        applyThemeToElement(root, theme_override);
        THEME.set(theme_override);
        setDataToElement(root, "data-theme", null);
        return;
    }
    if (typeof current_theme === "string") {
        clearTheme(root);
        setDataToElement(root, "data-theme", current_theme);
        THEME.set(toTheme(getComputedStyle(document.documentElement)));
        setDataToElement(root, "data-neo", current_theme.includes("simple") ? null : "");
        console.log("DEF");
        return;
    } else {
        console.log("CUS");
        applyThemeToElement(root, current_theme);
        THEME.set(current_theme);
        setDataToElement(root, "data-theme", null);
        return;
    }
}

export function setThemeOverrideStyle(style: string = "") {
    root.style = style;
}



export function init(styles: CSSStyleDeclaration) {
    // const colors = get_target_colors(styles);
	// currentColors = colors;
	// tarparseColors = colors;

	// bg_color.set(tarparseColors.bg);
	// primary_color.set(tarparseColors.primary);
	// accent_color.set(tarparseColors.accent)
}



export function switchTheme(name: null | string = null) {
    let new_idx = null;
    if (name == null) {
        new_idx = (idx + 1) % default_themes.length;
    } else {
        new_idx = theme_bindings[name];
    }
    if (new_idx == null || new_idx == idx) {return}
    idx = new_idx;
    root.setAttribute('data-theme', default_themes[idx]);
    console.log(default_themes[idx].includes("simple"), default_themes[idx]);
    if (default_themes[idx].includes("simple")) {
        root.removeAttribute('data-neo');
    } else {
        root.setAttribute('data-neo',"");
    }
}




