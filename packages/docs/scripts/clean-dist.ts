import { resolve } from 'node:path';
import { rimraf } from 'rimraf';

await rimraf(resolve(import.meta.dirname, '../dist'));
