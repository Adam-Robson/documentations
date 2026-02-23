import { Command } from 'commander';
import pool from './db/db.js';

const program = new Command();

program
    .name('docs')
    .description('Local documentation store')
    .version('0.1.0');

program.parseAsync(process.argv).finally(() => pool.end());
