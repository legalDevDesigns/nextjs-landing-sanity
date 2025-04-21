import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlForImage(source) {
  return builder.image(source)
} 