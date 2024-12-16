import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Inicializando animação Three.js");

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, 300);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Criar partículas com mais densidade e tamanho
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000; // Aumentado número de partículas
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10; // Aumentado espaço de distribuição
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material com partículas mais visíveis
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02, // Aumentado tamanho das partículas
      color: 0x8B5CF6,
      transparent: true,
      opacity: 1, // Aumentada opacidade ao máximo
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 4; // Ajustada posição da câmera para melhor visualização

    // Mouse movement handler
    const onMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.002; // Aumentada velocidade de rotação
      particlesMesh.rotation.y += 0.002;

      // Movimento mais suave e amplo baseado na posição do mouse
      particlesMesh.rotation.x += (mousePosition.current.y * 0.5 - particlesMesh.rotation.x) * 0.05;
      particlesMesh.rotation.y += (mousePosition.current.x * 0.5 - particlesMesh.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 300);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
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
      className="absolute top-0 left-0 w-full h-[300px] pointer-events-none"
      style={{ 
        background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.3), transparent)',
        zIndex: 0
      }}
    />
  );
};

export default BackgroundAnimation;