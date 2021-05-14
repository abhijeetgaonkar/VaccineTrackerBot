import { Mutation, Query, Resolver } from "type-graphql"
import { CacheClient } from "../clients/node-cache"
import { getCenter } from "../services/center"
import { sendMessageToBot } from "../services/sendMessage"
import { Center } from "./center"
import { Message } from "./message"

@Resolver(Center)
export class CenterResolver {

  @Query(() => [Center], {description: "A list of available vaccine center details", nullable: "itemsAndList"})
  async centers(): Promise<Center[]> {
    const response: Center[] = await getCenter()
    return response
  }
}

@Resolver(Message)
export class SendMessageResolver {

  @Mutation(() => Message)
  async sendMessage(): Promise<Message> {
    const chatIds: number[] = CacheClient.get('chatIds')
    await sendMessageToBot(18, chatIds)
    return {
      message: "hello",
      status: "SUCCESS"
    }
  }
}