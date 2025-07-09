import React, { useEffect, useRef } from 'react';
import { PriceHistory } from '../types/trading';

interface TradingChartProps {
  priceHistory: PriceHistory[];
  symbol: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({ priceHistory, symbol }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || priceHistory.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    if (priceHistory.length < 2) return;

    // Find min and max prices
    const prices = priceHistory.map(h => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();

    priceHistory.forEach((point, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const y = height - ((point.price - minPrice) / priceRange) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw current price
    if (priceHistory.length > 0) {
      const currentPrice = priceHistory[priceHistory.length - 1].price;
      const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
      
      // Responsive price label
      const labelWidth = width > 400 ? 60 : 50;
      const fontSize = width > 400 ? 12 : 10;
      
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(width - labelWidth, currentY - 10, labelWidth - 5, 20);
      ctx.fillStyle = '#000000';
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(currentPrice.toFixed(4), width - labelWidth + 2, currentY + 3);
    }

  }, [priceHistory, symbol]);

  return (
    <div className="bg-gray-900 rounded-lg p-3 md:p-4">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className="text-white font-semibold text-sm md:text-base">{symbol} Chart</h3>
        <div className="text-green-400 text-xs md:text-sm">Live</div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-32 md:h-48 bg-gray-800 rounded"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};