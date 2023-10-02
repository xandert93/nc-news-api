const checkIsObject = (val) => {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

module.exports = { checkIsObject }
