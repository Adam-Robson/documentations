import { Command } from 'commander';
import pool from '../../db/db';
import { handleError } from '../../utils/error';

export function updateCommand(program: Command) {
  try {
    program
        .command('update <id>')
        .description('Update a document by id')
        .option('-t, --title <title>', 'New title')
        .option('-c, --category <category>', 'New category')
        .option('-s, --subcategory <subcategory>', 'New subcategory')
        .option('--content <content>', 'New content')
        .option('--tags <tags>', 'New tags (comma separated)')
        .option('-u, --url <url>', 'New source URL')
        .option('-v, --version <version>', 'New version')
        .action(async (id, opts) => {
            const existing = await pool.query(
                `SELECT * FROM documents WHERE id = $1`,
                [parseInt(id)]
            );

            if (existing.rows.length === 0) {
                console.warn(`No document found with id: ${id}`);
                return;
            }

            const fields: string[] = [];
            const params: any[] = [];
            let paramIndex = 1;

            if (opts.title) {
                fields.push(`title = $${paramIndex++}`);
                params.push(opts.title);
            }
            if (opts.category) {
                fields.push(`category = $${paramIndex++}`);
                params.push(opts.category);
            }
            if (opts.subcategory) {
                fields.push(`subcategory = $${paramIndex++}`);
                params.push(opts.subcategory);
            }
            if (opts.content) {
                fields.push(`content = $${paramIndex++}`);
                params.push(opts.content);
            }
            if (opts.tags) {
                fields.push(`tags = $${paramIndex++}`);
                params.push(opts.tags.split(',').map((t: string) => t.trim()));
            }
            if (opts.url) {
                fields.push(`source_url = $${paramIndex++}`);
                params.push(opts.url);
            }
            if (opts.version) {
                fields.push(`version = $${paramIndex++}`);
                params.push(opts.version);
            }

            if (fields.length === 0) {
                console.info('No fields to update. Pass at least one option.');
                return;
            }

            fields.push(`updated_at = NOW()`);
            params.push(parseInt(id));

            await pool.query(
                `UPDATE documents SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
                params
            );

            console.info(`✓ Updated document [${id}]`);
        });
  } catch (error) {
    handleError(error);
  }
}
