import { Field, ObjectType } from "type-graphql";

@ObjectType({description: "Information about session"})
export class Session {
    @Field({description: "Identification of a session"})
    id: string

    @Field({description: "Date when the session is available"})
    date: string

    @Field({description: "Number of available doses"})
    availableCapacity: number

    @Field({description: "Minimum age limit"})
    ageLimit: number

    @Field({description: "Name of the vaccine"})
    vaccineName: string

    @Field(() => [String], {description: "List of available slots timings"})
    slots: string[]
}