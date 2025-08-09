import { MOUSE_POS, TITLEBAR_SIZE } from "$lib/globals.svelte";
import { clamp, localState, shakeById } from "$lib/util.svelte";
import type { SvelteComponent } from "svelte";
import { get, writable, type Writable } from "svelte/store";

export const FLOATING_PREFIX = "floating_window_";
export const FLOATING_CONTAINER_ID = "floating_container";

export type Vec2 = {x: number, y: number};
export const vec2 = (x: number, y: number): Vec2 => ({x, y});
export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Vec2, b: number): Vec2 => ({ x: a.x * b, y: a.y * b });
export const div = (a: Vec2, b: number): Vec2 => ({ x: a.x / b, y: a.y / b });
export const e2pos = (e: MouseEvent): Vec2 => ({ x: e.clientX, y: e.clientY });
export const length_squared = (v: Vec2): number => v.x * v.x + v.y * v.y;
export const length = (v: Vec2): number => Math.sqrt(length_squared(v));
export const is_zero = (v: Vec2): boolean => v.x == 0 && v.y == 0;
export const normalize = (v: Vec2): Vec2 => {let l = length(v); return div(v, l)};
export const normalize_or_zero = (v: Vec2): Vec2 => {let l = length(v); return l == 0 ? vec2(0, 0) : div(v, l)};
export const move_towards = (a: number, b: number, speed: number): number => Math.min(Math.max(a, b), a + (b - a) * speed);

let half_screen = mul(vec2(window.innerWidth, (window.innerHeight - TITLEBAR_SIZE)), 0.5);




let latest_resize = Date.now();
const LATEST_RESIZE_DT = 100;
window.addEventListener('resize', () => {
    let new_screen = vec2(window.innerWidth, window.innerHeight - TITLEBAR_SIZE);
    half_screen = mul(new_screen, 0.5);
    latest_resize = Date.now();
    WINDOWS.update((windows) => {
        for (var [id, w] of Object.entries(windows)) {
            w.size.x = Math.min(w.size.x, new_screen.x - SCREEN_MARGIN * 2.0);
            w.size.y = Math.min(w.size.y, new_screen.y - SCREEN_MARGIN * 2.0);
        }
        return windows;
    });
});

type TimedVec2 = {p: Vec2, t: number}



export type FloatingWindow = {
    id: string;
    component: any;
    props?: Record<string, any>,
    dbg: string,
    pos: Vec2,
    target: Vec2,
    velocity: Vec2,
    size: Vec2,
    z_index: number,

    max_size: Vec2,
    min_size: Vec2,
    inactive_since: number,
    type: FloatingWindowType,
}
export type FloatingWindowType =
    | { mode: 'floating', drag_offset: Vec2, pinned: boolean, magnet: Magnet | null, resizing: null | { edge: number, start_mouse: Vec2, start_size: Vec2, start_pos: Vec2 }, grabbed: null | [TimedVec2, TimedVec2] }
    | { mode: 'fixed', targetId: string, offset: Vec2 }
    | { mode: 'follow' };

export const DefaultWindow = {
    dbg: "",
    z_index: 0,
    pos: vec2(0, 0),
    target: vec2(0, 0),
    velocity: vec2(0, 0),
    max_size: vec2(5000, 5000),
    min_size: vec2(50, 50),
    inactive_since: 0,

    type: {
        mode: 'floating',
        drag_offset: vec2(0, 0),
        magnet: null,
        pinned: false,
        resizing: null,
        grabbed: null
    } as FloatingWindowType
}

export const WINDOWS : Writable<Record<string, FloatingWindow>> = writable({
    // dev: {
    //     ...DefaultWindow,
    //     size: vec2(200, 150),
    //     max_size: vec2(5000, 5000),
    //     min_size: vec2(50, 50),
    // } as FloatingWindow,
    // dev2: {
    //     ...DefaultWindow,
    //     size: vec2(200, 150),
    //     max_size: vec2(5000, 5000),
    //     min_size: vec2(50, 50),
    // } as FloatingWindow
});

export function top_layer(caller: FloatingWindow) {
    if (caller.type.mode !== "floating") return;
    let current = caller.z_index;
    WINDOWS.update((windows) => {
        for (var [id, w] of Object.entries(windows)) {
            if (w.type.mode != "floating") continue;
            if (w.z_index > current) w.z_index -= 1;
            if (id == caller.id) w.z_index = Object.keys(windows).length - 1;
        }
        return windows;
    });
}

