import { promises as fs } from 'fs';

export const randomNameChooser = async (): Promise<string> => {
  const names = await fs.readFile(process.cwd() + '/json/names.json', 'utf-8');

  const array = JSON.parse(names);

  const number = Math.floor(Math.random() * (array.length - 0)) + 0;

  return array[number];
};
