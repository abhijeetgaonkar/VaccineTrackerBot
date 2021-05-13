import "reflect-metadata"
import path from 'path'
import { buildSchema } from 'type-graphql'
import { GraphQLSchema } from 'graphql'
import { ApolloServer } from "apollo-server"
import { CenterResolver, SendMessageResolver } from "./schema/query"

main()

async function main() {
    const schema = await createGraphqlSchema(path.join(__dirname, '../../schema.graphql'))

    const server = new ApolloServer({
        schema
    })

    const port = process.env.PORT || '5001'

    server.listen({port}).then(({url}) => {
        console.log(`Server running at ${url}`)
    })
}

export async function createGraphqlSchema(schemaOutputPath: string): Promise<GraphQLSchema> {
    const schema = await buildSchema({
        resolvers: [
            CenterResolver,
            SendMessageResolver
        ],
        emitSchemaFile: {
            path: schemaOutputPath,
            commentDescriptions: false,
            sortedSchema: false, // by default the printed schema is sorted alphabetically
        }
    })

    return schema
}