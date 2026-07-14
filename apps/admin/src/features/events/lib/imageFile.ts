const imageFileAccept = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'
const maxImageSize = 5 * 1024 * 1024

const imageFormats = [
  { extension: /\.jpe?g$/i, mimeType: 'image/jpeg' },
  { extension: /\.png$/i, mimeType: 'image/png' },
  { extension: /\.webp$/i, mimeType: 'image/webp' },
] as const

function normalizeImageFile(file: File) {
  const format = imageFormats.find(({ extension }) => extension.test(file.name))

  if (!format || file.type === format.mimeType) {
    return file
  }

  return new File([file], file.name, {
    type: format.mimeType,
    lastModified: file.lastModified,
  })
}

function getImageFileError(file: File) {
  const hasAllowedExtension = imageFormats.some(({ extension }) => extension.test(file.name))
  const hasAllowedMimeType = imageFormats.some(({ mimeType }) => mimeType === file.type)

  if (!hasAllowedExtension && !hasAllowedMimeType) {
    return 'JPG, JPEG, PNG, WEBP 이미지만 등록할 수 있어요.'
  }

  if (file.size > maxImageSize) {
    return '이미지는 5MB 이하만 등록할 수 있어요.'
  }

  return null
}

export { getImageFileError, imageFileAccept, normalizeImageFile }
