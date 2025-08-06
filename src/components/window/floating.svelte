<script lang="ts">
	import { onMount } from "svelte";
	let x = 100;
	let y = 100;
	let dragging = false;
	let offsetX = 0;
	let offsetY = 0;

	const snapTargets = [
		{ name: "top-left", x: 0, y: 0 },
		{ name: "top", x: 50, y: 0 },
		{ name: "top-right", x: 100, y: 0 },
		{ name: "left", x: 0, y: 50 },
		{ name: "center", x: 50, y: 50 },
		{ name: "right", x: 100, y: 50 },
		{ name: "bottom-left", x: 0, y: 100 },
		{ name: "bottom", x: 50, y: 100 },
		{ name: "bottom-right", x: 100, y: 100 }
	];

	function handleMouseDown(e: MouseEvent) {
		dragging = true;
		offsetX = e.clientX - x;
		offsetY = e.clientY - y;
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (dragging) {
			x = e.clientX - offsetX;
			y = e.clientY - offsetY;
		}
	}

	function handleMouseUp() {
		dragging = false;
		snapToClosest();
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	}

	function snapToClosest() {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const cx = x + width / 2;
		const cy = y + height / 2;

		let minDist = Infinity;
		let best = snapTargets[0];

		for (const target of snapTargets) {
			const tx = (target.x / 100) * vw;
			const ty = (target.y / 100) * vh;
			const dx = cx - tx;
			const dy = cy - ty;
			const dist = dx * dx + dy * dy;
			if (dist < minDist) {
				minDist = dist;
				best = target;
			}
		}

		x = (best.x / 100) * vw - width / 2;
		y = (best.y / 100) * vh - height / 2;
	}

	let width = 200;
	let height = 150;
    </script>

<style>
	.window {
		cursor: move;
		user-select: none;
	}
</style>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="window fixed bg-white border border-black shadow-lg z-100"
	style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"
	on:mousedown={handleMouseDown}
>
	<div class="p-2 font-bold bg-gray-200">Window Title</div>
	<div class="p-2">Window Content</div>
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="absolute bg-white border shadow-lg pointer-events-auto"
	style="left: {x}px; top: {y}px;"
	on:mousedown={handleMouseDown}
>
</div>