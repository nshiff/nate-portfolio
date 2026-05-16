import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

// Utility to convert physical wavelength (nm) to an RGB color for the visualization
function wavelengthToRGB(wavelengthNm) {
    let R, G, B;
    if (wavelengthNm >= 380 && wavelengthNm < 440) {
        R = -(wavelengthNm - 440) / (440 - 380);
        G = 0.0;
        B = 1.0;
    } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
        R = 0.0;
        G = (wavelengthNm - 440) / (490 - 440);
        B = 1.0;
    } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
        R = 0.0;
        G = 1.0;
        B = -(wavelengthNm - 510) / (510 - 490);
    } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
        R = (wavelengthNm - 510) / (580 - 510);
        G = 1.0;
        B = 0.0;
    } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
        R = 1.0;
        G = -(wavelengthNm - 645) / (645 - 580);
        B = 0.0;
    } else if (wavelengthNm >= 645 && wavelengthNm <= 780) {
        R = 1.0;
        G = 0.0;
        B = 0.0;
    } else {
        R = 0.0; G = 0.0; B = 0.0;
    }

    // Intensity drop-off near vision limits
    let factor;
    if (wavelengthNm >= 380 && wavelengthNm < 420) {
        factor = 0.3 + 0.7 * (wavelengthNm - 380) / (420 - 380);
    } else if (wavelengthNm >= 420 && wavelengthNm < 700) {
        factor = 1.0;
    } else if (wavelengthNm >= 700 && wavelengthNm <= 780) {
        factor = 0.3 + 0.7 * (780 - wavelengthNm) / (780 - 700);
    } else {
        factor = 0.0;
    }

    return [R * factor, G * factor, B * factor];
}

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_wavelength; 
  uniform float u_slit_distance;
  uniform float u_slit_width;
  uniform vec3 u_color;

  #define PI 3.14159265359

  void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Correct for aspect ratio so waves remain circular
    float aspect = u_resolution.x / u_resolution.y;
    vec2 pos = vec2(uv.x * aspect, uv.y);

    // Layout variables
    float barrierX = 0.2 * aspect;
    float screenX = 0.85 * aspect;
    
    vec2 slit1 = vec2(barrierX, 0.5 + u_slit_distance / 2.0);
    vec2 slit2 = vec2(barrierX, 0.5 - u_slit_distance / 2.0);

    // Colors
    vec3 barrierColor = vec3(0.3, 0.3, 0.35);
    vec3 screenColor = vec3(0.5, 0.5, 0.5);
    vec3 bgColor = vec3(0.02, 0.02, 0.05);

    // --- SCREEN & INTENSITY GRAPH ---
    if (pos.x >= screenX) {
      // Distance from pixel on the screen to both slits
      float r1 = distance(vec2(screenX, pos.y), slit1);
      float r2 = distance(vec2(screenX, pos.y), slit2);

      // Time-averaged intensity I = I1 + I2 + 2*sqrt(I1*I2)*cos(phase_diff)
      float I1 = 1.0 / (r1 * 4.0 + 1.0);
      float I2 = 1.0 / (r2 * 4.0 + 1.0);
      float phase_diff = (r1 - r2) / u_wavelength * 2.0 * PI;
      
      // Calculate intensity profile
      float intensity = I1 + I2 + 2.0 * sqrt(I1 * I2) * cos(phase_diff);
      float displayInt = intensity * 1.5; // Visual scaling

      // Draw the graph outline and fill
      float graphBase = screenX + 0.02 * aspect;
      float graphVal = graphBase + displayInt * 0.08 * aspect;

      if (pos.x < graphVal) {
        gl_FragColor = vec4(u_color * 0.6, 1.0); // Fill
      } else if (pos.x < graphVal + 0.005) {
        gl_FragColor = vec4(u_color * 1.5, 1.0); // Line outline
      } else {
        gl_FragColor = vec4(bgColor + vec3(0.02), 1.0); // Graph Background
      }
      return;
    }

    // --- SCREEN BARRIER LINE ---
    if (abs(pos.x - screenX) < 0.005) {
      gl_FragColor = vec4(screenColor, 1.0);
      return;
    }

    // --- TWO SLIT BARRIER ---
    if (abs(pos.x - barrierX) < 0.01) {
      float d1 = abs(pos.y - slit1.y);
      float d2 = abs(pos.y - slit2.y);
      float halfSlit = u_slit_width / 2.0;
      if (d1 > halfSlit && d2 > halfSlit) {
        gl_FragColor = vec4(barrierColor, 1.0);
        return;
      }
    }

    // --- WAVE PROPAGATION SIMULATION ---
    float wave = 0.0;
    float k = 2.0 * PI / u_wavelength;
    float omega = 8.0; // Wave speed

    if (pos.x <= barrierX) {
      // Incoming plane wave before the barrier
      wave = sin(k * pos.x - omega * u_time);
    } else {
      // Interference of two spherical waves emerging from slits
      float r1 = distance(pos, slit1);
      float r2 = distance(pos, slit2);

      // Amplitude falls off as roughly 1/sqrt(r)
      float a1 = 1.0 / (sqrt(r1) * 3.0 + 1.0);
      float a2 = 1.0 / (sqrt(r2) * 3.0 + 1.0);

      wave = a1 * sin(k * r1 - omega * u_time) + 
             a2 * sin(k * r2 - omega * u_time);
    }

    // Map wave amplitude to the selected color
    // Emphasize peaks with the laser color, and let troughs fade nicely
    vec3 finalColor = mix(bgColor, u_color, clamp(wave, 0.0, 1.0));
    
    // Add a slight dark-blue tint to the negative troughs for depth
    finalColor += vec3(0.0, 0.05, 0.15) * clamp(-wave, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function DoubleSlitVisualization() {
    const canvasRef = useRef(null);

    // State for Physics Parameters
    const [wavelengthNm, setWavelengthNm] = useState(532); // Green laser default
    const [slitDistance, setSlitDistance] = useState(0.25);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(1.0);

    const paramsRef = useRef({ wavelengthNm, slitDistance, isPlaying, speed });

    // Update ref when state changes so animation loop always has latest values
    useEffect(() => {
        paramsRef.current = { wavelengthNm, slitDistance, isPlaying, speed };
    }, [wavelengthNm, slitDistance, isPlaying, speed]);

    // WebGL Initialization and Render Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        // Compile Shader Function
        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Setup Fullscreen Quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniform Locations
        const uResolution = gl.getUniformLocation(program, "u_resolution");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uWavelength = gl.getUniformLocation(program, "u_wavelength");
        const uSlitDistance = gl.getUniformLocation(program, "u_slit_distance");
        const uSlitWidth = gl.getUniformLocation(program, "u_slit_width");
        const uColor = gl.getUniformLocation(program, "u_color");

        let animationId;
        let time = 0;
        let lastTimestamp = performance.now();

        const resizeCanvas = () => {
            const displayWidth = canvas.clientWidth * window.devicePixelRatio;
            const displayHeight = canvas.clientHeight * window.devicePixelRatio;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        };

        const render = (timestamp) => {
            resizeCanvas();

            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            const currentParams = paramsRef.current;

            if (currentParams.isPlaying) {
                time += (deltaTime * 0.001) * currentParams.speed;
            }

            // Map parameters to shader friendly scales
            const scaledWavelength = currentParams.wavelengthNm / 10000.0;
            const colorRGB = wavelengthToRGB(currentParams.wavelengthNm);

            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform1f(uTime, time);
            gl.uniform1f(uWavelength, scaledWavelength);
            gl.uniform1f(uSlitDistance, currentParams.slitDistance);
            gl.uniform1f(uSlitWidth, 0.015);
            gl.uniform3f(uColor, colorRGB[0], colorRGB[1], colorRGB[2]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden">

            {/* Simulation Area */}
            <div className="flex-grow relative h-[50vh] md:h-screen">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full block bg-black"
                />

                {/* On-screen floating labels */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 opacity-70 pointer-events-none">
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Incoming Wave</div>
                </div>
                <div className="absolute top-4 right-4 md:top-8 md:right-32 opacity-70 pointer-events-none text-right">
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Interference Fringes</div>
                </div>
            </div>

            {/* Control Panel */}
            <div className="w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-auto md:h-screen overflow-y-auto">
                <div className="p-6 flex flex-col gap-8">

                    {/* Wave Control Section */}
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Wavelength (λ)</span>
                                <span className="font-mono bg-slate-800 px-2 py-1 rounded text-blue-300">{wavelengthNm} nm</span>
                            </div>
                            {/* Rainbow colored slider track to represent visible spectrum */}
                            <input
                                type="range"
                                min="380" max="750" step="1"
                                value={wavelengthNm}
                                onChange={(e) => setWavelengthNm(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: 'linear-gradient(to right, #7852FF 0%, #0000FF 15%, #00FFFF 35%, #00FF00 50%, #FFFF00 65%, #FFA500 80%, #FF0000 100%)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Barrier Control Section */}
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Slit Separation (d)</span>
                                <span className="font-mono bg-slate-800 px-2 py-1 rounded text-green-300">{slitDistance.toFixed(2)} mm</span>
                            </div>
                            <input
                                type="range"
                                min="0.08" max="0.5" step="0.01"
                                value={slitDistance}
                                onChange={(e) => setSlitDistance(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shadow-lg shadow-indigo-900/20"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                            </button>

                            <div className="flex-grow space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Slower</span>
                                    <span>Faster</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1" max="3.0" step="0.1"
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}