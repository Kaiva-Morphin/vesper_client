<script lang='ts'>
	import { WebGlShader } from "svader";
    const shaderCode = `#version 300 es
        precision highp float;

        out vec4 fragColor;

        uniform vec2 u_resolution;
        uniform vec2 u_offset;
		uniform float u_time;
		uniform vec4 u_color;


        void main() {
            vec2 pos = gl_FragCoord.xy + u_offset;
            vec2 st = pos / u_resolution;
            fragColor = vec4(st, 0.0, 1.0);
        }
    `;

    

	var color : [number, number, number, number] = $state([1., 1., 1., 1.]);
</script>

<WebGlShader
    width="500px"
    height="500px"
    code={shaderCode}
    parameters={[
        { name: "u_resolution", value: "resolution" },
        { name: "u_offset", value: "offset" },
        { name: "u_time", value: "time" },
        { name: "u_color", type: "vec4", value: color },
    ]}
>
    <div class="fallback">WebGL not supported in this environment.</div>
</WebGlShader>