<div class="test">
    <div class="w-64 h-64" data-neo="true">
        <div class="btn btn-primary">primary true</div>
        <div class="btn btn-primary btn-border">border true</div>
        <div class="marker">marker true</div>
        <div data-neo="false">
            <div class="btn btn-primary">primary false</div>
            <div class="btn btn-primary btn-border">border false</div>
            <div class="marker">marker false</div>
        </div>
    </div>
    <div class="w-64 h-64" data-neo="false">
        <div class="btn btn-primary">primary false</div>
        <div class="btn btn-primary btn-border">border false</div>
        <div class="marker">marker false</div>
        <div data-neo="true">
            <div class="btn btn-primary">primary true</div>
            <div class="btn btn-primary btn-border">border true</div>
            <div class="marker">marker true</div>
        </div>
    </div>
</div>

<style>

:root {
    background: #000;
}



@layer test {
    [data-neo] {
        --size: calc(var(--size-field, 0.25rem) * 10);
        --color-fg: var(--color-primary-content);
        --color-bg: var(--color-primary);

        --border-margin: 0;

        --border-height: var(--size);

        --border-bg: var(--color-bg);
        --border-bg-hover: color-mix(in oklab, var(--btn-color, var(--color-base-200) ), #000 7%);
        --border-color: var(--color-fg);
        --border-color-hover: var(--color-fg);

        --border-outline: 0;
        --border-outline-offset: 0px;
        --border-outline-offset-hover: var(--border);
        --border-outline-offset-active: -2px;
        --border-border: var(--border) solid var(--color-bg);
    }
    [data-neo="true"] {
        --border-margin: var(--border) var(--border);
        --border-height: calc(var(--size) - var(--border) * 2);

        --border-bg: 0;
        --border-bg-hover: var(--color-bg);
        --border-color: var(--color-bg);
        --border-color-hover: var(--color-fg);
        --border-outline: var(--border) solid var(--color-bg);
    }
}

.btn-border {
    background: var(--border-bg);
    color: var(--border-color);
    height: var(--border-height);
    margin: var(--border-margin);
    border: var(--border-border);
    outline: var(--border-outline);

    transition-property: color, background-color, outline-color, outline-width, box-shadow, outline-offset, outline-color, transform;
    transition-duration: 0.15s;

    outline-offset: var(--border-outline-offset);
}

.btn-border:hover {
    background: var(--border-bg-hover);
    color: var(--border-color-hover);
    outline-offset: var(--border-outline-offset-hover);
}

.marker {
    background: var(--btn-bg);
    height: 32px;
}

</style>
