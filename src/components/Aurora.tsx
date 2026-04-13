import { listen } from "@tauri-apps/api/event";

const canvas = document.getElementById("aurora") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;

const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0, 1); }
      `;

      const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;

      vec3 palette(float t) {
          return 0.5 + 0.5 * cos(6.28 * (t + vec3(0.0, 0.33, 0.67)));
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_res;
          float t = u_time * 0.3;
          vec3 col = vec3(0.0);
          
          for (int i = 0; i < 5; i++) {
              float fi = float(i);
              vec2 center = vec2(
                  0.5 + 0.4 * sin(t * 0.7 + fi * 1.3),
                  0.5 + 0.4 * cos(t * 0.5 + fi * 2.1)
              );
              float dist = length(uv - center);
              float blob = exp(-dist * dist * 4.0);
              col += blob * palette(fi * 0.2 + t * 0.1);
          }
          
          col = pow(col * 0.15, vec3(1.2));
          gl_FragColor = vec4(col, 1.0);
      }
      `;

        function compile(type: number, src: string): WebGLShader {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
        }

      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

      const pos = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uTime = gl.getUniformLocation(prog, 'u_time');
      const uRes = gl.getUniformLocation(prog, 'u_res');

      function resize() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.uniform2f(uRes, canvas.width, canvas.height);
      }

      window.addEventListener('resize', resize);
      window.addEventListener('load', resize);
      resize();

    let rafId: number;

    function loop(t: number) {
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafId = requestAnimationFrame(loop);
    }

    listen("tauri://focus", () => { rafId = requestAnimationFrame(loop); });
    listen("tauri://blur", () => { cancelAnimationFrame(rafId); });

    rafId = requestAnimationFrame(loop);