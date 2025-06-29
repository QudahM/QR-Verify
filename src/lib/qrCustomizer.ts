import QRCodeLib from 'qrcode-generator';
import { QRStyle } from '../components/qr-customizer/QRCustomizer';

export const generateCustomQR = async (
  content: string,
  style: QRStyle,
  canvas?: HTMLCanvasElement | null
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create QR code instance
      const qr = QRCodeLib(0, 'H'); // Type 0 (auto), Error correction level H
      qr.addData(content);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const cellSize = 10;
      const margin = 40;
      const size = moduleCount * cellSize + margin * 2;

      // Create canvas
      const targetCanvas = canvas || document.createElement('canvas');
      targetCanvas.width = size;
      targetCanvas.height = size;
      const ctx = targetCanvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Fill background
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // Create gradient if enabled
      let fillStyle: string | CanvasGradient = style.foregroundColor;
      if (style.gradient.enabled) {
        if (style.gradient.type === 'linear') {
          const angle = (style.gradient.direction * Math.PI) / 180;
          const x1 = size / 2 - (Math.cos(angle) * size) / 2;
          const y1 = size / 2 - (Math.sin(angle) * size) / 2;
          const x2 = size / 2 + (Math.cos(angle) * size) / 2;
          const y2 = size / 2 + (Math.sin(angle) * size) / 2;
          
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, style.gradient.colors[0]);
          gradient.addColorStop(1, style.gradient.colors[1] || style.gradient.colors[0]);
          fillStyle = gradient;
        } else {
          const gradient = ctx.createRadialGradient(
            size / 2, size / 2, 0,
            size / 2, size / 2, size / 2
          );
          gradient.addColorStop(0, style.gradient.colors[0]);
          gradient.addColorStop(1, style.gradient.colors[1] || style.gradient.colors[0]);
          fillStyle = gradient;
        }
      }

      // Draw QR modules
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = col * cellSize + margin;
            const y = row * cellSize + margin;

            // Check if this is an eye pattern
            const isEye = isEyePattern(row, col, moduleCount);
            
            if (isEye) {
              ctx.fillStyle = style.eyeColor;
              drawShape(ctx, x, y, cellSize, style.eyeStyle);
            } else {
              // Skip center area if logo is present
              if (style.logo && isInLogoArea(row, col, moduleCount, style.logo.size)) {
                continue;
              }
              
              ctx.fillStyle = fillStyle;
              drawShape(ctx, x, y, cellSize, style.dataStyle);
            }
          }
        }
      }

      // Draw logo if present
      if (style.logo) {
        drawLogo(ctx, style.logo, size).then(() => {
          resolve(targetCanvas.toDataURL('image/png'));
        }).catch(reject);
      } else {
        resolve(targetCanvas.toDataURL('image/png'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

const isEyePattern = (row: number, col: number, moduleCount: number): boolean => {
  // Top-left eye
  if (row < 9 && col < 9) return true;
  // Top-right eye
  if (row < 9 && col >= moduleCount - 8) return true;
  // Bottom-left eye
  if (row >= moduleCount - 8 && col < 9) return true;
  return false;
};

const isInLogoArea = (row: number, col: number, moduleCount: number, logoSize: number): boolean => {
  const center = moduleCount / 2;
  const logoRadius = (moduleCount * logoSize) / 200; // logoSize is percentage
  const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
  return distance < logoRadius;
};

const drawShape = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: string
) => {
  ctx.save();
  
  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    
    case 'rounded':
      const radius = size * 0.2;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
      break;
    
    case 'leaf':
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.quadraticCurveTo(x, y, x + size, y);
      ctx.quadraticCurveTo(x + size, y + size, x, y + size);
      ctx.fill();
      break;
    
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size / 2);
      ctx.lineTo(x + size / 2, y + size);
      ctx.lineTo(x, y + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    
    case 'dots':
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.3, 0, 2 * Math.PI);
      ctx.fill();
      break;
    
    default: // square
      ctx.fillRect(x, y, size, size);
      break;
  }
  
  ctx.restore();
};

const drawLogo = async (
  ctx: CanvasRenderingContext2D,
  logo: NonNullable<QRStyle['logo']>,
  canvasSize: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const logoSize = (canvasSize * logo.size) / 100;
      const logoMargin = (logoSize * logo.margin) / 100;
      const actualLogoSize = logoSize - logoMargin * 2;
      const x = (canvasSize - logoSize) / 2 + logoMargin;
      const y = (canvasSize - logoSize) / 2 + logoMargin;

      // Draw white background for logo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        (canvasSize - logoSize) / 2,
        (canvasSize - logoSize) / 2,
        logoSize,
        logoSize
      );

      // Draw logo
      ctx.drawImage(img, x, y, actualLogoSize, actualLogoSize);
      resolve();
    };
    img.onerror = reject;
    
    // Convert File to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(logo.file);
  });
};