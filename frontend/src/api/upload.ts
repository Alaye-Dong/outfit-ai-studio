const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface UploadResult {
  url: string
  filename: string
  size: number
  mimetype: string
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BASE_URL}/api/upload/image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`上传失败: ${response.status} ${errorBody}`)
  }

  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message || '上传失败')
  }

  return result.data as UploadResult
}
