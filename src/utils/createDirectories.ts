import fs from 'fs';
import path from 'path';

/**
 * Create necessary directories if they don't exist
 */
export const createDirectories = (): void => {
  const directories = ['logs', 'dist'];

  directories.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

