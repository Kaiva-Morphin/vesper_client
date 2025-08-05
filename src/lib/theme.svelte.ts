import { oklchToRGB } from "$lib/util.svelte";
import { get, writable, type Writable } from "svelte/store";

export const default_themes = ["simple_dark", "night", "myabyss", "dracula", "synthwave", "retro", "forest", "night", "aqua"]


import type { RgbaColor } from "svelte-awesome-color-picker";


export type RGB = { r: number, g: number, b: number };
export const rgbToCss = (c: RgbaColor) => `rgb(${c.r}, ${c.g}, ${c.b})`;
export const percentToCss = (c: number) => `${c}%`;
export const pxToCss = (c: number) => `${c}px`;
export const rgbToArr = (c: RgbaColor) : [number, number, number] => [c.r, c.g, c.b];

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
            el.setAttribute(this.data_key, this.value as any);
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
        case "boolean":
            return (this.value as unknown as boolean).toString();
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
        data_key?: string
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
        default:
            value = cssValue;
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
  boolean: boolean;
};


const properties : {typename: keyof TypeMap, key: string, css_key: string, display_name: string, data_key?: string }[] = [
  { typename: "RgbaColor", key: "primary", css_key: "--color-primary", display_name: "Primary color" },
  { typename: "RgbaColor", key: "primary_content", css_key: "--color-primary-content", display_name: "Primary content" },
  { typename: "RgbaColor", key: "secondary", css_key: "--color-secondary", display_name: "Secondary color" },
  { typename: "RgbaColor", key: "secondary_content", css_key: "--color-secondary-content", display_name: "Secondary content" },
  { typename: "RgbaColor", key: "accent", css_key: "--color-accent", display_name: "Accent color" },
  { typename: "RgbaColor", key: "accent_content", css_key: "--color-accent-content", display_name: "Accent content" },
  { typename: "RgbaColor", key: "info", css_key: "--color-info", display_name: "Info color" },
  { typename: "RgbaColor", key: "info_content", css_key: "--color-info-content", display_name: "Info content" },
  { typename: "RgbaColor", key: "success", css_key: "--color-success", display_name: "Success color" },
  { typename: "RgbaColor", key: "success_content", css_key: "--color-success-content", display_name: "Success content" },
  { typename: "RgbaColor", key: "error", css_key: "--color-error", display_name: "Error color" },
  { typename: "RgbaColor", key: "error_content", css_key: "--color-error-content", display_name: "Error content" },
  { typename: "RgbaColor", key: "base_content", css_key: "--color-base-content", display_name: "Base content" },
  { typename: "percent", key: "tint_100", css_key: "--tint-100o", display_name: "Tint 100%" },
  { typename: "percent", key: "tint_200", css_key: "--tint-200o", display_name: "Tint 200%" },
  { typename: "px", key: "radius_selector", css_key: "--radius_selector", display_name: "Radius selector" },
  { typename: "px", key: "radius_field", css_key: "--radius_field", display_name: "Radius field" },
  { typename: "px", key: "radius_box", css_key: "--radius_box", display_name: "Radius box" },
  { typename: "boolean", key: "neo", css_key: "", display_name: "Neo theme", data_key: "data-neo" },
] as const;

type Properties = typeof properties[number];

type FlexThemeValues = {
  [P in Properties as P["key"]]: TypeMap[P["typename"]];
};

type FlexTheme = {
  [P in Properties as P["key"]]: CssStyleProperty<TypeMap[P["typename"]]>;
};

export const flexThemeTypes = {
    RgbaColor: properties
        .filter(p => p.typename === "RgbaColor")
        .map(p => p.key),
    percent: properties
        .filter(p => p.typename === "percent")
        .map(p => p.key),
    px: properties
        .filter(p => p.typename === "px")
        .map(p => p.key),
    string: properties
        .filter(p => p.typename === "string")
        .map(p => p.key),
    number: properties
        .filter(p => p.typename === "number")
        .map(p => p.key),
    boolean: properties
        .filter(p => p.typename === "boolean")
        .map(p => p.key),
} as const;

let a = flexThemeTypes.RgbaColor;

function themeFromCss(styles: CSSStyleDeclaration, el?: HTMLElement): FlexTheme {
  return properties.reduce((acc, prop) => {
    let rawValue = styles.getPropertyValue(prop.css_key).trim();

    if (el && prop.data_key && el.hasAttribute(prop.data_key)) {
      rawValue = el.getAttribute(prop.data_key)!.trim();
    }

    acc[prop.key as keyof FlexTheme] = CssStyleProperty.fromCssValue(
      prop.key,
      prop.css_key,
      prop.display_name,
      rawValue,
      prop.typename,
      prop.data_key
    );

    return acc;
  }, {} as FlexTheme);
}


export function applyTheme(theme: FlexTheme, el: HTMLElement) {
  for (const key in theme) {
    theme[key as keyof FlexTheme].apply(el);
  }
}

const root = document.documentElement;

let init_style = getComputedStyle(document.documentElement);

let theme_override : null | FlexTheme = null;

export let THEME : Writable<FlexTheme> = writable(themeFromCss(init_style));

THEME.subscribe((new_theme) => {
    console.log("NEW THEME");
    applyTheme(new_theme, root);
})

export function setDataToElement(el: HTMLElement, k: string, v: string | null) {
    if (v == null) {el.removeAttribute(k); return}
    el.setAttribute(k, v);
}

export function clearFlexTheme(el: HTMLElement){
    for (const key of properties) {
        el.style.removeProperty(key.css_key);
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
        setDataToElement(root, "data-neo", t.includes("simple") ? null : "");
        THEME.set(themeFromCss(getComputedStyle(document.documentElement)));
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
