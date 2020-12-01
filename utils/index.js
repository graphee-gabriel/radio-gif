export const getGifMetaDataFromFileName = (fileName) => {
  if (!fileName) return "cover"

  let cleaned = fileName.replace(".gifv", "").replace(".gif", "").replace(".webp", "")
  const split = cleaned.split("|")
  const metaData = {}
  for (const pair of split) {
    const [key, value] = pair.split("=")
    if (value) {
      metaData[key] = value
    }
  }
  return metaData
}
