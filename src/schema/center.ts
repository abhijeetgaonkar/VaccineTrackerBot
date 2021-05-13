import { Field, ObjectType } from "type-graphql";
import { Session } from "./session";

@ObjectType({description: "Information about center details"})
export class Center {
    @Field({description: "Identification of a center"})
    centerIdentifier: number

    @Field({description: "Name of the center"})
    name: string

    @Field({description: "Address of the center"})
    address: string

    @Field({description: "In which state center falls under"})
    stateName: string

    @Field({description: "In which district of the state center falls under"})
    districtName: string

    @Field({description: "Area of the center"})
    blockName: string

    @Field({description: "Pincode of the where center falls under"})
    pincode: number

    @Field({description: "Time when vaccination starts for that day"})
    from: string

    @Field({description: "Time when vaccination ends for that day"})
    to: string

    @Field({description: "If the vaccination is paid or free"})
    feeType: string

    @Field(() => [Session], {description: "session details"})
    sessions: Session[]
}