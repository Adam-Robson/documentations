import { Command } from 'commander';
import pool from '../../db/db';
import { handleError } from '../../utils/error';

export function getCommand(program: Command) {

  try {
    program
      .command('get <id>')
      .description('Get a document by id')
      .action(async (id) => {
        const result = await pool.query(
          `SELECT * FROM documents WHERE id = $1`,
          [parseInt(id)]
        );
      
        if (result.rows.length === 0) {
          console.warn(`No document found with id: ${id}`);
          return;
        }
      
        const doc = result.rows[0]
        console.info(`\n[${doc.id}] ${doc.title}`);
        console.info(`    category:  ${doc.category}${doc.subcategory ? ` > ${doc.subcategory}` : ''}`);
        if (doc.version)    console.info(`    version:   ${doc.version}`);
        if (doc.source_url) console.info(`    source:    ${doc.source_url}`);
        if (doc.tags?.length) console.info(`    tags:      ${doc.tags.join(', ')}`);
        console.info(`    created:   ${doc.created_at.toLocaleDateString()}`);
        console.info(`\n${doc.content}`);
     });
  } catch (error) {
    handleError(error);
  }
}
