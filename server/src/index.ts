import { Elysia } from 'elysia'
import { node } from '@elysia/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => {
    console.log('elysia')
    return 'Hello Elysia'
  })
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})