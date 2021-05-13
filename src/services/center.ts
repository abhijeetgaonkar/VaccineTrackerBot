import request from "got"
import { Center } from "../schema/center"
import { Session } from "../schema/session"

type center = {
    center_id: number,
    name: string,
    address: string,
    state_name: string,
    district_name: string,
    block_name: string,
    pincode: number,
    lat: number,
    long: number,
    from: string,
    to: string,
    fee_type: string
    sessions: session[]
}

type session = {
    session_id: string,
    date: string,
    available_capacity: number,
    min_age_limit: number,
    vaccine: string,
    slots: string[]
}

export async function getCenter(age = 18): Promise<Center[]> {
    const url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict'

    const districtIds = [151, 152]

    const date = getDate()
    let centersDetails: center[] = []
    for (const districtId of districtIds) {
        const options = {
            searchParams: {
                district_id: districtId,
                date: date
            }
        }
        const response = await request(url, options)
       
        centersDetails =  (centersDetails.length < 1 ) ? 
                            JSON.parse(response.body)['centers'] : centersDetails.concat(JSON.parse(response.body)['centers'])
    }
    
    return centersDetails.map(center => translateCenterSchema(center, age)).filter(Boolean)
}

function getDate() {
    const date = new Date(Date.now())
    let dd = date.getDate().toString()
    let mm = (date.getMonth() + 1).toString()

    const yyyy = date.getFullYear()
    return dd + '/' + mm + '/' + yyyy
}

function translateCenterSchema(center: center, age: number): Center {
    if (!center) {
        return null
    }
    
    const sessions: Session[] = []

    for (const session of center.sessions) {
        if(session.available_capacity > 0 && session.min_age_limit === age) {
            const sessionObject = {
                id: session.session_id,
                date: session.date,
                availableCapacity: session.available_capacity,
                ageLimit: session.min_age_limit,
                vaccineName: session.vaccine,
                slots: session.slots
            }
            sessions.push(sessionObject)
        }
    }

    if (sessions.length < 1) return null

    return {
        centerIdentifier: center.center_id,
        name: center.name,
        address: center.address,
        stateName: center.state_name,
        districtName: center.district_name,
        blockName: center.block_name,
        pincode: center.pincode,
        from: center.from,
        to: center.to,
        feeType: center.fee_type,
        sessions: sessions
    }
}