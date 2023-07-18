import _companions from '@/companions.json';
import path from 'path';
import fs from 'fs';

const companions = _companions
  .map((companion) => {
    const { name } = companion;
    if (!name) return null;
    const promptPath = path.join(process.cwd(), `companions/${name}.txt`);
    return {
      ...companion,
      prompt: fs.readFileSync(promptPath, 'utf-8')
    };
  })
  .filter((item) => item !== null);

export {
  companions
}