export const HOST = 'http://localhost:8001'

const AUTH_ROUTE = `${HOST}/api/v1/auth`
const MESSAGES_ROUTE = `${HOST}/api/v1/messages`

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`
export const CONTACTS_LIST_ROUTE = `${AUTH_ROUTE}/get-contacts`
export const GENERATE_TOKEN_ROUTE = `${AUTH_ROUTE}/generate-token`
export const REACTION_MESSAGE_ROUTE = `${AUTH_ROUTE}/reaction-message`

export const ADD_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/add-messages`
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`
export const GET_INITIAL_CONTACT_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`

export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-message`