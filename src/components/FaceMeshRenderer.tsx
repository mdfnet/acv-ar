import { drawLandmarks, drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION, FACEMESH_LIPS, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYE } from '@mediapipe/face_mesh';
import { Results } from '@mediapipe/face_mesh';
import { useEffect } from 'react';

interface FaceMeshRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  results: Results;
}

export const FaceMeshRenderer = ({ canvasRef, results }: FaceMeshRendererProps) => {
  useEffect(() => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement?.getContext('2d');

    if (!canvasElement || !canvasCtx || !results.multiFaceLandmarks) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks.length > 0) {
      for (const landmarks of results.multiFaceLandmarks) {
        // Malla facial con líneas muy finas y sutiles
        drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
          color: 'rgba(255, 255, 255, 0.15)',
          lineWidth: 0.5
        });

        // Puntos faciales muy pequeños y casi transparentes
        drawLandmarks(canvasCtx, landmarks, {
          color: 'rgba(255, 255, 255, 0.2)',
          fillColor: 'rgba(255, 255, 255, 0.05)',
          radius: 0.3,
          lineWidth: 0.5
        });

        // Ojos con trazos muy suaves
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
          color: 'rgba(130, 230, 255, 0.2)',
          lineWidth: 0.5
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
          color: 'rgba(130, 230, 255, 0.2)',
          lineWidth: 0.5
        });

        // Labios con líneas muy finas
        drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {
          color: 'rgba(255, 205, 215, 0.2)',
          lineWidth: 0.5
        });
      }
    }

    canvasCtx.restore();
  }, [canvasRef, results]);

  return null;
};