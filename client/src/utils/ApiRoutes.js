export const HOST = 'http://localhost:8080'

const AUTH_ROUTE = `${HOST}/api/v1/auth`
const MESSAGES_ROUTE = `${HOST}/api/v1/messages`

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`
export const CONTACTS_LIST_ROUTE = `${AUTH_ROUTE}/get-contacts`

export const ADD_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/add-messages`
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`
export const GET_INITIAL_CONTACT_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`