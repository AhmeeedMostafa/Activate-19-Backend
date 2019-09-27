module.exports = {
  success: (data) => ({ success : true, data}),
  error: (data) => ({ success: false, data}),
}
