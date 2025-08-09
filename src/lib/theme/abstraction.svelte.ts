import type { RgbaColor } from "svelte-awesome-color-picker";
import { oklchToRGB } from "$lib/util.svelte";


export type RGB = { r: number, g: number, b: number };
export const rgbToCss = (c: RgbaColor) => `rgb(${c.r}, ${c.g}, ${c.b})`;
export const percentToCss = (c: number) => `${c}%`;
export const pxToCss = (c: number) => `${c}px`;

// 🧑‍🎤

export class CssStyleProperty<T> {
    key: string;
    css_key: string;
    display_name: string;
    value: T;
    typename: keyof TypeMap;
    data_key?: string;
    min?: T;
    max?: T;

    constructor(
        key: string,
        css_key: string,
        display_name: string,
        typename: keyof TypeMap,
        value: T,
        public options?: { data_key?: string; min?: T; max?: T }
    ) {
        this.key = key;
        this.css_key = css_key;
        this.display_name = display_name;
        this.value = value;
        this.typename = typename;
        this.data_key = options?.data_key;
        this.min = options?.min;
        this.max = options?.max;
    }

    apply(el: HTMLElement) {
        if (this.data_key) {
            switch (this.typename) {
                case "data_boolean":
                    this.value as boolean ? el.setAttribute(this.data_key, "true") : el.setAttribute(this.data_key, "false");
                    break;
            }
        } else {
            el.style.setProperty(this.css_key, this.toCssString());
        }
    }
    toCssString(): string {
        switch (this.typename) {
        case "fake_rgba":
            const c = this.value as unknown as RgbaColor;
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
        case "rgba":
            const ca = this.value as unknown as RgbaColor;
            return `rgba(${ca.r}, ${ca.g}, ${ca.b}, ${ca.a})`;
        case "percent":
            let vpc : number = this.value as unknown as number;
            if (this.min) {
                vpc = Math.max(this.min as unknown as number, vpc);
            }
            if (this.max) {
                vpc = Math.min(this.max as unknown as number, vpc);
            }
            return percentToCss(vpc);
        case "px":
            let vpx : number = this.value as unknown as number;
            if (this.min) {
                vpx = Math.max(this.min as unknown as number, vpx);
            }
            if (this.max) {
                vpx = Math.min(this.max as unknown as number, vpx);
            }
            return pxToCss(vpx);
        case "number":
            return (this.value as unknown as number).toString();
        case "string":
            return this.value as unknown as string;
        case "boolean_number":
            return this.value as unknown as boolean ? "1" : "0";
        default:
            return "";
        }
    }
    
    toDataValue() : string | null {
        if (!this.data_key) return null;
        return this.value as unknown as string
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
            case "fake_rgba":
                value = CssStyleProperty.parseOklch(cssValue);
                break;
            case "rgba":
                value = CssStyleProperty.parseOklch(cssValue);
                console.warn("Parsing rgba from oklch css value with default fn - alpha will be lost");
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
            case "data_boolean":
                value = cssValue;
                break;
            case "boolean_number":
                value = cssValue == "1";
                break;
            default:
                value = cssValue;
        }
        return new CssStyleProperty<T>(key, css_key, display_name, type, value, {data_key: data_key});
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
            case "data_boolean":
                value = data_value?.trim() === "true";
                break;
        }
        return new CssStyleProperty<T>(key, css_key, display_name, type, value, {data_key: data_key});
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

    formatJSON() : any {
        switch (this.typename) {
            case "fake_rgba":
                let c = this.value as unknown as RgbaColor;
                return {r: c.r, g: c.g, b: c.b};
            default:
                return this.value;
        }
    }
    static fromSerializedJSON<T>(json: any, key: string, object_properties: any) : CssStyleProperty<T> {
        switch (object_properties.typename) {
            case "fake_rgba":
                let v : RgbaColor = {r: json.r as number, g: json.g as number, b: json.b as number, a: 1};
                return new CssStyleProperty<T>(key, object_properties.css_key, object_properties.display_name, 
                    "fake_rgba", v as any, {data_key: object_properties.data_key});
            default:
                return new CssStyleProperty<T>(key, object_properties.css_key, object_properties.display_name, 
                    object_properties.typename, json as any, {data_key: object_properties.data_key});
        }
    }
}

export type TypeMap = {
  rgba: RgbaColor;
  fake_rgba: RgbaColor,
  number: number;
  string: string;
  percent: number;
  px: number;
  boolean_number: boolean;
  data_boolean: boolean;
};

