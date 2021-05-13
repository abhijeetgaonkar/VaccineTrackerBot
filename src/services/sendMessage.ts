import { CacheClient } from "../clients/node-cache"
import { Bot, oldChatId } from "../clients/telegram"
import { Center } from "../schema/center"
import { Session } from "../schema/session"
import { getCenter } from "./center"

const limit = 2

export async function sendMessageToBot(age = 18) {

    const centersDetails = await getCenter(age)
    let chatId = CacheClient.get('chatId') as number | string
    if (!chatId) {
        chatId = oldChatId
    }

    if (centersDetails.length < 1) {
        Bot.sendMessage(chatId, `Vaccine slots are not available for ${(age===45)? 'above 45' : 'below 45'} at the moment! Please contact CM.`)
        return null
    }

    let copy: Center[] = []
    if (age === 45) {
        copy = centersDetails.slice(0, limit)
    } else {
        copy = centersDetails
    }

    const cacheCentersDetails: Center[] = CacheClient.get(age.toString())
    let result: Center[] = []
    if (cacheCentersDetails) {
        const onlyInA = cacheCentersDetails.filter(comparerCenter(copy))
        const onlyInB = copy.filter(comparerCenter(cacheCentersDetails))
        result = onlyInA.concat(onlyInB)

        if (result.length < 1) {
            CacheClient.set( age.toString(), copy, 3600 )
            Bot.sendMessage(chatId, `No change in slots availability.`)
            return null
        }
    } else {
        result = copy
    }

    CacheClient.set( age.toString(), copy, 3600 )

    for (const center of result) {
        for (const session of center.sessions) {
            const messageText = `
            Center Name: ${center.name}
            Age Group: ${session.ageLimit}
            Date: ${session.date}
            Available Capacity: ${session.availableCapacity}
            Fee Type: ${center.feeType}
            Vaccine: ${session.vaccineName}`

            Bot.sendMessage(chatId, messageText)

            // delayf of 1 second so that we dont bombard the chat
            await delay(1000)
        }
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) )
}

function comparerCenter(otherArray: Center[]){
    return function(current: Center){
        return otherArray.filter(function(other) {
            if(other.centerIdentifier == current.centerIdentifier) {
                const onlyInA = other.sessions.filter(comparerSesions(current.sessions))
                const onlyInB = current.sessions.filter(comparerSesions(other.sessions))
                const result = onlyInA.concat(onlyInB)

                if (result.length > 0) {
                    return true
                }
            }
            return false
        }).length == 0;
    }
}

function comparerSesions(otherArray: Session[]){
    return function(current: Session){
        return otherArray.filter(function(other) {
            if (other.id == current.id) {
                if (other.ageLimit === current.ageLimit && other.availableCapacity !== current.availableCapacity) {
                    return true
                }
            }
            return false
        }).length == 0;
    }
}