export function handleMouseDown(e: MouseEvent, w: FloatingWindow, id: string) {
    if (w.type.mode !== "floating") return;
    w.inactive_since = Date.now();
    top_layer(w);
    let p = e2pos(e);
    w.type.pinned = false;
    w.type.drag_offset = sub(p, w.pos);
    w.target = sub(p, w.type.drag_offset);
    w.type.magnet = null;
    const now = Date.now();
    let timed = { p: p, t: now };
    w.type.grabbed = [timed, timed];
    const moveListener = (e: MouseEvent) => handleMouseMove(e, w);
    const upListener = (e: MouseEvent) => {
        handleMouseUp(e, w);
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("mouseup", upListener);
    };
    window.addEventListener("mousemove", moveListener);
    window.addEventListener("mouseup", upListener);
}
function handleMouseMove(e: MouseEvent, w: FloatingWindow) {
    if (w.type.mode !== "floating") return;
    if (w.type.grabbed) {
        let p = e2pos(e);
        const now = Date.now();
        w.type.grabbed[1] = { ...w.type.grabbed[0] };
        w.type.grabbed[0] = { p, t: now };
        w.target = sub(p, w.type.drag_offset);
    }
}
function handleMouseUp(e: MouseEvent, w: FloatingWindow) {
    if (w.type.mode !== "floating") return;
    if (w.type.grabbed) {
        const now = Date.now();
        const a = w.type.grabbed;
        const dt1 = a[0].t - a[1].t;
        const dt2 = now + 1 - a[0].t;
        const p = e2pos(e);
        const v1 = length(sub(a[0].p, a[1].p)) / dt1;
        const v2 = length(sub(p, a[0].p)) / dt2;
        const acceleration = v2 - v1;
        w.type.pinned = Math.abs(acceleration) < 1.0
        w.type.grabbed = null;
    }
    window.removeEventListener("mousemove", (e: MouseEvent) => {handleMouseMove(e, w)});
    window.removeEventListener("mouseup", (e: MouseEvent) => {handleMouseUp(e, w)});
}

let latest_dt = Date.now();
const wrapped_dt = () : number => {
    let dt = Date.now() - latest_dt;
    latest_dt = Date.now();
    return Math.min(0.025, dt / 1000.0);
}

const SCREEN_MARGIN = 20;
let tick = 0;

const SLEEP_DT = 1000;
const ARCHIMEDES_FORCE = 1000;

const ACCELERATION = 250;
const MAX_SPEED = 5000;

type Magnet = {
    y: number,
    x: number
}

function magnet_top(m: Magnet | null) : Magnet {
    let n = m ?? {x: 0, y: 0};
    n.y = -1;
    return n;
}
function magnet_bottom(m: Magnet | null) : Magnet {
    let n = m ?? {x: 0, y: 0};
    n.y = 1;
    return n;
}
function magnet_left(m: Magnet | null) : Magnet {
    let n = m ?? {x: 0, y: 0};
    n.x = -1;
    return n;
}
function magnet_right(m: Magnet | null) : Magnet {
    let n = m ?? {x: 0, y: 0};
    n.x = 1;
    return n;
}



function clamp_target_to_screen(w: FloatingWindow) {
    let half_size = mul(w.size, 0.5);
    const min_x = half_size.x + SCREEN_MARGIN - half_screen.x;
    const min_y = half_size.y + SCREEN_MARGIN - half_screen.y;
    const max_x = half_screen.x - half_size.x - SCREEN_MARGIN;
    const max_y = half_screen.y - half_size.y - SCREEN_MARGIN;

    w.target.x = Math.max(min_x, Math.min(max_x, w.target.x));
    w.target.y = Math.max(min_y, Math.min(max_y, w.target.y));
}

function apply_squishy_movement(w: FloatingWindow, dt: number, acceleration: number = ACCELERATION,dumping: number = 15.0) {
    w.velocity = sub(w.velocity, mul(w.velocity, dt * dumping));

    let pos_dt = sub(w.target, w.pos);
    let target_dir = normalize_or_zero(pos_dt);
    let target_l = length(pos_dt);
    if (length_squared(w.velocity) < MAX_SPEED * MAX_SPEED)
        w.velocity = add(w.velocity, mul(target_dir, target_l * acceleration * dt));
    if (length_squared(w.velocity) < 0.001) {
        w.velocity = vec2(0, 0);
    }
    w.pos = add(w.pos, mul(w.velocity, dt));
}


