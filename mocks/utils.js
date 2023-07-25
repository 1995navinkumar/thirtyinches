// delay
import { createResponseComposition, context } from 'msw'

const delayRes = createResponseComposition(null, [
  context.delay(Math.floor(Math.random() * 2000))
])

export {
  delayRes
}
