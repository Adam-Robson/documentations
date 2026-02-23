import { Command } from 'commander';
import pool from '../../db/db.js';
import { NewDocument } from '../types';
import { handleError } from '../../utils/error';

export function addCommand(program: Command) {
  try {
  program
    .command('add')
    .description('Add a document')
    .requiredOption('-t, --title <title>', 'Document title')
    .requiredOption('-c, --category <category>', 'Category (e.g. bash, python, zsh)')
    .option('--content <content>', 'Document content')
    .option('--file <path>', 'Path to file to use as content')
    .option('-s, --subcategory <subcategory>', 'Subcategory')
    .option('--tags <tags>', 'Comma separated tags')
    .option('-u, --url <url>', 'Source URL')
    .option('-v, --version <version>', 'Version (e.g. 3.12)')
    .action(async (opts) => {
      try {
        const doc: NewDocument = {
            title: opts.title,
            content: opts.content,
            category: opts.category,
            subcategory: opts.subcategory,
            tags: opts.tags ? opts.tags.split(',').map((t: string) => t.trim()) : [],
            source_url: opts.url,
            version: opts.version,
        };

        const result = await pool.query(
            `INSERT INTO documents (title, content, category, subcategory, tags, source_url, version)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING id`,
            [doc.title, doc.content, doc.category, doc.subcategory, doc.tags, doc.source_url, doc.version]
        );

        console.info(`✓ Document added with id: ${result.rows[0].id}`);
      } catch (error) {
        handleError(error)
      }
    });
  } catch (error) {
    handleError(error)
  }
}
