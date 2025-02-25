import { VectorStoreIndex } from 'llamaindex';
import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
import path from 'path';

let db: VectorStoreIndex | null = null;

export async function initializeDB(): Promise<VectorStoreIndex> {
  if (db) return db;
  console.log('Initializing Vector Store...');
  try {
    // Load documents from the documents directory
    const documentsPath = path.join(process.cwd(), 'src/data');
    const reader = new SimpleDirectoryReader();
    const documents = await reader.loadData(documentsPath);
    // Create index
    db = await VectorStoreIndex.fromDocuments(documents, {});
    return db;
  } catch (error) {
    console.error('Error initializing Vector Store:', error);
    throw error;
  }
}
