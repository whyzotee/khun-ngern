import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(cors())
    .use(swagger())
    .get('/', () => 'Khun Ngern API is running')
    .group('/api', (app) => 
        app
            .group('/accounts', (app) =>
                app
                    .get('/', () => 'Get all accounts')
                    .post('/', ({ body }) => 'Create account', {
                        body: t.Object({
                            name: t.String(),
                            type: t.Union([t.Literal('bank'), t.Literal('promptpay')]),
                            bankName: t.Optional(t.String()),
                            accountId: t.String()
                        })
                    })
            )
            .group('/bills', (app) =>
                app
                    .get('/', () => 'Get all bills')
                    .post('/', ({ body }) => 'Create bill', {
                        body: t.Object({
                            title: t.String(),
                            amount: t.Number(),
                            type: t.Union([t.Literal('group'), t.Literal('private')]),
                            targetId: t.String()
                        })
                    })
            )
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
