<script lang="ts">
    import { TITLEBAR_SIZE } from "$lib/consts.svelte";
    import { clamp, sleep } from "$lib/util.svelte";
    import { onDestroy } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import Floating from "./floating.svelte";
    const FLOATING_PREFIX = "floating_window_";
    export const FLOATING_CONTAINER_ID = "floating_container";

    type Vec2 = {x: number, y: number};
    const vec2 = (x: number, y: number): Vec2 => ({x, y});
    const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
    const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
    const mul = (a: Vec2, b: number): Vec2 => ({ x: a.x * b, y: a.y * b });
    const div = (a: Vec2, b: number): Vec2 => ({ x: a.x / b, y: a.y / b });
    const e2pos = (e: MouseEvent): Vec2 => ({ x: e.clientX, y: e.clientY });
    const length_squared = (v: Vec2): number => v.x * v.x + v.y * v.y;
    const length = (v: Vec2): number => Math.sqrt(length_squared(v));
    const is_zero = (v: Vec2): boolean => v.x == 0 && v.y == 0;
    const normalize = (v: Vec2): Vec2 => {let l = length(v); return div(v, l)};
    const normalize_or_zero = (v: Vec2): Vec2 => {let l = length(v); return l == 0 ? vec2(0, 0) : div(v, l)};
    const move_towards = (a: number, b: number, speed: number): number => Math.min(Math.max(a, b), a + (b - a) * speed);
    
    let half_screen = mul(vec2(window.innerWidth, (window.innerHeight - TITLEBAR_SIZE)), 0.5);
    



    let latest_resize = Date.now();
    const LATEST_RESIZE_DT = 100;
    window.addEventListener('resize', () => {
        let new_screen = vec2(window.innerWidth, window.innerHeight - TITLEBAR_SIZE);
        half_screen = mul(new_screen, 0.5);
        latest_resize = Date.now();
    });
    
    type TimedVec2 = {p: Vec2, t: number}


    type FloatingWindow = {
        dbg: string,
        pos: Vec2,
        target: Vec2,
        velocity: Vec2,
        size: Vec2,
        max_size: Vec2,
        min_size: Vec2,
        grabbed: null | [TimedVec2, TimedVec2],
        drag_offset: Vec2,
        inactive_since: number,
        magnet: null | Magnet,
        pinned: boolean,
        resizing: null | {
            edge: number,
            start_mouse: Vec2,
            start_size: Vec2,
            start_pos: Vec2,
        }
    }

    const DefaultWindow = {
        dbg: "",
        pos: vec2(0, 0),
        target: vec2(0, 0),
        velocity: vec2(0, 0),
        size: vec2(200, 150),
        max_size: vec2(5000, 5000),
        min_size: vec2(50, 50),
        grabbed: null,
        drag_offset: vec2(0, 0),
        inactive_since: 0,
        magnet: null,
        pinned: false,
        resizing: null
    }
    let windows : Record<string, FloatingWindow> = $state({
        dev: {
            ...DefaultWindow,
            size: vec2(200, 150),
            max_size: vec2(5000, 5000),
            min_size: vec2(50, 50),
        } as FloatingWindow,
        dev2: {
            ...DefaultWindow,
            size: vec2(200, 150),
            max_size: vec2(5000, 5000),
            min_size: vec2(50, 50),
        } as FloatingWindow
    });
    
    


    function handleMouseDown(e: MouseEvent, w: FloatingWindow, id: string) {
        w.pinned = false;
        w.inactive_since = Date.now();
        let p = e2pos(e);
		w.drag_offset = sub(p, w.pos);
        w.target = sub(p, w.drag_offset);
        w.magnet = null;
        const now = Date.now();
        let timed = { p: p, t: now };
		w.grabbed = [timed, timed];
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
		if (w.grabbed) {
            let p = e2pos(e);
            const now = Date.now();
            w.grabbed[1] = { ...w.grabbed[0] };
            w.grabbed[0] = { p, t: now };
            w.target = sub(p, w.drag_offset);
		}
	}
    function handleMouseUp(e: MouseEvent, w: FloatingWindow) {
        if (w.grabbed) {
            const now = Date.now();
            const a = w.grabbed;
            const dt1 = a[0].t - a[1].t;
            const dt2 = now + 1 - a[0].t;
            const p = e2pos(e);
            const v1 = length(sub(a[0].p, a[1].p)) / dt1;
            const v2 = length(sub(p, a[0].p)) / dt2;
            const acceleration = v2 - v1;
            w.pinned = Math.abs(acceleration) < 1.0
    		w.grabbed = null;
        }
		window.removeEventListener("mousemove", (e: MouseEvent) => {handleMouseMove(e, w)});
		window.removeEventListener("mouseup", (e: MouseEvent) => {handleMouseUp(e, w)});
	}

    let latest_dt = Date.now();
    const wrapped_dt = () : number => {
        let dt = Math.min(250, Date.now() - latest_dt);
        latest_dt = Date.now();
        return dt / 1000.0;
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

    async function tick_windows() {
        let dt = wrapped_dt();

        let now = Date.now();
        let is_resizing = now - latest_resize < LATEST_RESIZE_DT;
        for (var [id, w] of Object.entries(windows)) {
            let is_sleeping = Date.now() - w.inactive_since > SLEEP_DT;
            if (is_sleeping && !is_resizing) { 
                continue;
            }

            let half_size = mul(w.size, 0.5);

            const min_x = half_size.x + SCREEN_MARGIN - half_screen.x;
            const min_y = half_size.y + SCREEN_MARGIN - half_screen.y;
            const max_x = half_screen.x - half_size.x - SCREEN_MARGIN;
            const max_y = half_screen.y - half_size.y - SCREEN_MARGIN;

            let is_bound_x_min = (v: number) : boolean => v < min_x;
            let is_bound_x_max = (v: number) : boolean => v > max_x;
            let is_bound_y_min = (v: number) : boolean => v < min_y;
            let is_bound_y_max = (v: number) : boolean => v > max_y;

            if (w.grabbed != null || w.pinned) {
                
                w.velocity = sub(w.velocity, mul(w.velocity, dt * 15.0));
                if (w.pinned) {
                    if (is_bound_x_min(w.pos.x)) w.target.x = min_x;
                    if (is_bound_x_max(w.pos.x)) w.target.x = max_x;
                    if (is_bound_y_min(w.pos.y)) w.target.y = min_y;
                    if (is_bound_y_max(w.pos.y)) w.target.y = max_y;
                }
                let pos_dt = sub(w.target, w.pos);
                let target_dir = normalize_or_zero(pos_dt);
                let target_l = length(pos_dt);
                if (length_squared(w.velocity) < MAX_SPEED * MAX_SPEED)
                    w.velocity = add(w.velocity, mul(target_dir, target_l * ACCELERATION * dt));
            } else {
                if (w.magnet == null) {w.velocity = sub(w.velocity, mul(w.velocity, dt * 2.0))};
                let x_max = is_bound_x_max(w.pos.x);
                let x_min = is_bound_x_min(w.pos.x);
                let y_max = is_bound_y_max(w.pos.y);
                let y_min = is_bound_y_min(w.pos.y);
            
                if (x_min) w.magnet = magnet_left(w.magnet);
                if (y_min) w.magnet = magnet_top(w.magnet);
                if (x_max) w.magnet = magnet_right(w.magnet);
                if (y_max) w.magnet = magnet_bottom(w.magnet);
                if (w.magnet) {
                    w.velocity.x = w.velocity.x - (w.velocity.x * dt * (w.magnet.x == 0 ? 3.0 : 15.0))
                    w.velocity.y = w.velocity.y - (w.velocity.y * dt * (w.magnet.y == 0 ? 3.0 : 15.0))

                    if (w.magnet.x == -1) {
                        w.target.x = min_x;
                        let x_dt = w.pos.x - w.target.x;
                        w.velocity.x = w.velocity.x - ( x_dt * dt * ARCHIMEDES_FORCE);
                    }
                    if (w.magnet.x == 1) {
                        w.target.x = max_x;
                        let x_dt = w.pos.x - w.target.x;
                        w.velocity.x = w.velocity.x - ( x_dt * dt * ARCHIMEDES_FORCE);
                    }
                    if (w.magnet.y == -1) {
                        w.target.y = min_y;
                        let y_dt = w.pos.y - w.target.y;
                        w.velocity.y = w.velocity.y - ( y_dt * dt * ARCHIMEDES_FORCE);
                    }
                    if (w.magnet.y == 1) {
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
            if (!is_zero(w.velocity) || w.grabbed != null) {
                w.inactive_since = now;
            }
            if (is_sleeping) {
                w.magnet = null
            }
        }
        tick = requestAnimationFrame(tick_windows)
    }
    tick = requestAnimationFrame(tick_windows)
    onDestroy (() => cancelAnimationFrame(tick));


    function handleResizeStart(e: MouseEvent, w: FloatingWindow, edge: number) {
        e.stopPropagation();
        e.preventDefault();
        const p = e2pos(e);
        w.resizing = {
            edge,
            start_mouse: p,
            start_size: { ...w.size },
            start_pos: { ...w.pos },
        };
        w.pinned = false;
        w.grabbed = null;
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
        if (!w.resizing) return;
        w.inactive_since = 0; // force sleep
        const dx = p.x - w.resizing.start_mouse.x;
        const dy = p.y - w.resizing.start_mouse.y;

        const edge = w.resizing.edge;

        if (edge >> 0 & 1) {
            let target_width = w.resizing.start_size.x + dx;
            let ofx = Math.max(0, w.resizing.start_pos.x + w.resizing.start_size.x * 0.5 + dx - half_screen.x + SCREEN_MARGIN);
            target_width = clamp(target_width - ofx, w.min_size.x, w.max_size.x);
            let delta = target_width - w.resizing.start_size.x;
            w.size.x = target_width;
            w.pos.x = w.resizing.start_pos.x + delta * 0.5;
        }
        if (edge >> 1 & 1) {
            let new_width = w.resizing.start_size.x - dx;
            let ofx = Math.max(0, w.resizing.start_size.x * 0.5 - w.resizing.start_pos.x - dx - half_screen.x + SCREEN_MARGIN);
            new_width = clamp(new_width - ofx, w.min_size.x, w.max_size.x);
            const delta = new_width - w.resizing.start_size.x;
            w.size.x = new_width;
            w.pos.x = w.resizing.start_pos.x - delta * 0.5;
        }

        if (edge >> 2 & 1) {
            let new_height = w.resizing.start_size.y + dy;
            let ofy = Math.max(0, w.resizing.start_pos.y + w.resizing.start_size.y * 0.5 + dy - half_screen.y + SCREEN_MARGIN);
            new_height = clamp(new_height - ofy, w.min_size.x, w.max_size.x);
            const delta = new_height - w.resizing.start_size.y;
            w.size.y = new_height;
            w.pos.y = w.resizing.start_pos.y + delta * 0.5;
        }
        if (edge >> 3 & 1) {
            let new_height = w.resizing.start_size.y - dy;
            let ofy = Math.max(0, w.resizing.start_size.y * 0.5 - w.resizing.start_pos.y - dy - half_screen.y + SCREEN_MARGIN);
            new_height = clamp(new_height - ofy, w.min_size.y, w.max_size.y);
            const delta = new_height - w.resizing.start_size.y;
            w.size.y = new_height;
            w.pos.y = w.resizing.start_pos.y - delta * 0.5;

        }
    }

    function resizeEnd(w: FloatingWindow) {
        w.resizing = null;
        w.magnet = null;
        w.inactive_since = Date.now();
    }

</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-screen vh absolute z-300 bottom-0 flex pointer-events-none" id={FLOATING_CONTAINER_ID}>
    {#each Object.entries(windows) as [id, w] (id)}
        <div 
            id="{FLOATING_PREFIX}{id}"
            class="absolute shadow-lg pointer-events-auto cursor-grab active:cursor-grabbing z-100 bg-[#FFF2] translate-x-[-50%] translate-y-[-50%]" 
            style="top: calc(50% + {w.pos.y}px); left: calc(50% + {w.pos.x}px); width: {w.size.x}px; height: {w.size.y}px;" onmousedown={(e) => {handleMouseDown(e, w, id)}}>

            <div class="absolute -top-2 w-full h-2 cursor-n-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1000)}></div>
            <div class="absolute -bottom-2 w-full h-2 cursor-s-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0100)}> </div>
            <div class="absolute -left-2 h-full w-2 cursor-w-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0010)}></div>
            <div class="absolute -right-2 h-full w-2 cursor-e-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0001)}></div>
            <div class="absolute -bottom-2 -right-2 w-2 h-2 cursor-nwse-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0101)}></div>
            <div class="absolute -top-2 -right-2 w-2 h-2 cursor-nesw-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1001)}></div>
            <div class="absolute -bottom-2 -left-2 w-2 h-2 cursor-nesw-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0110)}></div>
            <div class="absolute -top-2 -left-2 w-2 h-2 cursor-nwse-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1010)}></div>
        </div>
    {/each}
</div>