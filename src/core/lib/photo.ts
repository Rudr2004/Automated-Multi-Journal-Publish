// Profile picture helpers for the submission form: validation and a client-side square thumbnail (no upload happens in the prototype).
import type { AuthorPhoto } from './submission'

export const PHOTO_MAX_MB = 2
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const PHOTO_ACCEPT = PHOTO_TYPES.join(',')
const THUMB = 256

/** Returns an error message for a picture that cannot be used, or ''. */
export function validatePhoto(file: { name: string; size: number; type?: string }): string {
  const okType = file.type ? PHOTO_TYPES.includes(file.type) : /\.(jpe?g|png|webp)$/i.test(file.name)
  if (!okType) return 'Use a JPG, PNG or WebP picture.'
  if (file.size === 0) return 'This picture is empty. Please choose another file.'
  if (file.size > PHOTO_MAX_MB * 1024 * 1024) return `The picture is larger than ${PHOTO_MAX_MB} MB.`
  return ''
}

/** Reads the chosen picture and returns a centred square 256px JPEG thumbnail. */
export function readPhoto(file: File): Promise<AuthorPhoto> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const side = Math.min(img.naturalWidth, img.naturalHeight)
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = THUMB
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('canvas')
        ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, THUMB, THUMB)
        resolve({ name: file.name, size: file.size, dataUrl: canvas.toDataURL('image/jpeg', 0.86) })
      } catch { reject(new Error('Could not read this picture.')) }
      finally { URL.revokeObjectURL(url) }
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read this picture. Try a different file.')) }
    img.src = url
  })
}
