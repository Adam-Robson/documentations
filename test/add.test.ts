import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../src/db/db';
import { addCommand } from '../src/lib/cmd/add';
import { Command } from 'commander';

vi.mock('../src/db/db', () => ({
    default: {
        query: vi.fn(),
        end: vi.fn(),
    }
}));

describe('add command', () => {
    let program: Command;

    beforeEach(() => {
        program = new Command();
        program.exitOverride();
        addCommand(program);
        vi.clearAllMocks();
    });

    it('inserts a document and returns the id', async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [{ id: 1 }],
            rowCount: 1,
        } as any);

        await program.parseAsync([
            'node', 'docs', 'add',
            '--title', 'Bash Arrays',
            '--category', 'bash',
            '--content', 'Arrays in bash use parentheses',
            '--tags', 'arrays,bash'
        ]);

        expect(pool.query).toHaveBeenCalledOnce();
        const [sql, params] = vi.mocked(pool.query).mock.calls[0];
        expect(sql).toContain('INSERT INTO documents');
        expect(params).toContain('Bash Arrays');
        expect(params).toContain('bash');
    });

    it('requires title, category, and content', async () => {
        await expect(
            program.parseAsync(['node', 'docs', 'add', '--title', 'Missing Fields'])
        ).rejects.toThrow();

        expect(pool.query).not.toHaveBeenCalled();
    });
});
