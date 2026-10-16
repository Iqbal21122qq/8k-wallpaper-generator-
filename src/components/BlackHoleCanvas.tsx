import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { BlackHoleSettings } from '../lib/types';

export interface BlackHoleCanvasRef {
  captureSnapshot: (width?: number, height?: number) => Promise<Blob | null>;
  startRecording: (durationMs: number, onProgress?: (pct: number) => void) => Promise<Blob>;
  isRecording: () => boolean;
}

interface Props {
  settings: BlackHoleSettings;
  uploadedImage: string | null;
  aspectRatio: '9:16' | '16:9';
  className?: string;
}

interface Particle {
  radius: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  z: number;
  hueShift: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
}

export const BlackHoleCanvas = forwardRef<BlackHoleCanvasRef, Props>(({
  settings,
  uploadedImage,
  aspectRatio,
  className = '',
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isRecordingRef = useRef(false);

  // Particles & Stars state
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const userImageObjRef = useRef<HTMLImageElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });

  // Load uploaded image if provided
  useEffect(() => {
    if (uploadedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        userImageObjRef.current = img;
      };
      img.src = uploadedImage;
    } else {
      userImageObjRef.current = null;
    }
  }, [uploadedImage]);

  // Initialize Stars
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
      });
    }
    starsRef.current = stars;
  }, []);

  // Initialize Particles based on settings
  useEffect(() => {
    const count = Math.min(settings.particleDensity, 1200);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.5) * 360 + 75; // distributed from inner horizon to outer disk
      particles.push({
        radius: r,
        angle: Math.random() * Math.PI * 2,
        speed: (180 / Math.sqrt(r)) * 0.012, // Keplerian orbital velocity ~ 1/sqrt(r)
        size: Math.random() * 3.5 + 0.8,
        opacity: Math.random() * 0.7 + 0.3,
        z: (Math.random() - 0.5) * 35,
        hueShift: Math.random() * 20 - 10,
      });
    }
    particlesRef.current = particles;
  }, [settings.particleDensity]);

  // Color theme generator
  const getColors = (theme: BlackHoleSettings['colorTheme'], alpha = 1) => {
    switch (theme) {
      case 'monochrome':
        return {
          coreGlow: `rgba(255, 255, 255, ${alpha})`,
          diskInner: `rgba(255, 255, 255, ${alpha * 0.95})`,
          diskOuter: `rgba(180, 195, 215, ${alpha * 0.35})`,
          jet: `rgba(255, 255, 255, ${alpha * 0.85})`,
          dust: `rgba(140, 150, 170, ${alpha * 0.25})`,
          photonRing: `rgba(255, 255, 255, ${alpha})`,
        };
      case 'gargantua':
        return {
          coreGlow: `rgba(255, 230, 170, ${alpha})`,
          diskInner: `rgba(255, 200, 110, ${alpha * 0.95})`,
          diskOuter: `rgba(255, 120, 30, ${alpha * 0.4})`,
          jet: `rgba(255, 240, 200, ${alpha * 0.9})`,
          dust: `rgba(200, 90, 20, ${alpha * 0.3})`,
          photonRing: `rgba(255, 255, 240, ${alpha})`,
        };
      case 'cyan':
        return {
          coreGlow: `rgba(180, 255, 255, ${alpha})`,
          diskInner: `rgba(90, 230, 255, ${alpha * 0.95})`,
          diskOuter: `rgba(20, 130, 220, ${alpha * 0.4})`,
          jet: `rgba(200, 255, 255, ${alpha * 0.9})`,
          dust: `rgba(30, 180, 255, ${alpha * 0.3})`,
          photonRing: `rgba(240, 255, 255, ${alpha})`,
        };
      case 'violet':
        return {
          coreGlow: `rgba(240, 200, 255, ${alpha})`,
          diskInner: `rgba(210, 120, 255, ${alpha * 0.95})`,
          diskOuter: `rgba(140, 40, 230, ${alpha * 0.4})`,
          jet: `rgba(250, 220, 255, ${alpha * 0.9})`,
          dust: `rgba(170, 60, 255, ${alpha * 0.3})`,
          photonRing: `rgba(255, 235, 255, ${alpha})`,
        };
      case 'crimson':
        return {
          coreGlow: `rgba(255, 190, 190, ${alpha})`,
          diskInner: `rgba(255, 70, 70, ${alpha * 0.95})`,
          diskOuter: `rgba(180, 20, 30, ${alpha * 0.4})`,
          jet: `rgba(255, 210, 210, ${alpha * 0.9})`,
          dust: `rgba(220, 40, 50, ${alpha * 0.3})`,
          photonRing: `rgba(255, 220, 220, ${alpha})`,
        };
    }
  };

  // Render procedure
  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    scale = 1
  ) => {
    const colors = getColors(settings.colorTheme);
    const cx = width / 2 + mouseRef.current.x * 20 * scale;
    const cy = height / 2 + mouseRef.current.y * 20 * scale;
    const baseRadius = (Math.min(width, height) * 0.17) * scale;
    const eventHorizonRadius = baseRadius;
    const photonRingRadius = baseRadius * 1.18;

    // Smooth mouse interpolation
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

    // 1. Clear background - deep cosmic black
    ctx.fillStyle = '#030407';
    ctx.fillRect(0, 0, width, height);

    // 2. Background image texture overlay if provided
    if (userImageObjRef.current) {
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.filter = settings.colorTheme === 'monochrome' ? 'grayscale(100%) contrast(150%)' : 'contrast(120%)';
      const img = userImageObjRef.current;
      const hRatio = width / img.width;
      const vRatio = height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - img.width * ratio) / 2;
      const centerShiftY = (height - img.height * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
      ctx.restore();
    }

    // 3. Cosmic Starfield with Gravitational Lensing Distortion
    if (settings.showStarfield) {
      ctx.save();
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        let sx = cx + star.x * scale;
        let sy = cy + star.y * scale;

        // Gravitational lensing deflection
        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > eventHorizonRadius * 0.9) {
          // Deflection angle ~ 4GM / (c^2 * r)
          const deflection = (eventHorizonRadius * eventHorizonRadius * settings.lensingStrength * 1.4) / (dist + 1);
          sx += (dx / dist) * deflection;
          sy += (dy / dist) * deflection;

          const twinkle = Math.sin(time * star.twinkleSpeed * 3 + i) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle * 0.8})`;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * scale * (dist < eventHorizonRadius * 2 ? 1.4 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 4. Cosmic Background Nebula Glow
    const nebulaGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, baseRadius * 4.5);
    nebulaGrad.addColorStop(0, colors.diskInner);
    nebulaGrad.addColorStop(0.3, colors.diskOuter);
    nebulaGrad.addColorStop(0.7, colors.dust);
    nebulaGrad.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = nebulaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Vertical Relativistic Jet (Cosmic Ray Beam matching the user's reference!)
    if (settings.showJet && settings.jetIntensity > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const jetTilt = -0.32; // Exact diagonal tilt angle matching the reference image!
      ctx.translate(cx, cy);
      ctx.rotate(jetTilt);

      // Jet core line and plasma clouds
      const jetLength = Math.max(width, height) * 1.4;
      const jetGrad = ctx.createLinearGradient(0, -jetLength, 0, jetLength);
      jetGrad.addColorStop(0, 'rgba(255,255,255,0)');
      jetGrad.addColorStop(0.15, colors.jet);
      jetGrad.addColorStop(0.48, 'rgba(255,255,255,0.95)');
      jetGrad.addColorStop(0.5, 'rgba(255,255,255,1)');
      jetGrad.addColorStop(0.52, 'rgba(255,255,255,0.95)');
      jetGrad.addColorStop(0.85, colors.jet);
      jetGrad.addColorStop(1, 'rgba(255,255,255,0)');

      // Draw tapered vertical jet beam
      ctx.fillStyle = jetGrad;
      ctx.beginPath();
      const jetWidthTop = 55 * scale * settings.jetIntensity;
      const jetWidthMid = 12 * scale * settings.jetIntensity;
      const jetWidthBottom = 48 * scale * settings.jetIntensity;

      // Top plume
      ctx.moveTo(-jetWidthTop, -jetLength);
      ctx.lineTo(jetWidthTop, -jetLength);
      ctx.lineTo(jetWidthMid, -baseRadius * 0.5);
      ctx.lineTo(-jetWidthMid, -baseRadius * 0.5);
      ctx.closePath();
      ctx.fill();

      // Bottom plume
      ctx.beginPath();
      ctx.moveTo(-jetWidthMid, baseRadius * 0.5);
      ctx.lineTo(jetWidthMid, baseRadius * 0.5);
      ctx.lineTo(jetWidthBottom, jetLength);
      ctx.lineTo(-jetWidthBottom, jetLength);
      ctx.closePath();
      ctx.fill();

      // Atmospheric lightning-like relativistic filaments
      for (let j = 0; j < 8; j++) {
        const offset = Math.sin(time * 0.08 + j * 1.2) * (14 + j * 4) * scale;
        const alpha = (0.35 - j * 0.03) * settings.jetIntensity;
        ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.05, alpha)})`;
        ctx.lineWidth = Math.max(1, (3 - j * 0.3) * scale);
        ctx.beginPath();
        ctx.moveTo(offset * 0.8, -jetLength * 0.85);
        ctx.bezierCurveTo(offset * 1.5, -jetLength * 0.4, -offset * 0.5, -baseRadius, 0, 0);
        ctx.bezierCurveTo(offset * 0.5, baseRadius, -offset * 1.2, jetLength * 0.4, -offset * 0.8, jetLength * 0.85);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 6. Gravitational Lensing Upper Warped Arc (Einstein Gravitational Halo)
    // The top part of the accretion disk warped over the top of the black hole
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const topArcGrad = ctx.createRadialGradient(cx, cy - baseRadius * 0.1, baseRadius * 0.9, cx, cy, baseRadius * 2.3);
    topArcGrad.addColorStop(0, 'rgba(255,255,255,0)');
    topArcGrad.addColorStop(0.3, colors.diskInner);
    topArcGrad.addColorStop(0.65, colors.diskOuter);
    topArcGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = topArcGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRadius * 1.9, baseRadius * 1.6, 0, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    ctx.restore();

    // 7. Relativistic Accretion Disk Swirling Particles (Keplerian orbits with Doppler beaming)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const particles = particlesRef.current;
    const diskTilt = 0.28; // 3D inclination angle of accretion disk

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // Increment angle with speed and spin modifier
      p.angle += p.speed * settings.spinSpeed * settings.accretionTurbulence;

      const cos = Math.cos(p.angle);
      const sin = Math.sin(p.angle);

      // 3D projection onto tilted plane
      const rx = p.radius * scale;
      const ry = p.radius * scale * diskTilt;
      const px = cx + cos * rx;
      const py = cy + sin * ry + p.z * scale;

      // Doppler boosting: approaching side (left side or cos < 0) is boosted in brightness
      let doppler = 1;
      if (settings.dopplerBoost) {
        doppler = 1 + (-sin) * 0.75; // relativistic beaming factor
      }

      // Hide particles behind the event horizon if in back
      const isBehind = sin < 0;
      const distFromCenter = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
      if (isBehind && distFromCenter < eventHorizonRadius * 0.95) {
        continue;
      }

      const pAlpha = Math.min(1, Math.max(0, p.opacity * doppler));
      const pSize = Math.max(0.6, p.size * scale * (1 + (p.radius / 400)));

      // Gradient color based on proximity to ISCO (inner edge is white-hot)
      const heatFraction = Math.max(0, 1 - (p.radius - 75) / 280);
      if (heatFraction > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
      } else {
        ctx.fillStyle = colors.diskInner.replace(/[\d\.]+\)$/, `${pAlpha})`);
      }

      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 8. Gravitational Lensing Bottom Warped Arc (Secondary inverted Einstein ring)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const botArcGrad = ctx.createRadialGradient(cx, cy + baseRadius * 0.1, baseRadius * 0.9, cx, cy, baseRadius * 1.8);
    botArcGrad.addColorStop(0, 'rgba(255,255,255,0)');
    botArcGrad.addColorStop(0.35, colors.diskInner);
    botArcGrad.addColorStop(0.7, colors.diskOuter);
    botArcGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = botArcGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRadius * 1.7, baseRadius * 0.95, 0, 0, Math.PI);
    ctx.fill();
    ctx.restore();

    // 9. Brilliant Photon Ring (Extreme gravitational focus where light loops the black hole)
    if (settings.showPhotonRing) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = colors.photonRing;
      ctx.shadowBlur = 24 * scale;

      // Ultra-bright razor-thin ring
      ctx.strokeStyle = colors.photonRing;
      ctx.lineWidth = 3.2 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, photonRingRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary diffuse halo
      ctx.lineWidth = 7 * scale;
      ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
      ctx.beginPath();
      ctx.arc(cx, cy, photonRingRadius * 1.03, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 10. The Event Horizon (Pure Absolute Black Void - Nothing escapes)
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, eventHorizonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Inner shadow edge
    const innerShadow = ctx.createRadialGradient(cx, cy, eventHorizonRadius * 0.85, cx, cy, eventHorizonRadius);
    innerShadow.addColorStop(0, 'rgba(0,0,0,1)');
    innerShadow.addColorStop(0.9, 'rgba(0,0,0,0.98)');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = innerShadow;
    ctx.beginPath();
    ctx.arc(cx, cy, eventHorizonRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 11. Front Crossing of Accretion Disk (Foreground horizon occlusion)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const fgGrad = ctx.createLinearGradient(cx - baseRadius * 2, cy, cx + baseRadius * 2, cy);
    if (settings.dopplerBoost) {
      // Approaching side is on left
      fgGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      fgGrad.addColorStop(0.2, colors.diskOuter);
      fgGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.95)');
      fgGrad.addColorStop(0.5, colors.diskInner);
      fgGrad.addColorStop(0.7, colors.diskOuter);
      fgGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      fgGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      fgGrad.addColorStop(0.3, colors.diskOuter);
      fgGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      fgGrad.addColorStop(0.7, colors.diskOuter);
      fgGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    ctx.fillStyle = fgGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRadius * 2.2, baseRadius * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const loop = (timestamp: number) => {
      const elapsed = (timestamp - startTime) * 0.001;

      // Handle canvas resize
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.floor(rect.width * dpr);
      const displayHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      renderFrame(ctx, canvas.width, canvas.height, elapsed, dpr);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [settings, aspectRatio]);

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Expose methods for snapshot capture & live video recording
  useImperativeHandle(ref, () => ({
    captureSnapshot: async (width = 2160, height = 3840) => {
      // True 8K / 4K offscreen render!
      // Default to 4K / 8K Mobile portrait resolution
      const targetW = aspectRatio === '9:16' ? width : height;
      const targetH = aspectRatio === '9:16' ? height : width;

      const offscreen = document.createElement('canvas');
      offscreen.width = targetW;
      offscreen.height = targetH;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return null;

      const scale = targetW / 450; // proportional scale
      renderFrame(offCtx, targetW, targetH, performance.now() * 0.001, scale);

      return new Promise<Blob | null>((resolve) => {
        offscreen.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    },

    startRecording: async (durationMs = 6000, onProgress) => {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not available');

      isRecordingRef.current = true;
      const stream = canvas.captureStream(60); // 60 FPS stream!
      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
        ? 'video/mp4;codecs=avc1'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 16000000, // 16 Mbps high quality
      });
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      return new Promise<Blob>((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
          if (onProgress) onProgress(pct);
        }, 150);

        recorder.onstop = () => {
          clearInterval(interval);
          isRecordingRef.current = false;
          const completeBlob = new Blob(chunks, { type: mimeType });
          resolve(completeBlob);
        };

        recorder.onerror = (e) => {
          clearInterval(interval);
          isRecordingRef.current = false;
          reject(e);
        };

        recorder.start();
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }, durationMs);
      });
    },

    isRecording: () => isRecordingRef.current,
  }));

  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full object-contain cursor-crosshair transition-transform duration-300"
      />
    </div>
  );
});

BlackHoleCanvas.displayName = 'BlackHoleCanvas';
