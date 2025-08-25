'use client';

import { useState, useRef } from 'react';
import { ReactNode } from 'react';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaY = startY - currentY;
    const threshold = 50;
    
    if (deltaY > threshold) {
      setIsExpanded(true);
    } else if (deltaY < -threshold) {
      setIsExpanded(false);
    }
    
    setCurrentY(0);
    setStartY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaY = startY - currentY;
    const threshold = 50;
    
    if (deltaY > threshold) {
      setIsExpanded(true);
    } else if (deltaY < -threshold) {
      setIsExpanded(false);
    }
    
    setCurrentY(0);
    setStartY(0);
  };

  const getTransform = () => {
    if (isDragging) {
      const deltaY = Math.min(0, startY - currentY);
      const baseTransform = isExpanded ? -50 : 0;
      return `translateY(${baseTransform + deltaY}%)`;
    }
    return isExpanded ? 'translateY(-50%)' : 'translateY(0%)';
  };

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out z-50 ${
        isDragging ? 'duration-0' : ''
      }`}
      style={{
        height: '60vh',
        transform: getTransform(),
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
      <div className="px-4 pb-4 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}