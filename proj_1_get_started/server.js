import fastify from "fastify"
import pkg from "pg"

const fastify = fastify({ logger: true })


// DATABASE CONNECTION
const { Client } = pkg

const client = new Client({

  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "postgres",
  password: "docker",
})

client.connect()

// SCHEMA
const userType = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
}

const getUsersSchema = {
  response: {
    200: {
      type: "array",
      items: userType,
    },
  },
}

const getOneUserSchema = {
  params: {
    id: { type: "number" },
  },
  response: {
    200: userType,
  },
}

const addUserSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    200: { type: "number" },
  },
}

const updateUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  params: {
    id: { type: "number" },
  },
  response: {
    200: { type: "string" },
  },
}

const removeUserSchema = {
  params: {
    id: { type: "number" },
  },
  reponse: {
    200: { type: "string" },
  },
}

// HANDLER

const getUsersHandler = async (req, reply) => {
  const usersData = await client.query("SELECT * FROM tab_user")

  reply.send(usersData.rows)
}

const getUserHandler = async (req, reply) => {
  const { id } = req.params

  const userData = await client.query(
    `SELECT u.id, u.name, u.email, u.password FROM tab_user u WHERE id = ${id}`
  )

  reply.send(userData.rows[0])
}

const addUserHandler = async (req, reply) => {
  const { name, email, password } = req.body

  const rows = await client.query('SELECT * FROM tab_user;')

  const id = rows.rowCount + 1

  console.log(`${id}, NOW(), ${name}, ${email}, ${password});`)

  await client.query(`INSERT INTO tab_user VALUES (${id}, NOW(), '${name}', '${email}', '${password}');`)

  reply.send('New user added!')

}

const updateUserHandler = async (req, reply) => {
  const { id } = req.params;
  const { name, email, password } = req.body;


  await client.query(`UPDATE tab_user SET name='${name}', email='${email}', password='${password}' WHERE id = ${id};`)

  reply.send('User updated!')
}

const removeUserHandler = async (req, reply) => {
  const { id } = req.params

  await client.query(`DELETE FROM tab_user WHERE id = ${id}`)

  reply.send('User deleted!')
}

// OPTIONS

const getUsersOpts = {
  schema: getUsersSchema,
  handler: getUsersHandler,
}

const getOneUserOpts = {
  schema: getOneUserSchema,
  handler: getUserHandler,
}

const addUserOpts = {
  schema: addUserSchema,
  handler: addUserHandler,
}

const updateUserOpts = {
  schema: updateUserSchema,
  handler: updateUserHandler,
}

const removeUserOpts = {
  schema: removeUserSchema,
  handler: removeUserHandler,
}

// ROUTES
const routes = (fastify, options, done) => {
  fastify.get("/", (req, reply) => {
    reply.send("Connection OK")
  })

  fastify.get("/api/users", getUsersOpts)

  fastify.get("/api/users/:id", getOneUserOpts)

  fastify.post("/api/users/new", addUserOpts)

  fastify.put("/api/users/edit/:id", updateUserOpts)

  fastify.delete("/api/users/:id", removeUserOpts)

  done()
}

fastify.register(routes)

const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

startServer()
