"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type HeroSceneProps = {
  theme: "golden" | "night";
};

function seededNoise(index: number) {
  const value = Math.sin(index * 91.731) * 43758.5453;
  return value - Math.floor(value);
}

function makeMountain(
  width: number,
  baseY: number,
  peakY: number,
  segments: number,
  color: string,
) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, baseY - 3);
  shape.lineTo(-width / 2, baseY);

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const envelope = Math.sin(progress * Math.PI);
    const ridge = Math.sin(progress * Math.PI * 5.1) * 0.2;
    const noise = (seededNoise(index + segments) - 0.5) * 0.34;
    shape.lineTo(
      -width / 2 + progress * width,
      baseY + envelope * peakY + ridge + noise,
    );
  }

  shape.lineTo(width / 2, baseY - 3);
  shape.closePath();

  return new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color, transparent: true }),
  );
}

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255, 245, 210, 0.9)");
    gradient.addColorStop(0.28, "rgba(255, 215, 150, 0.42)");
    gradient.addColorStop(1, "rgba(255, 190, 120, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }

  return new THREE.CanvasTexture(canvas);
}

export function HeroScene({ theme }: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  const renderOnceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    renderOnceRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 30);
    camera.position.z = 10;

    const starPositions = new Float32Array(320 * 3);
    for (let index = 0; index < 320; index += 1) {
      starPositions[index * 3] = (seededNoise(index * 3) - 0.5) * 18;
      starPositions[index * 3 + 1] = seededNoise(index * 3 + 1) * 8 - 0.5;
      starPositions[index * 3 + 2] = seededNoise(index * 3 + 2) * 3;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.position.z = -2;
    scene.add(stars);

    const glowTexture = makeGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffd59d,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(4.4, 4.4, 1);
    glow.position.set(3.2, 2.1, -1);
    scene.add(glow);

    const orbMaterial = new THREE.MeshBasicMaterial({ color: 0xffe0a8 });
    const orb = new THREE.Mesh(new THREE.CircleGeometry(0.78, 64), orbMaterial);
    orb.position.set(3.2, 2.1, -0.8);
    scene.add(orb);

    const mountains = [
      makeMountain(18, -2.15, 3.6, 18, "#814437"),
      makeMountain(20, -2.55, 3.25, 22, "#60342f"),
      makeMountain(22, -3.05, 2.85, 26, "#422827"),
    ];
    mountains[0].position.z = 0;
    mountains[1].position.z = 1;
    mountains[2].position.z = 2;
    mountains.forEach((mountain) => scene.add(mountain));

    const goldenMountainColors = [0x814437, 0x60342f, 0x422827].map(
      (color) => new THREE.Color(color),
    );
    const nightMountainColors = [0x20294e, 0x141a35, 0x090d1c].map(
      (color) => new THREE.Color(color),
    );
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let lastFrame = 0;

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      const aspect = clientWidth / clientHeight;
      const vertical = 5;
      camera.left = -vertical * aspect;
      camera.right = vertical * aspect;
      camera.top = vertical;
      camera.bottom = -vertical;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const renderScene = (time = performance.now(), snap = false) => {
      const isNight = themeRef.current === "night";
      const blend = snap ? 1 : 0.035;
      pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.035);

      starMaterial.opacity = THREE.MathUtils.lerp(
        starMaterial.opacity,
        isNight ? 0.92 : 0,
        blend,
      );
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        isNight ? 0.34 : 0.88,
        blend,
      );
      glowMaterial.color.lerp(new THREE.Color(isNight ? 0xaec5ff : 0xffd59d), blend);
      orbMaterial.color.lerp(new THREE.Color(isNight ? 0xe6ecff : 0xffe0a8), blend);
      orb.position.y = THREE.MathUtils.lerp(orb.position.y, isNight ? 2.55 : 2.1, blend);
      glow.position.y = orb.position.y;

      stars.rotation.z = reduceMotion ? 0 : time * 0.000018;
      stars.position.x = pointer.x * -0.12;
      stars.position.y = pointer.y * 0.08;

      mountains.forEach((mountain, index) => {
        const material = mountain.material as THREE.MeshBasicMaterial;
        material.color.lerp(
          isNight ? nightMountainColors[index] : goldenMountainColors[index],
          blend,
        );
        mountain.position.x = pointer.x * (0.08 + index * 0.05);
        mountain.position.y = reduceMotion
          ? 0
          : Math.sin(time * 0.00022 + index * 0.9) * (0.025 + index * 0.012);
      });

      camera.position.x = pointer.x * 0.1;
      camera.position.y = pointer.y * -0.06;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const animate = (time: number) => {
      animationFrame = window.requestAnimationFrame(animate);
      if (time - lastFrame < 32) return;
      lastFrame = time;
      renderScene(time);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      renderScene(performance.now(), true);
    });

    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    renderScene(performance.now(), true);
    renderOnceRef.current = () => renderScene(performance.now(), reduceMotion);
    if (!reduceMotion) animationFrame = window.requestAnimationFrame(animate);
    canvas.classList.add("is-ready");

    return () => {
      window.cancelAnimationFrame(animationFrame);
      canvas.classList.remove("is-ready");
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      renderOnceRef.current = null;
      starGeometry.dispose();
      starMaterial.dispose();
      glowTexture.dispose();
      glowMaterial.dispose();
      orb.geometry.dispose();
      orbMaterial.dispose();
      mountains.forEach((mountain) => {
        mountain.geometry.dispose();
        (mountain.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-scene"
      aria-hidden="true"
    />
  );
}
