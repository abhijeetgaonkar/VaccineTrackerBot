import NodeCache from "node-cache"
import { chatIds } from "./telegram"

export const CacheClient = new NodeCache()

CacheClient.set('chatIds', chatIds)