export const imageLoader = ({
  src,
  width,
  quality

}: { src: string; width: number; quality?: number }) => {
  return `https://static.speedle.dev/${src}?w=${width}&q=${quality || 75}`
}