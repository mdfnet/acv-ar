import { Results } from '@mediapipe/face_mesh';
import { useEffect } from 'react';

interface AsymmetryCalculatorProps {
  results: Results;
  onAsymmetryCalculated: (asymmetry: number | null) => void;
}

export const AsymmetryCalculator = ({ results, onAsymmetryCalculated }: AsymmetryCalculatorProps) => {
  useEffect(() => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      onAsymmetryCalculated(null);
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const leftCorner = landmarks[61];
    const rightCorner = landmarks[291];
    
    const canvasWidth = 640;
    const leftX = leftCorner.x * canvasWidth;
    const rightX = rightCorner.x * canvasWidth;
    const asymmetryX = Math.abs(leftX - rightX);
    const avgDistance = (leftX + rightX) / 2;
    const asymmetryPercentage = (asymmetryX / avgDistance) * 100;
    
    onAsymmetryCalculated(Number(asymmetryPercentage.toFixed(2)));
  }, [results, onAsymmetryCalculated]);

  return null;
};