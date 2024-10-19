import app from './app.js'

const PORT = process.env.API_PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})