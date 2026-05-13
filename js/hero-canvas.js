/* =========================================================================
   KHA MARINE — HERO CANVAS (lightweight WebGL shimmer)
   ------------------------------------------------------------------------
   A very subtle ocean-light fragment shader, ~1KB of GLSL, single quad,
   slow time uniform. If WebGL is unavailable, this script does nothing —
   the CSS gradient under .hero-bg already looks complete.
   ------------------------------------------------------------------------
   To DISABLE entirely: remove the <canvas class="hero-canvas"> tag and
   the <script src="js/hero-canvas.js"> reference from your hero pages.
   To make MORE subtle: lower OPACITY in styles.css (.hero-canvas) or
   slow TIME_SCALE below.
   ========================================================================= */

(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 680px)').matches;
  if (isMobile) return;            // skip on small screens for perf

  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  // Try WebGL. Bail out gracefully if not supported.
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, alpha: true })
          || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const TIME_SCALE = 0.00012;      // slow & meditative

  /* ---------- Shaders -------------------------------------------------- */
  const vertSrc = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  // Cheap layered noise -> subtle "caustic-like" shimmer
  const fragSrc = `
    precision mediump float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform vec3  u_a;
    uniform vec3  u_b;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
      float t = u_time * 0.5;
      float n =
        noise(uv * 1.4 + vec2(t * 0.20, -t * 0.15)) * 0.55 +
        noise(uv * 3.0 + vec2(-t * 0.10,  t * 0.20)) * 0.30 +
        noise(uv * 6.5 + vec2( t * 0.07, -t * 0.05)) * 0.15;
      n = pow(n, 1.6);
      vec3 col = mix(u_a, u_b, n);
      float vig = smoothstep(1.4, 0.2, length(uv));
      gl_FragColor = vec4(col, vig * (0.55 + 0.45 * n));
    }
  `;

  function compile(src, type) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  const vs = compile(vertSrc, gl.VERTEX_SHADER);
  const fs = compile(fragSrc, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  /* ---------- Geometry: fullscreen quad -------------------------------- */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes  = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uA    = gl.getUniformLocation(prog, 'u_a');
  const uB    = gl.getUniformLocation(prog, 'u_b');

  /* ---------- Theme color sampling ------------------------------------- */
  function hexToRgb(hex) {
    hex = hex.trim();
    if (hex.startsWith('#')) hex = hex.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255
    ];
  }

  function colorFromCSS(varName, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!v) return fallback;
    if (v.startsWith('#')) return hexToRgb(v);
    return fallback;
  }

  let colA = [0.05, 0.10, 0.20];
  let colB = [0.29, 0.62, 1.00];

  function refreshColors() {
    colA = colorFromCSS('--bg-deep', colA);
    colB = colorFromCSS('--accent', colB);
  }
  refreshColors();
  window.addEventListener('khathemechange', refreshColors);

  /* ---------- Resize handling ------------------------------------------ */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = canvas.clientWidth | 0;
    const h = canvas.clientHeight | 0;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }
  window.addEventListener('resize', resize, { passive: true });

  /* ---------- Visibility throttling ------------------------------------ */
  let visible = true;
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
  });

  /* ---------- Frame loop ----------------------------------------------- */
  let frame = 0;
  function tick(now) {
    if (visible && !reduce) {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * TIME_SCALE);
      gl.uniform3f(uA, colA[0], colA[1], colA[2]);
      gl.uniform3f(uB, colB[0], colB[1], colB[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    frame = requestAnimationFrame(tick);
  }

  if (reduce) {
    // Render a single static frame, then stop.
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, 0);
    gl.uniform3f(uA, colA[0], colA[1], colA[2]);
    gl.uniform3f(uB, colB[0], colB[1], colB[2]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } else {
    frame = requestAnimationFrame(tick);
  }
})();
