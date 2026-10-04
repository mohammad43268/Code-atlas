import { useEffect, useRef } from 'react';

export function useFitText(textToMeasure: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fit = () => {
      if (!containerRef.current || !textRef.current) return;
      
      const container = containerRef.current;
      const textNode = textRef.current;
      
      // We want to fill the container 100% since padding is handled by the parent
      const targetWidth = container.clientWidth;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const baseSize = 100;
        ctx.font = `${baseSize}px Comvota, sans-serif`;
        const metrics = ctx.measureText(textToMeasure);
        const trueWidth = metrics.actualBoundingBoxRight + Math.abs(metrics.actualBoundingBoxLeft);
        
        if (trueWidth > 0) {
          const scale = targetWidth / trueWidth;
          const newFontSize = baseSize * scale;
          textNode.style.fontSize = `${Math.floor(newFontSize)}px`;
        }
      }
    };

    if ('fonts' in document) {
      document.fonts.ready.then(fit);
    } else {
      fit();
    }

    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [textToMeasure]);

  return { containerRef, textRef };
}
