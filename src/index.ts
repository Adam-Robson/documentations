import { Command } from 'commander';
import pool from './db/db';
import { addCommand } from './lib/cmd/add';
import { searchCommand } from './lib/cmd/search';
import { getCommand } from './lib/cmd/get';
import { listCommand } from './lib/cmd/list';
import { deleteCommand } from './lib/cmd/delete';
import { updateCommand } from './lib/cmd/update';
import { handleError } from './utils/error';

const program = new Command();

program
    .name('docs')
    .description('Local documentation store')
    .version('0.1.0');

addCommand(program);
searchCommand(program);
getCommand(program);
listCommand(program);
deleteCommand(program);
updateCommand(program);

program.parseAsync(process.argv).finally(() => pool.end());
process.on('unhandledRejection', (error) => {
    handleError(error);
});


