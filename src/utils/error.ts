export function handleError(error: unknown): void {
    if (error instanceof Error) {
        console.error(`✗ ${error.message}`);
    } else {
        console.error('✗ An unexpected error occurred.');
    }
    process.exit(1);
}
