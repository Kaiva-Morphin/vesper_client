import { writable, type Writable } from "svelte/store";
import { CssStyleProperty, type TypeMap } from "./abstraction.svelte";

const properties = {
    base_content: { typename: "rgba", css_key: "--miniprofile-content", display_name: "Base content" },
    primary_color: { typename: "rgba", css_key: "--color-primary", display_name: "Primary color", data_key: "" },
    secondary_color: { typename: "rgba", css_key: "--color-secondary", display_name: "Secondary color", data_key: "" },
    tint: { typename: "percent", css_key: "--tint-bg", display_name: "Tint bg", min: 0, max: 30 },
    radius_avatar: { typename: "px", css_key: "--miniprofile-avatar", display_name: "Radius avatar", min: 0, max: 50 },
} as const;

type PropertiesMap = typeof properties;

type PropertyKey = keyof PropertiesMap;

export type MiniprofileTheme = {
  [K in PropertyKey]: CssStyleProperty<TypeMap[PropertiesMap[K]["typename"]]>;
};

type MiniprofileThemeValues = {
  [K in PropertyKey]: TypeMap[PropertiesMap[K]["typename"]];
};

export const miniprofileThemeTypes = {
    rgba: Object.entries(properties)
        .filter(([, value]) => value.typename === "rgba")
        .map(([key]) => key as PropertyKey),
    percent: Object.entries(properties)
        .filter(([, value]) => value.typename === "percent")
        .map(([key]) => key as PropertyKey),
    px: Object.entries(properties)
        .filter(([, value]) => value.typename === "px")
        .map(([key]) => key as PropertyKey),
} as const;

const defaultValues: Partial<MiniprofileThemeValues> = {
  base_content: { r: 255, g: 255, b: 255, a: 1 },
  primary_color: { r: 255, g: 255, b: 255, a: 1 },
  secondary_color: { r: 255, g: 255, b: 255, a: 1 },
  tint: 10,
  radius_avatar: 10,
};

export const DEFAULT_MINIPROFILE_THEME: () => MiniprofileTheme = () => (Object.fromEntries(
  Object.entries(properties).map(([key, meta]) => {
    const value = defaultValues[key as PropertyKey];
    const options: { min?: number; max?: number } = {};
    if ('min' in meta) options.min = meta.min;
    if ('max' in meta) options.max = meta.max;
    return [
      key,
      new CssStyleProperty(
        key,
        meta.css_key,
        meta.display_name,
        meta.typename,
        value,
        Object.keys(options).length > 0 ? options : undefined
      ),
    ];
  })
) as MiniprofileTheme);




const root = document.documentElement;
let init_style = getComputedStyle(root);



export function applyMiniprofileTheme(theme: MiniprofileTheme, el: HTMLElement) {
    for (const key in theme) {
        theme[key as keyof MiniprofileTheme].apply(el);
    }
}

export function clearMiniprofileTheme(el: HTMLElement){
    for (const key in properties) {
        const prop = properties[key as PropertyKey];
        el.style.removeProperty(prop.css_key);
        if ('data_key' in prop && prop.data_key != "") el.removeAttribute(prop.data_key);
    }
}

export function miniprofileThemeToStyle(theme: MiniprofileTheme) : string {
    let style = "";
    for (const key in theme) {
        style += theme[key as keyof MiniprofileTheme].css_key + ":" + theme[key as keyof MiniprofileTheme].toCssString() + ";";
    }
    return style;
}




function propertyFromSerialized(key : string, value : any) {
    const object_properties = properties[key as PropertyKey];
    return CssStyleProperty.fromSerializedJSON(value, key, object_properties);
}

export function serializeMiniprofileTheme(theme: MiniprofileTheme): string {
    const result = {} as any;
    for (const key in theme) {
        result[key] = theme[key as keyof MiniprofileTheme].formatJSON();
    }
    return btoa(JSON.stringify(result));
}
export function deserializeMiniprofileTheme(theme: string): MiniprofileTheme {
    let json = JSON.parse(atob(theme));
    const result = {} as any;
    for (const key in json) {
        result[key] = propertyFromSerialized(key, json[key]);
    }
    return result;
}