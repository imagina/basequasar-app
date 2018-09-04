export default function(key, fallback){
  let value = process.env[key]
  if (!value) {
    return fallback
  }
  return value.replace(/["]/g, '')
}
