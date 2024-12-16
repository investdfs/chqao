import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Inicializando animação Three.js");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, 300);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Aumentando drasticamente o número de partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 8000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      // Reduzindo a área de distribuição para concentrar mais as partículas
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Ajustando material para máxima visibilidade
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15, // Partículas bem maiores
      color: 0xFFFFFF, // Cor branca para maior contraste
      transparent: true,
      opacity: 1, // Opacidade máxima
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Aproximando a câmera para ver melhor as partículas
    camera.position.z = 5;

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Aumentando a velocidade da rotação
      particlesMesh.rotation.x += 0.002;
      particlesMesh.rotation.y += 0.002;

      // Movimento mais pronunciado com o mouse
      particlesMesh.rotation.x += (mousePosition.current.y * 0.5 - particlesMesh.rotation.x) * 0.1;
      particlesMesh.rotation.y += (mousePosition.current.x * 0.5 - particlesMesh.rotation.y) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / 300;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log("Limpando animação Three.js");
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full h-[300px] pointer-events-none overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.3), transparent)',
        zIndex: 0
      }}
    />
  );
};

export default BackgroundAnimation;