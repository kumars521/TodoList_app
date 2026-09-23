export interface BlobStorageClient {
  listFiles(): Promise<string[]>;
  upload(name: string, contents: string): Promise<string>;
}

export class BlobStorageService implements BlobStorageClient {
  constructor(
    private readonly connectionString: string,
    private readonly isDevelopment: boolean,
  ) {
    this.connectionString = connectionString;
    this.isDevelopment = isDevelopment;
  }

  async listFiles(): Promise<string[]> {
    return this.isDevelopment ? ['sample-attachment.txt'] : [];
  }

  async upload(name: string, contents: string): Promise<string> {
    return `${this.isDevelopment ? 'azurite://' : 'blob://'}${name}:${Buffer.byteLength(contents)}`;
  }
}
