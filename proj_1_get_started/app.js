import fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify({
    logger: true
})

app.register(autoload, {
    dir: path.join(__dirname, 'src/routes'), options: { prefix: '/api' },
    routeParams: true
})

app.listen({ port: 3000 })