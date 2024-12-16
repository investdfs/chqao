import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BackgroundAnimationProps {
  height?: number;
}

const BackgroundAnimation = ({ height = 800 }: BackgroundAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    const gridSize = 20;
    const spacing = 2.5;
    const points3D = [];

    // Material mais sutil para os pontos
    const pointGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const pointMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.3
    });

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, 0);
        scene.add(point);
        points3D.push(point);
      }
    }

    // Material mais sutil para as linhas
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.1
    });

    const connectPoints = () => {
      scene.children = scene.children.filter(child => child instanceof THREE.Mesh);

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

    // Função para atualizar a posição do mouse normalizada
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animação dos pontos
    const animate = () => {
      requestAnimationFrame(animate);

      // Movimento suave dos pontos baseado na posição do mouse
      points3D.forEach((point) => {
        const distanceFromCenter = new THREE.Vector2(point.position.x, point.position.y).length();
        const influence = Math.max(0, 1 - distanceFromCenter / gridSize);
        
        point.position.z = Math.sin(Date.now() * 0.001 + distanceFromCenter) * 0.2;
        
        // Adiciona um leve movimento em direção ao mouse
        point.position.x += (mousePosition.x * influence * 0.01);
        point.position.y += (mousePosition.y * influence * 0.01);
        
        // Restaura a posição original gradualmente
        point.position.x *= 0.99;
        point.position.y *= 0.99;
      });

      connectPoints();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = window.innerWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log("Limpando animação Three.js");
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [height, mousePosition]);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ 
        height: `${height}px`,
        background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.03), transparent)',
        zIndex: 10
      }}
    />
  );
};

export default BackgroundAnimation;