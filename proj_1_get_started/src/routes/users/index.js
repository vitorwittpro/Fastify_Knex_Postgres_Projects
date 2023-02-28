import pkg from "pg"

export default async (app) => {

    const { Client } = pkg

    const client = new Client({
        host: "localhost",
        port: 5432,
        user: "postgres",
        database: "postgres",
        password: "docker",
    })

    const knex = require('knex')({
        client: 'postgres',
        connection: {
            host: '127.0.0.1',
            port: 5432,
            user: 'postgres',
            database: 'postgres',
            password: '1234'
        }

    })

    knex.connect();

    client.connect()

    app.route({
        method: 'GET', url: '/', schema: {
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                            email: { type: "string" },
                            password: { type: "string" },
                        },
                    },
                },
            },
        }, handler: async (req, reply) => {
            const usersData = await client.query("SELECT * FROM tab_user")
            reply.send(usersData.rows)
        }
    })

    app.route({
        method: 'GET',
        url: '/:id',
        schema: {
            params: {
                id: { type: "number" },
            },
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                            email: { type: "string" },
                            password: { type: "string" },
                        },
                    },
                },
            },
        }, handler: async (req, reply) => {
            const { id } = req.params

            const userData = await client.query(
                `SELECT u.id, u.name, u.email, u.password FROM tab_user u WHERE id = ${id}`
            )

            reply.send(userData.rows[0])
        }
    })

    app.route({
        method: 'POST',
        url: '/:id',
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' }
                }
            },
            response: {
                200: { type: 'string' }
            }
        },
        handler: async (req, reply) => {
            const { name, email, password } = req.body

            const rows = await client.query('SELECT * FROM tab_user;')

            const id = rows.rowCount + 1

            console.log(`${id}, NOW(), ${name}, ${email}, ${password});`)

            await client.query(`INSERT INTO tab_user VALUES (${id}, NOW(), '${name}', '${email}', '${password}');`)

            reply.send('New user added!')

        }
    })

    app.route({
        method: 'PUT',
        url: '/:id',
        schema: {
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
        },
        handler: async (req, reply) => {
            const { id } = req.params;
            const { name, email, password } = req.body;

            await client.query(`UPDATE tab_user SET name='${name}', email='${email}', password='${password}' WHERE id = ${id};`)

            reply.send('User updated!')
        }
    })

    app.route({
        method: 'DELETE',
        url: '/:id',
        schema: {
            params: {
                id: { type: "string" }
            },
            response: {
                200: { type: "string" }
            }
        },
        handler: async (req, reply) => {
            const { id } = req.params

            await client.query(`DELETE FROM tab_user WHERE id = ${id}`)

            reply.send('User deleted!')
        }
    })
}