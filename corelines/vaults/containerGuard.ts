import type { BlobServiceClient } from "@azure/storage-blob"

export async function ensureContainerExists(
  blobClient: BlobServiceClient,
  containerName: string
): Promise<void> {
  const container = blobClient.getContainerClient(containerName)
  const exists = await container.exists()

  if (!exists) {
    await container.create()
    console.log(`✅ Container "${containerName}" created`)
  } else {
    console.log(`📦 Container "${containerName}" already exists`)
  }
}

export async function listContainerContents(
  blobClient: BlobServiceClient,
  containerName: string
): Promise<string[]> {
  const container = blobClient.getContainerClient(containerName)
  const blobs: string[] = []

  for await (const item of container.listBlobsFlat()) {
    blobs.push(item.name)
  }

  return blobs
}
