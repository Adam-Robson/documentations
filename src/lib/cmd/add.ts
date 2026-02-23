import { Command } from 'commander';
import pool from '../../db/db';
import { NewDocument } from '../types';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { handleError } from '../../utils/error';

export function addCommand(program: Command) {
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
                let content: string;

                if (opts.file) {
                    const filePath = resolve(opts.file);
                    if (!existsSync(filePath)) {
                        console.error(`✗ File not found: ${filePath}`);
                        process.exit(1);
                    }
                    content = readFileSync(filePath, 'utf-8');
                } else if (opts.content) {
                    content = opts.content;
                } else {
                    console.error('✗ Either --content or --file is required');
                    process.exit(1);
                }

                const doc: NewDocument = {
                    title: opts.title,
                    content,
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

                console.log(`✓ Document added with id: ${result.rows[0].id}`);
            } catch (error) {
                handleError(error);
            }
        });
}
