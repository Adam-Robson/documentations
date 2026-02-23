import { Command } from 'commander';
import pool from '../../db/db';
import { handleError } from '../../utils/error';

export function listCommand(program: Command) {

  try {
    program
      .command('list')
      .description('List documents, optionally filtered.')
      .option('-c, --category <category>', 'Filter by category.')
      .option('-s, --subcategory <subcategory>', 'Filter by subcategory.')
      .option('--tags <tags>', 'Filter by tags (comma separated).')
      .option('-l, --limit <limit>', 'Max results.', '20')
      .action(async (opts) => {
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1
        
        if (opts.category) {
          conditions.push(`category = $${paramIndex++}`);
          params.push(opts.category);
        }
        
        if (opts.subcategory) {
          conditions.push(`subcategory = $${paramIndex++}`);
          params.push(opts.subcategory);
        }
        
        if (opts.tags) {
          const tags = opts.tags.split(',').map((t: string) => t.trim());
          conditions.push(`tags @> $${paramIndex++}`);
          params.push(tags);
        }
        
        params.push(parseInt(opts.limit));

        const sql = `
          SELECT id, title, category, subcategory, tags, version, created_at
          FROM documents
          ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
          ORDER BY category, created_at DESC
          LIMIT $${paramIndex}
        `;

        const result = await pool.query(sql, params);

        if (result.rows.length === 0) {
            console.info('No documents found.');
            return;
        }

        let currentCategory = '';
        result.rows.forEach(row => {
            if (row.category !== currentCategory) {
                currentCategory = row.category;
                console.info(`\n── ${currentCategory.toUpperCase()} ──`);
            }
            const sub = row.subcategory ? ` > ${row.subcategory}` : '';
            const ver = row.version ? ` (${row.version})` : '';
            const tags = row.tags?.length ? ` [${row.tags.join(', ')}]` : '';
            console.info(`  [${row.id}] ${row.title}${sub}${ver}${tags}`);
        });

        console.info(`\n${result.rows.length} document(s) found.`);
    });
  } catch (error) {
    handleError(error);
  }
}
   