function update_floating(w: FloatingWindow, dt: number, now: number) {
    if (w.type.mode !== "floating") return;
    let half_size = mul(w.size, 0.5);

    const min_x = half_size.x + SCREEN_MARGIN - half_screen.x;
    const min_y = half_size.y + SCREEN_MARGIN - half_screen.y;
    const max_x = half_screen.x - half_size.x - SCREEN_MARGIN;
    const max_y = half_screen.y - half_size.y - SCREEN_MARGIN;

    let is_bound_x_min = (v: number) : boolean => v < min_x;
    let is_bound_x_max = (v: number) : boolean => v > max_x;
    let is_bound_y_min = (v: number) : boolean => v < min_y;
    let is_bound_y_max = (v: number) : boolean => v > max_y;

    if (w.type.grabbed != null || w.type.pinned) {
        w.velocity = sub(w.velocity, mul(w.velocity, dt * 15.0));
        if (w.type.pinned) {
            clamp_target_to_screen(w);
        }
        let pos_dt = sub(w.target, w.pos);
        let target_dir = normalize_or_zero(pos_dt);
        let target_l = length(pos_dt);
        if (length_squared(w.velocity) < MAX_SPEED * MAX_SPEED)
            w.velocity = add(w.velocity, mul(target_dir, target_l * ACCELERATION * dt));
    } else {
        if (w.type.magnet == null) {w.velocity = sub(w.velocity, mul(w.velocity, dt * 2.0))};
        let x_max = is_bound_x_max(w.pos.x);
        let x_min = is_bound_x_min(w.pos.x);
        let y_max = is_bound_y_max(w.pos.y);
        let y_min = is_bound_y_min(w.pos.y);

    
        if (x_min) w.type.magnet = magnet_left(w.type.magnet);
        if (y_min) w.type.magnet = magnet_top(w.type.magnet);
        if (x_max) w.type.magnet = magnet_right(w.type.magnet);
        if (y_max) w.type.magnet = magnet_bottom(w.type.magnet);
        if (w.type.magnet) {
            w.velocity.x = w.velocity.x - (w.velocity.x * dt * (w.type.magnet.x == 0 ? 3.0 : 15.0))
            w.velocity.y = w.velocity.y - (w.velocity.y * dt * (w.type.magnet.y == 0 ? 3.0 : 15.0))

            if (w.type.magnet.x == -1) {
                w.target.x = min_x;
                let x_dt = w.pos.x - w.target.x;
                w.velocity.x = w.velocity.x - ( x_dt * dt * ARCHIMEDES_FORCE);
            }
            if (w.type.magnet.x == 1) {
                w.target.x = max_x;
                let x_dt = w.pos.x - w.target.x;
                w.velocity.x = w.velocity.x - ( x_dt * dt * ARCHIMEDES_FORCE);
            }
            if (w.type.magnet.y == -1) {
                w.target.y = min_y;
                let y_dt = w.pos.y - w.target.y;
                w.velocity.y = w.velocity.y - ( y_dt * dt * ARCHIMEDES_FORCE);
            }
            if (w.type.magnet.y == 1) {
                w.target.y = max_y;
                let y_dt = w.pos.y - w.target.y;
                w.velocity.y = w.velocity.y - ( y_dt * dt * ARCHIMEDES_FORCE);
            }
        }
        
    }
    if (length_squared(w.velocity) < 0.001) {
        w.velocity = vec2(0, 0);
    }
    w.pos = add(w.pos, mul(w.velocity, dt));
    
}

function update_fixed(w: FloatingWindow, dt: number, now: number, getElementPos: (id: string) => Vec2) {
    if (w.type.mode != "fixed") return;
    const elementPos = getElementPos(w.type.targetId);
    w.target = add(elementPos, w.type.offset);
    clamp_target_to_screen(w);
    apply_squishy_movement(w, dt);
}

const FOLLOWING_OFFSET : number = 32;
function update_following(w: FloatingWindow, dt: number, now: number, mouse_pos: Vec2) {
    w.target = sub(mouse_pos, half_screen);
    let half_size = mul(w.size, 0.5);
    if (w.target.x + w.size.x + FOLLOWING_OFFSET + SCREEN_MARGIN < half_screen.x) {
        w.target.x = w.target.x + half_size.x + FOLLOWING_OFFSET;
    } else if (w.target.x - w.size.x - FOLLOWING_OFFSET - SCREEN_MARGIN > -half_screen.x) {
        w.target.x = w.target.x - half_size.x - FOLLOWING_OFFSET;
    }
    w.target.y = clamp(w.target.y, - half_screen.y + half_size.y + FOLLOWING_OFFSET , half_screen.y - half_size.y - FOLLOWING_OFFSET);
    apply_squishy_movement(w, dt, ACCELERATION * 5, 100.0);
}



async function tick_windows() {
    let dt = wrapped_dt();

    let now = Date.now();
    let is_resizing = now - latest_resize < LATEST_RESIZE_DT;
    let mouse_pos = get(MOUSE_POS);
    WINDOWS.update((windows) => {
        for (var [id, w] of Object.entries(windows)) {
            let is_sleeping = now - w.inactive_since > SLEEP_DT;
            
            switch (w.type.mode) {
                case "floating":
                    if (is_sleeping && !is_resizing) { 
                        continue;
                    }
                    update_floating(w, dt, now);
                    if (!is_zero(w.velocity) || w.type.grabbed != null) {
                        w.inactive_since = now;
                    }
                    if (is_sleeping) {
                        w.type.magnet = null
                    }
                    break;
                case "follow":
                    update_following(w, dt, now, mouse_pos);
                    break;
            }
            
            
            
            // update_fixed(w, dt, now, getElementPos);
            // update_following(w, dt, now, mousePos);
        }
        return windows
    })

    tick = requestAnimationFrame(tick_windows)
}
tick = requestAnimationFrame(tick_windows)


