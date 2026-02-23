import { Command } from 'commander';
import pool from '../../db/db';
import { handleError } from '../../utils/error';

export function deleteCommand(program: Command) {
  try {
    program
        .command('delete <id>')
        .description('Delete a document by id')
        .option('-f, --force', 'Skip confirmation')
        .action(async (id, opts) => {
            const existing = await pool.query(
                `SELECT id, title FROM documents WHERE id = $1`,
                [parseInt(id)]
            );

            if (existing.rows.length === 0) {
                console.warn(`No document found with id: ${id}`);
                return;
            }

            const doc = existing.rows[0];

            if (!opts.force) {
                console.warn(`About to delete: [${doc.id}] ${doc.title}`);
                console.warn('Run with --force to confirm.');
                return;
            }

            await pool.query(`DELETE FROM documents WHERE id = $1`, [parseInt(id)]);
            console.info(`✓ Deleted document [${doc.id}] ${doc.title}`);
        });
  } catch (error) {
    handleError(error);
  }
}
