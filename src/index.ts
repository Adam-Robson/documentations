import { Command } from 'commander';
import pool from './db/db';
import { addCommand } from './lib/cmd/add';
import { searchCommand } from './lib/cmd/search';
import { getCommand } from './lib/cmd/get';
import { listCommand } from './lib/cmd/list';

const program = new Command();

program
    .name('docs')
    .description('Local documentation store')
    .version('0.1.0');

addCommand(program);
searchCommand(program);
getCommand(program);
listCommand(program);

program.parseAsync(process.argv).finally(() => pool.end());
