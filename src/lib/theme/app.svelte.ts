import { writable, type Writable } from "svelte/store";
import { CssStyleProperty, type TypeMap } from "./abstraction.svelte";

export const default_themes = ["simple_dark", "night", "myabyss", "dracula", "synthwave", "retro", "forest", "aqua"]

export const CURRENT_THEME_KEY = "current_app_theme";


const properties = {
  neo: { typename: "data_boolean", css_key: "data-neo", display_name: "Neo theme", data_key: "data-neo" },
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
  tint_100: { typename: "percent", css_key: "--tint-100o", display_name: "Tint main" },
  tint_200: { typename: "percent", css_key: "--tint-200o", display_name: "Tint nested" },
  radius_selector: { typename: "px", css_key: "--radius-selector", display_name: "Radius selector" },
  radius_field: { typename: "px", css_key: "--radius-field", display_name: "Radius field" },
  radius_box: { typename: "px", css_key: "--radius-box", display_name: "Radius box" },
} as const;

type PropertiesMap = typeof properties;

type PropertyKey = keyof PropertiesMap;

export type AppTheme = {
  [K in PropertyKey]: CssStyleProperty<TypeMap[PropertiesMap[K]["typename"]]>;
};

type AppThemeValues = {
  [K in PropertyKey]: TypeMap[PropertiesMap[K]["typename"]];
};

export const appThemeTypes = {
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
export let THEME : Writable<AppTheme> = writable(themeFromCss(root, init_style));


export function applyTheme(theme: AppTheme, el: HTMLElement) {
    for (const key in theme) {
        theme[key as keyof AppTheme].apply(el);
    }
}



let theme_override : null | AppTheme = null;

export function setDataToElement(el: HTMLElement, k: string, v: string | null) {
    if (v == null) {el.removeAttribute(k); return}
    el.setAttribute(k, v);
}

export function clearAppTheme(el: HTMLElement){
    for (const key in properties) {
        const prop = properties[key as PropertyKey];
        el.style.removeProperty(prop.css_key);
        if ('data_key' in prop) el.removeAttribute(prop.data_key);
    }
}

export function themeToStyle(theme: AppTheme) : string {
    let style = "";
    for (const key in theme) {
        style += theme[key as keyof AppTheme].css_key + ":" + theme[key as keyof AppTheme].toCssString() + ";";
    }
    return style;
}

export function themeToData(theme: AppTheme) : Record<string, string> {
    let data : Record<string, string> = {};
    for (const key in theme) {
        let d = (theme[key as keyof AppTheme].toDataValue());
        if (d != null) {
            data[key] = d;
        }
    }
    return data
}



export function setDefaultTheme(t: string) {
    setNonOverrideTheme(t);
}

export function setNonOverrideTheme(t: string | AppTheme) {
    if (theme_override != null) {
        applyTheme(theme_override, root);
        THEME.set(theme_override);
        setDataToElement(root, "data-theme", null);
        return;
    }
    if (typeof t === "string") {
        clearAppTheme(root);
        setDataToElement(root, "data-theme", t);
        setDataToElement(root, "data-neo", t.includes("simple") ? null : "true");
        let theme = themeFromCss(root, getComputedStyle(document.documentElement));
        THEME.set(theme);
        applyTheme(theme, root);
        localStorage.setItem(CURRENT_THEME_KEY, serializeTheme(theme));
        return;
    } else {
        console.log("CUS");
        applyTheme(t, root);
        THEME.set(t);
        setDataToElement(root, "data-theme", null);
        localStorage.setItem(CURRENT_THEME_KEY, serializeTheme(t));
        return;
    }
}

export function init(theme?: string | null) {
    try {
        if (theme == null) throw new Error();
        let t = deserializeTheme(theme);
        setNonOverrideTheme(t);
        console.log("[SYSTEM] Theme loaded from local storage");
    } catch {
        setNonOverrideTheme(themeFromCss(root, getComputedStyle(root)));
        console.log("[SYSTEM] No theme found in local storage");
    }
    THEME.subscribe((new_theme) => {
        applyTheme(new_theme, root);
        localStorage.setItem(CURRENT_THEME_KEY, serializeTheme(new_theme));
    })
}

function themeFromCss(el: HTMLElement, styles: CSSStyleDeclaration): AppTheme {
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



function propertyFromSerialized(key : string, value : any) {
    const object_properties = properties[key as PropertyKey];
    return CssStyleProperty.fromSerializedJSON(value, key, object_properties);
}

export function serializeTheme(theme: AppTheme): string {
    const result = {} as any;
    for (const key in theme) {
        result[key] = theme[key as keyof AppTheme].formatJSON();
    }
    return btoa(JSON.stringify(result));
}
export function deserializeTheme(theme: string): AppTheme {
    let json = JSON.parse(atob(theme));
    const result = {} as any;
    for (const key in json) {
        result[key] = propertyFromSerialized(key, json[key]);
    }
    return result;
}