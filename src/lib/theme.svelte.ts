import { oklchToRGB } from "$lib/util.svelte";
import { get, writable, type Writable } from "svelte/store";

export const default_themes = ["simple_dark", "night", "myabyss", "dracula", "synthwave", "retro", "forest", "aqua"]


import type { RgbaColor } from "svelte-awesome-color-picker";


export type RGB = { r: number, g: number, b: number };
export const rgbToCss = (c: RgbaColor) => `rgb(${c.r}, ${c.g}, ${c.b})`;
export const percentToCss = (c: number) => `${c}%`;
export const pxToCss = (c: number) => `${c}px`;
export const rgbToArr = (c: RgbaColor) : [number, number, number] => [c.r, c.g, c.b];

// 🧑‍🎤

class CssStyleProperty<T> {
    key: string;
    css_key: string;
    display_name: string;
    value: T;
    typename: keyof TypeMap;
    data_key?: string;

    constructor(
        key: string,
        css_key: string,
        display_name: string,
        typename: keyof TypeMap,
        value: T,
        data_key?: string
    ) {
        this.key = key;
        this.css_key = css_key;
        this.display_name = display_name;
        this.value = value;
        this.typename = typename;
        this.data_key = data_key;
    }

    apply(el: HTMLElement) {
        if (this.data_key) {
            switch (this.typename) {
                case "data_mark":
                    this.value as boolean ? el.setAttribute(this.data_key, "") : el.removeAttribute(this.data_key);
                    break;
            }
        } else {
            el.style.setProperty(this.css_key, this.toCssString());
        }
    }
    toCssString(): string {
        switch (this.typename) {
        case "RgbaColor":
            const c = this.value as unknown as RgbaColor;
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
        case "percent":
            return percentToCss(this.value as unknown as number);
        case "px":
            return pxToCss(this.value as unknown as number);
        case "number":
            return (this.value as unknown as number).toString();
        case "string":
            return this.value as unknown as string;
        default:
            console.error("[CssStyleProperty] Unknown type: " + this.typename + " for key: " + this.key);
            return "";
        }
    }

    static fromCssValue<T>(
        key: string,
        css_key: string,
        display_name: string,
        cssValue: string,
        type: keyof TypeMap,
        data_key?: string,
        data_value?: string
    ): CssStyleProperty<T> {
        let value: any;
        switch (type) {
            case "RgbaColor":
                value = CssStyleProperty.parseOklch(cssValue);
                break;
            case "percent":
                value = CssStyleProperty.parsePercent(cssValue);
                break;
            case "px":
                value = CssStyleProperty.parsePx(cssValue);
                break;
            case "number":
                value = parseFloat(cssValue) || 0;
                break;
            case "string":
                value = cssValue;
                break;
            case "data_mark":
                value = cssValue;
                break;
            default:
                value = cssValue;
        }

        return new CssStyleProperty<T>(key, css_key, display_name, type, value, data_key);
    }

    static fromDataValue<T>(
        key: string,
        css_key: string,
        display_name: string,
        type: keyof TypeMap,
        data_key?: string,
        data_value?: null | string
    ): CssStyleProperty<T> {
        let value: any;
        switch (type) {
            case "data_mark":
                value = data_value?.trim() === "true";
                break;
        }
        return new CssStyleProperty<T>(key, css_key, display_name, type, value, data_key);
    }

    static parseOklch(cssValue: string): RgbaColor {
        const c = oklchToRGB(cssValue);
        return { r: c.r, g: c.g, b: c.b, a: 1 };
    }

    static parsePercent(cssValue: string): number {
        const m = cssValue.match(/^(\d+\.?\d*)%$/);
        if (m) {
            return parseFloat(m[1]);
        }
        return 0;
    }

    static parsePx(cssValue: string): number {
        const m = cssValue.match(/^(\d+\.?\d*)px$/);
        if (m) {
            return parseFloat(m[1]);
        }
        return 0;
    }
}



type TypeMap = {
  RgbaColor: RgbaColor;
  number: number;
  string: string;
  percent: number;
  px: number;
  data_mark: boolean;
};


