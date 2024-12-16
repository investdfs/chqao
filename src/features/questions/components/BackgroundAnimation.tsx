import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BackgroundAnimationProps {
  height?: number;
}

const BackgroundAnimation = ({ height = 300 }: BackgroundAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Inicializando animação Three.js com efeito de mira");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Criar círculos concêntricos para o efeito de mira
    const circles: THREE.Line[] = [];
    const numCircles = 3;
    
    for (let i = 0; i < numCircles; i++) {
      const radius = (i + 1) * 2;
      const segments = 32;
      const circleGeometry = new THREE.BufferGeometry();
      const positions = [];
      
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        positions.push(
          Math.cos(theta) * radius,
          Math.sin(theta) * radius,
          0
        );
      }
      
      circleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      
      const circleMaterial = new THREE.LineBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.2 - (i * 0.05)
      });
      
      const circle = new THREE.Line(circleGeometry, circleMaterial);
      circles.push(circle);
      scene.add(circle);
    }

    // Adicionar linhas cruzadas (crosshair)
    const crosshairMaterial = new THREE.LineBasicMaterial({
      color: 0xFF0000,
      transparent: true,
      opacity: 0.15
    });

    const crosshairSize = 8;
    const crosshairGeometryH = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-crosshairSize, 0, 0),
      new THREE.Vector3(crosshairSize, 0, 0)
    ]);
    const crosshairGeometryV = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -crosshairSize, 0),
      new THREE.Vector3(0, crosshairSize, 0)
    ]);

    const crosshairH = new THREE.Line(crosshairGeometryH, crosshairMaterial);
    const crosshairV = new THREE.Line(crosshairGeometryV, crosshairMaterial);
    scene.add(crosshairH);
    scene.add(crosshairV);

    camera.position.z = 15;

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotação suave dos círculos
      circles.forEach((circle, index) => {
        circle.rotation.z += 0.001 * (index + 1);
      });

      // Movimento suave do crosshair seguindo o mouse
      const targetX = mousePosition.current.x * 2;
      const targetY = mousePosition.current.y * 2;
      
      crosshairH.position.x += (targetX - crosshairH.position.x) * 0.1;
      crosshairH.position.y += (targetY - crosshairH.position.y) * 0.1;
      crosshairV.position.x += (targetX - crosshairV.position.x) * 0.1;
      crosshairV.position.y += (targetY - crosshairV.position.y) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, height);
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
  }, [height]);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ 
        height: `${height}px`,
        background: 'linear-gradient(to bottom, rgba(255, 0, 0, 0.05), transparent)',
        zIndex: 10
      }}
    />
  );
};

export default BackgroundAnimation;