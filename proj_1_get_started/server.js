import Fastify from "fastify";
import pkg from "pg";

const fastify = Fastify({ logger: true });
const { Client } = pkg;

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: users,
  password: "1234",
});

fastify.register(client);
fastify.register(routes);

// ROUTES
const routes = (fastify, options, done) => {
  fastify.get("/", (req, reply) => {
    reply.send("Connection OK");
  });

  fastify.get("/api/users", getUsersOpts);

  fastify.get("/api/users/:id", getUserOpts);

  done();
};

const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

const users = [
  {
    id: 1,
    name: "Orochi",
    email: "orochi@gmail.com",
    password: "1234",
  },
  {
    id: 2,
    name: "Ferca",
    email: "ferca@gmail.com",
    password: "1234",
  },
];

// SCHEMA
const userType = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
};

const getUsersSchema = {
  response: {
    200: {
      type: "array",
      items: userType,
    },
  },
};

// HANDLER

const getUsersHandler = (req, reply) => {
  client.query("SELECT * FROM users", () => {});
};

const getUserHandler = (req, reply) => {};

// OPTIONS

const getUsersOpts = {
  schema: getUsersSchema,
  handler: getUsersHandler,
};

const getUserOpts = {
  schema: getUsersSchema,
  handler: getUserHandler,
};

startServer();
