import knex from 'knex'

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
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            created_at: { type: 'string' },
                            user_id: { type: 'number' },
                            msg_content: { type: 'string' },
                        }
                    }
                }
            }
        },
        handler: async (req, reply) => {
            const messagesData = await client('tab_messages').orderBy('created_at', 'desc')
            reply.send(messagesData)
        }
    })

    app.route({
        method: 'POST',
        url: '/new',
        schema: {
            body: {
                created_at: { type: 'string' },
                user_id: { type: 'number' },
                msg_content: { type: 'string' }
            },
            response: {
                200: { type: 'string' }
            }
        },
        handler: async (req, reply) => {
            await client.insert(req.body).into('tab_messages')

            reply.send('Message sent')
        }
    })

}