export function handleResizeStart(e: MouseEvent, w: FloatingWindow, edge: number) {
    if (w.type.mode !== "floating") return;
    e.stopPropagation();
    e.preventDefault();
    top_layer(w);
    const p = e2pos(e);
    w.type.resizing = {
        edge,
        start_mouse: p,
        start_size: { ...w.size },
        start_pos: { ...w.pos },
    };
    w.type.pinned = false;
    w.type.grabbed = null;
    w.velocity = vec2(0, 0);

    const moveListener = (e: MouseEvent) => resizeMove(e, w);
    const upListener = (e: MouseEvent) => {
        resizeEnd(w);
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("mouseup", upListener);
    };

    window.addEventListener("mousemove", moveListener);
    window.addEventListener("mouseup", upListener);
}


function resizeMove(e: MouseEvent, w: FloatingWindow) {
    const p = e2pos(e);
    if (w.type.mode !== "floating") return;
    if (!w.type.resizing) return;
    w.inactive_since = 0; // force sleep
    const dx = p.x - w.type.resizing.start_mouse.x;
    const dy = p.y - w.type.resizing.start_mouse.y;

    const edge = w.type.resizing.edge;

    if (edge >> 0 & 1) {
        let target_width = w.type.resizing.start_size.x + dx;
        let ofx = Math.max(0, w.type.resizing.start_pos.x + w.type.resizing.start_size.x * 0.5 + dx - half_screen.x + SCREEN_MARGIN);
        target_width = clamp(target_width - ofx, w.min_size.x, w.max_size.x);
        let delta = target_width - w.type.resizing.start_size.x;
        w.size.x = target_width;
        w.pos.x = w.type.resizing.start_pos.x + delta * 0.5;
    }
    if (edge >> 1 & 1) {
        let new_width = w.type.resizing.start_size.x - dx;
        let ofx = Math.max(0, w.type.resizing.start_size.x * 0.5 - w.type.resizing.start_pos.x - dx - half_screen.x + SCREEN_MARGIN);
        new_width = clamp(new_width - ofx, w.min_size.x, w.max_size.x);
        const delta = new_width - w.type.resizing.start_size.x;
        w.size.x = new_width;
        w.pos.x = w.type.resizing.start_pos.x - delta * 0.5;
    }

    if (edge >> 2 & 1) {
        let new_height = w.type.resizing.start_size.y + dy;
        let ofy = Math.max(0, w.type.resizing.start_pos.y + w.type.resizing.start_size.y * 0.5 + dy - half_screen.y + SCREEN_MARGIN);
        new_height = clamp(new_height - ofy, w.min_size.y, w.max_size.y);
        const delta = new_height - w.type.resizing.start_size.y;
        w.size.y = new_height;
        w.pos.y = w.type.resizing.start_pos.y + delta * 0.5;
    }
    if (edge >> 3 & 1) {
        let new_height = w.type.resizing.start_size.y - dy;
        let ofy = Math.max(0, w.type.resizing.start_size.y * 0.5 - w.type.resizing.start_pos.y - dy - half_screen.y + SCREEN_MARGIN);
        new_height = clamp(new_height - ofy, w.min_size.y, w.max_size.y);
        const delta = new_height - w.type.resizing.start_size.y;
        w.size.y = new_height;
        w.pos.y = w.type.resizing.start_pos.y - delta * 0.5;

    }
}

function resizeEnd(w: FloatingWindow) {
    if (w.type.mode !== "floating") return;
    w.type.resizing = null;
    w.type.magnet = null;
    w.inactive_since = Date.now();
}



export function openFloating(entry: FloatingWindow) {
    WINDOWS.update((windows) => {
        if (windows[entry.id]) {
            shakeById(FLOATING_PREFIX + entry.id)
        } else {
            let z = entry.type.mode == "floating" ? Object.keys(windows).length : 1000;
            entry.z_index = z;
            windows[entry.id] = entry;
        }
        return windows;
    });

}

export function closeFloating(id: string){
    
    WINDOWS.update((windows) => {
        delete windows.id;
        delete windows[id];
        return windows;
    });
}

export function set_window_size(id: string, size: Vec2) {
    WINDOWS.update((windows) => {
        if (windows[id]) windows[id].size = size;
        return windows;
    });
}