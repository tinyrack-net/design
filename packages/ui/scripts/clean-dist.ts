import { resolve } from 'node:path';
import { rimraf } from 'rimraf';

const distRoot = resolve(import.meta.dirname, '../dist');
await rimraf(distRoot);
console.log(`removed ${distRoot}`);
