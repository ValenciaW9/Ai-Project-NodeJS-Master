declare module 'chromadb' {
    export interface OpenAIEmbeddingFunction {
        (text: string): Promise<number[]>;
    }
    const chromadb: any; // Replace 'any' with the actual type if known
    export default chromadb;
}
