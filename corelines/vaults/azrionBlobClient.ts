import { BlobServiceClient, ContainerClient } from "@azure/storage-blob"

let clientInstance: BlobServiceClient | null = null

export function initBlobClient(connectionString: string): BlobServiceClient {
  if (!clientInstance) {
    clientInstance = BlobServiceClient.fromConnectionString(connectionString)
  }
  return clientInstance
}

export function getContainerClient(containerName: string): ContainerClient {
  if (!clientInstance) throw new Error("Blob client not initialized")
  return clientInstance.getContainerClient(containerName)
}

export async function uploadBlob(
  container: ContainerClient,
  blobName: string,
  data: string | Buffer
): Promise<void> {
  const blockBlobClient = container.getBlockBlobClient(blobName)
  await blockBlobClient.uploadData(data)
}

export async function downloadBlob(
  container: ContainerClient,
  blobName: string
): Promise<Buffer> {
  const blobClient = container.getBlobClient(blobName)
  const downloadBlock = await blobClient.download()
  return Buffer.from(await downloadBlock.readableStreamBody?.getReader().read().then(res => res.value ?? []))
}
