import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../src/db/db';
import { searchCommand } from '../src/lib/cmd/search';
import { Command } from 'commander';

vi.mock('../src/db/db', () => ({
    default: {
        query: vi.fn(),
        end: vi.fn(),
    }
}));

describe('search command', () => {
    let program: Command;

    beforeEach(() => {
        program = new Command();
        program.exitOverride();
        searchCommand(program);
        vi.clearAllMocks();
    });

    it('searches with a query term', async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [
                {
                    id: 1,
                    title: 'Bash Arrays',
                    category: 'bash',
                    subcategory: null,
                    tags: ['arrays'],
                    version: null,
                    rank: '0.0759'
                }
            ],
            rowCount: 1,
        } as any);

        await program.parseAsync(['node', 'docs', 'search', 'arrays']);

        expect(pool.query).toHaveBeenCalledOnce();
        const [sql, params] = vi.mocked(pool.query).mock.calls[0];
        expect(sql).toContain('to_tsvector');
        expect(params[0]).toBe('arrays');
    });

    it('filters by category when provided', async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [],
            rowCount: 0,
        } as any);

        await program.parseAsync([
            'node', 'docs', 'search', 'arrays',
            '--category', 'bash'
        ]);

        const [sql, params] = vi.mocked(pool.query).mock.calls[0];
        expect(sql).toContain('category =');
        expect(params).toContain('bash');
    });

    it('prints no results message when nothing found', async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [],
            rowCount: 0,
        } as any);

        const consoleSpy = vi.spyOn(console, 'log');

        await program.parseAsync(['node', 'docs', 'search', 'nonexistent']);

        expect(consoleSpy).toHaveBeenCalledWith('No results found.');
    });
});
