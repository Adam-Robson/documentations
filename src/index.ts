import { Command } from 'commander';
import pool from './db/db';
import { addCommand } from './lib/cmd/add';

const program = new Command();

program
    .name('docs')
    .description('Local documentation store')
    .version('0.1.0');

addCommand(program);

program.parseAsync(process.argv).finally(() => pool.end());
