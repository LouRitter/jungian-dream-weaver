"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface DreamBackgroundProps {
  intensity?: number; // 0-1, controls number of particles and waves
  speed?: number; // 0-2, controls animation speed
  className?: string;
}

// Removed particle system - using simpler gradient glow approach

export default function DreamBackground({ 
  intensity = 0.7, 
  speed = 1.0,
  className = "absolute inset-0 z-[-1]"
}: DreamBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<{
    timeLocation: WebGLUniformLocation | null;
    resolutionLocation: WebGLUniformLocation | null;
    intensityLocation: WebGLUniformLocation | null;
    speedLocation: WebGLUniformLocation | null;
  } | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize WebGL shaders and program
  const initWebGL = (gl: WebGLRenderingContext) => {
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_intensity;
      uniform float u_speed;
      
      varying vec2 v_uv;
      
      // Noise function for organic movement
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Smooth noise
      float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // Fractal noise for complex patterns
      float fractalNoise(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * smoothNoise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      // HSV to RGB conversion
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        vec2 uv = v_uv;
        vec2 center = vec2(0.5, 0.5);
        
        // Create breathing gradient glow
        float time = u_time * u_speed;
        
        // Breathing effect - faster pulsing
        float breath = sin(time * 0.5) * 0.5 + 0.5;
        
        // Create radial gradient from center with breathing
        float dist = distance(uv, center);
        float radial = 1.0 - smoothstep(0.0, 0.6 + breath * 0.3, dist);
        
        // Add breathing glow
        float glow = exp(-dist * (2.0 + breath * 1.0)) * (0.5 + breath * 0.5);
        
        // Base gradient colors (even darker)
        vec3 baseColor1 = vec3(0.01, 0.02, 0.08); // Very deep navy
        vec3 baseColor2 = vec3(0.02, 0.01, 0.1); // Dark indigo  
        vec3 baseColor3 = vec3(0.03, 0.02, 0.12); // Dark purple
        
        // Accent colors (soft pink/blue)
        vec3 accent1 = vec3(0.8, 0.3, 0.9); // Soft pink
        vec3 accent2 = vec3(0.3, 0.6, 1.0); // Soft blue
        
        // Create base gradient
        vec3 color1 = mix(baseColor1, baseColor2, radial);
        vec3 color2 = mix(color1, baseColor3, breath);
        
        // Add breathing glow effect
        vec3 glowColor = mix(accent1, accent2, breath);
        color2 = mix(color2, glowColor, glow * 0.6 * u_intensity);
        
        // Add faster flowing patterns
        float flow = sin(uv.x * 2.0 + time * 0.6) * cos(uv.y * 1.5 + time * 0.4);
        flow = (flow + 1.0) * 0.5;
        vec3 flowColor = mix(accent1, accent2, flow);
        color2 = mix(color2, flowColor, flow * 0.3 * u_intensity);
        
        // Add faster noise texture
        float noise = fractalNoise(uv * 3.0 + time * 0.3);
        color2 += vec3(noise * 0.05) * u_intensity;
        
        // Add VCR grain (more visible)
        float grain = fract(sin(dot(uv * 200.0 + time * 0.05, vec2(12.9898, 78.233))) * 43758.5453);
        color2 += vec3(grain * 0.08) * u_intensity;
        
        // Add fine grain (more visible)
        float fineGrain = fract(sin(dot(uv * 500.0 + time * 0.02, vec2(12.9898, 78.233))) * 43758.5453);
        color2 += vec3(fineGrain * 0.05) * u_intensity;
        
        // Add subtle VCR scanlines
        float scanlines = sin(uv.y * 800.0) * 0.02;
        color2 += vec3(scanlines) * u_intensity * 0.05;
        
        // Add very subtle static noise
        float staticNoise = fract(sin(dot(uv + time * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
        staticNoise *= smoothstep(0.0, 0.1, fract(time * 0.1)) * 0.1;
        color2 += vec3(staticNoise) * u_intensity * 0.3;
        
        // Add intense vignetting
        float vignette = 1.0 - smoothstep(0.3, 1.0, length(uv - 0.5)) * 0.7;
        color2 *= vignette;
        
        // Ensure minimum brightness
        color2 = max(color2, vec3(0.05));
        
        // Final color output
        gl_FragColor = vec4(color2, 1.0);
      }
    `;

    // Compile shader
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return null;

    // Create program
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    // Create geometry (fullscreen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
    const speedLocation = gl.getUniformLocation(program, 'u_speed');

    // Set up geometry
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return {
      program,
      uniforms: {
        timeLocation,
        resolutionLocation,
        intensityLocation,
        speedLocation
      },
      positionLocation
    };
  };

  // Simple animation loop for breathing gradient
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = glRef.current;
    const program = programRef.current;
    const uniforms = uniformsRef.current;
    
    if (!gl || !program || !uniforms) return;

    timeRef.current += 0.016 * speed;
    
    // Render WebGL background
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(program);
    if (uniforms.timeLocation) gl.uniform1f(uniforms.timeLocation, timeRef.current);
    if (uniforms.resolutionLocation) gl.uniform2f(uniforms.resolutionLocation, canvas.width, canvas.height);
    if (uniforms.intensityLocation) gl.uniform1f(uniforms.intensityLocation, intensity);
    if (uniforms.speedLocation) gl.uniform1f(uniforms.speedLocation, speed);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    animationRef.current = requestAnimationFrame(animate);
  };


  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize component
  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;
    
    // Initialize WebGL
    const webglData = initWebGL(gl);
    if (!webglData) return;
    
    programRef.current = webglData.program;
    uniformsRef.current = webglData.uniforms;
    
    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    animate();
    setIsLoaded(true);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (programRef.current) {
        gl.deleteProgram(programRef.current);
      }
    };
  }, [isClient, intensity, speed, animate]);

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%)',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      
      {/* Floating orbs - only render on client to prevent hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(Math.floor(intensity * 30 + 20))].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{
              left: `${10 + (i * 7) % 80}%`, // Better distribution across screen
              top: `${10 + (i * 11) % 80}%`,
              filter: 'contrast(1.2) brightness(0.9) saturate(0.8)', // Vintage look
              boxShadow: '0 0 2px rgba(255,255,255,0.3)', // Subtle glow
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * 15, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.8, 0.8],
            }}
            transition={{
              duration: 4 + (i % 4) * 1.5, // Longer duration for more overlap
              repeat: Infinity,
              delay: (i % 8) * 0.3, // More staggered delays
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}
