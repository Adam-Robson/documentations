import { Command } from 'commander';
import pool from './db/db';
import { addCommand } from './lib/cmd/add';
import { searchCommand } from './lib/cmd/search';

const program = new Command();

program
    .name('docs')
    .description('Local documentation store')
    .version('0.1.0');

addCommand(program);
searchCommand(program);

program.parseAsync(process.argv).finally(() => pool.end());
