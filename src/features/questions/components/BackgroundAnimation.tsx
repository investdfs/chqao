import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Inicializando animação Three.js");

    // Setup com alpha: true para transparência
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, 300);
    renderer.setClearColor(0x000000, 0); // Fundo transparente
    containerRef.current.appendChild(renderer.domElement);

    // Criar partículas com alta densidade
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000; // Aumentado número de partículas
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20; // Maior área de distribuição
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material otimizado para melhor visibilidade
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08, // Partículas maiores
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 8; // Câmera mais distante para ver mais partículas

    // Mouse movement handler
    const onMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation com rotação mais suave
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;

      // Movimento suave baseado no mouse
      particlesMesh.rotation.x += (mousePosition.current.y * 0.3 - particlesMesh.rotation.x) * 0.05;
      particlesMesh.rotation.y += (mousePosition.current.x * 0.3 - particlesMesh.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler otimizado
    const handleResize = () => {
      camera.aspect = window.innerWidth / 300;
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
      className="absolute top-0 left-0 w-full h-[300px] pointer-events-none overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.15), transparent)',
        zIndex: 0
      }}
    />
  );
};

export default BackgroundAnimation;