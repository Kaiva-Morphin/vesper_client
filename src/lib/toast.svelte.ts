import { writable } from "svelte/store";

type Item = { label: string; style: string, createdAt: number, onclick: () => void };

export let items = writable<Item[]>([]);
let count = 0;

export let isPaused = writable(false); 
let isPausedRef = $state(false); 
isPaused.subscribe(new_val => {
    isPausedRef = new_val;
})
const LIFETIME = 5000;


export function newToast(message: string, style="btn-primary", onclick: () => void = () => {}) {
    const newItem = { label: message, onclick, createdAt: Date.now(), style };
    items.update((list) => [...list, newItem]);
    startExpirationTimer(newItem);
}


let expirationTickers = new Map<string, number>();

function startExpirationTimer(item: Item) {
    let elapsed = 0;
    let startTime = Date.now();

    function tick() {
        if (!isPausedRef) {
            elapsed += Date.now() - startTime;
        }
        startTime = Date.now();

        if (elapsed >= LIFETIME) {
            items.update(list => list.filter(i => i !== item));
            return;
        }

        expirationTickers.set(item.label, requestAnimationFrame(tick));
    }
    expirationTickers.set(item.label, requestAnimationFrame(tick));
}

items.subscribe(list => {
    for (const [label, id] of expirationTickers.entries()) {
      if (!list.find(i => i.label === label)) {
        cancelAnimationFrame(id);
        expirationTickers.delete(label);
      }
    }
});

