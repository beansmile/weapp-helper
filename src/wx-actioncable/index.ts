import { adapters } from '../actioncable'
import { WebSocket } from '../wx-websocket'

adapters.WebSocket = WebSocket

export * from '../actioncable'
