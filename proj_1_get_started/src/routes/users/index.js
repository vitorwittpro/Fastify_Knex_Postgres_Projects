import knex from "knex"

export default async (app) => {

    const client = knex({
        client: 'postgres',
        connection: {
            host: '127.0.0.1',
            port: 5432,
            user: 'postgres',
            database: 'postgres',
            password: 'docker'
        }

    })

    app.route({
        method: 'GET',
        url: '/',
        schema: {
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
            const usersData = await client.select().table('tab_user')
            reply.send(usersData)
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

            const userData = await client('tab_user').where('id', id)

            console.log(userData)
            reply.send(userData)
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
            await client.insert(req.body).into('tab_user')

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
            // const { name, email, password } = req.body;

            await client
                .where({ id: id })
                .update(req.body)
                .into('tab_user')

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

            await client('tab_user')
                .where({ id: id })
                .del()

            reply.send('User deleted!')
        }
    })
}