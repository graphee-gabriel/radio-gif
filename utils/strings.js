export const getLastSplitSegment = (string = "", separator) => {
  const paths = string.split(separator)
  return paths[paths.length - 1]
}
