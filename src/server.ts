import express from 'express'
import cors from 'cors'
import usuarioRoutes from './routes/usuario.routes.js'
import convidadoRoutes from './routes/convidado.routes.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/usuario", usuarioRoutes)
app.use("/convidado", convidadoRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})