import { initBlobClient, getContainerClient, uploadBlob, downloadBlob } from "./azrionBlobClient"
import { ensureContainerExists } from "./containerGuard"

const CONNECTION_STRING = process.env.AZRION_BLOB_CONN || ""
const CONTAINER_NAME = "azrion-snapshots"

const blobClient = initBlobClient(CONNECTION_STRING)

export async function storeSnapshot(id: string, payload: Record<string, unknown>): Promise<void> {
  const container = getContainerClient(CONTAINER_NAME)
  await ensureContainerExists(blobClient, CONTAINER_NAME)

  const blobName = `${id}.json`
  const data = JSON.stringify(payload, null, 2)

  await uploadBlob(container, blobName, data)
  console.log(`📤 Stored snapshot: ${blobName}`)
}

export async function loadSnapshot(id: string): Promise<unknown | null> {
  const container = getContainerClient(CONTAINER_NAME)
  const blobName = `${id}.json`

  try {
    const raw = await downloadBlob(container, blobName)
    return JSON.parse(raw.toString())
  } catch (e) {
    console.warn(`⚠️ Failed to load snapshot ${id}:`, e)
    return null
  }
}
