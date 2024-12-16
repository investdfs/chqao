import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BackgroundAnimationProps {
  height?: number;
}

const BackgroundAnimation = ({ height = 300 }: BackgroundAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Inicializando animação Three.js com efeito de grade tecnológica");

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

    // Criar pontos para a grade
    const gridSize = 15;
    const spacing = 2;
    const points = [];
    const pointGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x8B5CF6 });
    const points3D = [];

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, 0);
        scene.add(point);
        points3D.push(point);
        points.push(new THREE.Vector3(x, y, 0));
      }
    }

    // Criar linhas de conexão
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.2
    });

    const connectPoints = () => {
      // Remover linhas antigas
      scene.children = scene.children.filter(child => child instanceof THREE.Mesh);

      // Conectar pontos próximos
      points3D.forEach((point, i) => {
        points3D.forEach((otherPoint, j) => {
          if (i !== j) {
            const distance = point.position.distanceTo(otherPoint.position);
            if (distance < spacing * 2) {
              const geometry = new THREE.BufferGeometry().setFromPoints([
                point.position,
                otherPoint.position
              ]);
              const line = new THREE.Line(geometry, linesMaterial);
              scene.add(line);
            }
          }
        });
      });
    };

    camera.position.z = 20;

    // Animação dos pontos
    const animate = () => {
      requestAnimationFrame(animate);

      // Mover pontos suavemente
      points3D.forEach((point) => {
        point.position.z = Math.sin(Date.now() * 0.001 + point.position.x + point.position.y) * 0.5;
      });

      connectPoints();
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
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ 
        height: `${height}px`,
        background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.05), transparent)',
        zIndex: 10
      }}
    />
  );
};

export default BackgroundAnimation;