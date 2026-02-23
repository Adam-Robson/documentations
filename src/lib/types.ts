export interface Document {
    id: number;
    title: string;
    content: string;
    category: string;
    subcategory?: string;
    tags?: string[];
    source_url?: string;
    version?: string;
    created_at: string;
    updated_at: string;
}

export interface NewDocument extends Omit<Document, 'id' | 'created_at' | 'updated_at'> {}

export type NewDocumentManual = Pick<Document, 'title' | 'content' | 'category' | 'subcategory' | 'tags' | 'source_url' | 'version'>;