const properties = {
  neo: { typename: "data_mark", css_key: "data-neo", display_name: "Neo theme", data_key: "data-neo" },
  primary: { typename: "RgbaColor", css_key: "--color-primary", display_name: "Primary color" },
  primary_content: { typename: "RgbaColor", css_key: "--color-primary-content", display_name: "Primary content" },
  secondary: { typename: "RgbaColor", css_key: "--color-secondary", display_name: "Secondary color" },
  secondary_content: { typename: "RgbaColor", css_key: "--color-secondary-content", display_name: "Secondary content" },
  accent: { typename: "RgbaColor", css_key: "--color-accent", display_name: "Accent color" },
  accent_content: { typename: "RgbaColor", css_key: "--color-accent-content", display_name: "Accent content" },
  info: { typename: "RgbaColor", css_key: "--color-info", display_name: "Info color" },
  info_content: { typename: "RgbaColor", css_key: "--color-info-content", display_name: "Info content" },
  success: { typename: "RgbaColor", css_key: "--color-success", display_name: "Success color" },
  success_content: { typename: "RgbaColor", css_key: "--color-success-content", display_name: "Success content" },
  error: { typename: "RgbaColor", css_key: "--color-error", display_name: "Error color" },
  error_content: { typename: "RgbaColor", css_key: "--color-error-content", display_name: "Error content" },
  base_content: { typename: "RgbaColor", css_key: "--color-base-content", display_name: "Base content" },
  tint_100: { typename: "percent", css_key: "--tint-100o", display_name: "Tint 100%" },
  tint_200: { typename: "percent", css_key: "--tint-200o", display_name: "Tint 200%" },
  radius_selector: { typename: "px", css_key: "--radius_selector", display_name: "Radius selector" },
  radius_field: { typename: "px", css_key: "--radius_field", display_name: "Radius field" },
  radius_box: { typename: "px", css_key: "--radius_box", display_name: "Radius box" },
} as const;

type PropertiesMap = typeof properties;

type PropertyKey = keyof PropertiesMap;

type FlexTheme = {
  [K in PropertyKey]: CssStyleProperty<TypeMap[PropertiesMap[K]["typename"]]>;
};

type FlexThemeValues = {
  [K in PropertyKey]: TypeMap[PropertiesMap[K]["typename"]];
};

export const flexThemeTypes = {
    RgbaColor: Object.entries(properties)
        .filter(([, value]) => value.typename === "RgbaColor")
        .map(([key]) => key as PropertyKey),
    percent: Object.entries(properties)
        .filter(([, value]) => value.typename === "percent")
        .map(([key]) => key as PropertyKey),
    px: Object.entries(properties)
        .filter(([, value]) => value.typename === "px")
        .map(([key]) => key as PropertyKey),
} as const;


const root = document.documentElement;
let init_style = getComputedStyle(root);
export let THEME : Writable<FlexTheme> = writable(themeFromCss(root, init_style));


function themeFromCss(el: HTMLElement, styles: CSSStyleDeclaration): FlexTheme {
    const result = {} as any;
    for (const key in properties) {
        const prop = properties[key as PropertyKey];
        const cssValue = styles.getPropertyValue(prop.css_key).trim();
        if ('data_key' in prop) {
            let data = el.getAttribute(prop.data_key);
            result[key] = CssStyleProperty.fromDataValue(key, prop.css_key, prop.display_name, prop.typename, prop.data_key, data);
        } else {
            result[key] = CssStyleProperty.fromCssValue(key, prop.css_key, prop.display_name, cssValue, prop.typename);
        }
    }
    return result;
}


export function applyTheme(theme: FlexTheme, el: HTMLElement) {
    for (const key in theme) {
        theme[key as keyof FlexTheme].apply(el);
    }
}



let theme_override : null | FlexTheme = null;


THEME.subscribe((new_theme) => {
    applyTheme(new_theme, root);
})

export function setDataToElement(el: HTMLElement, k: string, v: string | null) {
    if (v == null) {el.removeAttribute(k); return}
    el.setAttribute(k, v);
}

export function clearFlexTheme(el: HTMLElement){
    for (const key in properties) {
        const prop = properties[key as PropertyKey];
        el.style.removeProperty(prop.css_key);
        if ('data_key' in prop) el.removeAttribute(prop.data_key);
    }
}


export function setDefaultTheme(t: string) {
    setNonOverrideTheme(t);
}

export function setNonOverrideTheme(t: string | FlexTheme) {
    if (theme_override != null) {
        console.log("OVER");
        applyTheme(theme_override, root);
        THEME.set(theme_override);
        setDataToElement(root, "data-theme", null);
        return;
    }
    if (typeof t === "string") {
        clearFlexTheme(root);
        setDataToElement(root, "data-theme", t);
        setDataToElement(root, "data-neo", t.includes("simple") ? null : "true");
        
        THEME.set(themeFromCss(root, getComputedStyle(document.documentElement)));
        console.log("DEF");
        return;
    } else {
        console.log("CUS");
        applyTheme(t, root);
        THEME.set(t);
        setDataToElement(root, "data-theme", null);
        return;
    }
}
