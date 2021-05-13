import { Field, ObjectType } from "type-graphql";

@ObjectType({description: "Information about for successful request"})
export class Message {
    @Field({description: "Message"})
    message: string

    @Field({description: "Status"})
    status: string
}