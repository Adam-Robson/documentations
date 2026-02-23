import { Command } from 'commander';
import pool from '../../db/db';

export function searchCommand(program: Command) {
    program
        .command('search <query>')
        .description('Search documents by full text')
        .option('-c, --category <category>', 'Filter by category')
        .option('--tags <tags>', 'Filter by tags (comma separated)')
        .action(async (query, opts) => {
            const conditions: string[] = [
                `to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', $1)`
            ];
            const params: any[] = [query];
            let paramIndex = 2;

            if (opts.category) {
                conditions.push(`category = $${paramIndex++}`);
                params.push(opts.category);
            }

            if (opts.tags) {
                const tags = opts.tags.split(',').map((t: string) => t.trim());
                conditions.push(`tags @> $${paramIndex++}`);
                params.push(tags);
            }

            const sql = `
                SELECT
                    id,
                    title,
                    category,
                    subcategory,
                    tags,
                    version,
                    ts_rank(to_tsvector('english', title || ' ' || content),
                            plainto_tsquery('english', $1)) AS rank
                FROM documents
                WHERE ${conditions.join(' AND ')}
                ORDER BY rank DESC
            `;

            const result = await pool.query(sql, params);

            if (result.rows.length === 0) {
                console.info('No results found.');
                return;
            }

            result.rows.forEach(row => {
                console.info(`\n[${row.id}] ${row.title}`);
                console.info(`    category: ${row.category}${row.subcategory ? ` > ${row.subcategory}` : ''}`);
                if (row.tags?.length) console.info(`    tags: ${row.tags.join(', ')}`);
                if (row.version) console.info(`    version: ${row.version}`);
                console.info(`    rank: ${parseFloat(row.rank).toFixed(4)}`);
            });
        });
}
