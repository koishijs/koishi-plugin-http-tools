export const SizeFormat = ['', 'K', 'M', 'G', 'T']

export function formatSize(number: number) {
  return $formatSize(number, 0) + 'B'
}

function $formatSize(number: number, scale: number) {
  if (scale >= SizeFormat.length) {
    return number + 'T'
  }
  if (number < 1024) {
    return number + SizeFormat[scale]
  }
  return $formatSize(number / 1024, scale + 1)
}
