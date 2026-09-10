import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      // Membesar ketika menyentuh tombol, link, gambar di galeri, atau elemen ber-cursor pointer
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.competition-card') ||
        target.closest('.showcase-item') ||
        target.tagName.toLowerCase() === 'img'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'rgba(30, 41, 59, 0.4)', // ppi-navy translusen
          border: '2px solid rgba(255, 255, 255, 0.8)',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          scale: isHovered ? 2.5 : 1,
          backgroundColor: isHovered ? 'rgba(255,255,255, 1)' : 'rgba(255,255,255, 0)',
          borderColor: isHovered ? 'rgba(255,255,255,0)' : 'rgba(255, 255, 255, 0.8)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.span 
          style={{ 
            color: 'var(--ppi-navy)', 
            fontSize: '6px', 
            fontWeight: 'bold', 
            opacity: 0,
            textTransform: 'uppercase'
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          Lihat
        </motion.span>
      </motion.div>
    </>
  );
};
