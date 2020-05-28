// const BotChat = require('botframework-directlinejs');
const crypto = require('crypto');
const BASE_URL = `https://directline.botframework.com`;
const TOKEN_GENERATE = `/v3/directline/tokens/generate`;
const INIT_COV = `/v3/directline/conversations`;
const { request } = require('./request');

/**
 * Create an user object
 */
const getUserObject = () => {
    return {
        id: crypto.randomBytes(4).toString('hex'),
        name: "you"
    }
}

/**
 * Returns Request URL and Request Body
 * 
 * @param  {String} type type of the activity
 * @param  {String} text user input
 * @param  {Object} from contains id and name
 * @param  {Object} conversationID conversationID
 */
const postActivityPayload = (type, from, conversationID, text, value, name) => {
    let url = `${BASE_URL}/v3/directline/conversations/${conversationID}/activities`;
    let body = {
        type: type,
        from: from
    }
    if (text) {
        body.text = text
    }
    if (name) {
        body.name = name
    }
    if (value) {
        body.value = {
            triggeredScenario: {
                trigger: value
            }
        }
    }
    return {
        url,
        body
    }
}

/**
 * Return GET request URL with provider conversationID and watermark
 * @param  {String} conversationID Conversation Id
 * @param  {String} watermark Watermark to get the desired reply from the reply stack
 */
const getActivityPayload = (conversationID, watermark) => {
    let url = watermark ? `${BASE_URL}/v3/directline/conversations/${conversationID}/activities?watermark=${watermark}` : `${BASE_URL}/v3/directline/conversations/${conversationID}/activities`;
    return url;
}

/**
 * getToken function is use to get
 * returns
 *  -Bearer Token
 *  -Conversation ID
 * 
 * @param  {String} WEBCHAT_SECRET (Secret key to get the token from directline API)
 */
const getToken = async (WEBCHAT_SECRET) => {
    const token = await request("POST", `${BASE_URL + TOKEN_GENERATE}`, WEBCHAT_SECRET)
    return token
}

/**
 * startConversation will start the conversation
 * return  
 *  - Conversation ID
 *  - Bearer Token
 *  - Socket URL
 * @param  {String} token Bearer Token
 */
const startConversation = async (token) => {
    const body = {
        from: getUserObject()
    };
    const initConversation = await request("POST", `${BASE_URL + INIT_COV}`, token, body)
    initConversation.from = body.from;
    return initConversation
}

/**
 * Post activity to bot
 * @param  {String} type Activity Type
 * @param  {Object} from User id and name
 * @param  {String} conversationID Conversation Id
 * @param  {String} token Access Token
 * @param  {String} text Inbound Text
 * @param  {String} value Can Trigger Scenario with given value 
 * @param  {String} name Activity Name
 * 
 * returns
 *  - Conversation id with watermark (conversationid|watermark)
 */
const postActivity = async (type, from, conversationID, token, text, value, name) => {
    let postObject = postActivityPayload(type, from, conversationID, text, value, name)
    const conversation = await request("POST", postObject.url, token, postObject.body)
    return conversation
}
/**
 * Returns Activity array with conversation related information,
 * what to speak, what to give for suggestion
 * @param  {String} conversationID Conversation id
 * @param  {String} watermark Watermar
 * @param  {String} token Token
 * 
 * returns
 *  - Array of Activitys
 */
const getActivity = async (conversationID, watermark, token) => {
    let url = getActivityPayload(conversationID, watermark);
    console.log(url);
    const activity = await request('GET', url, token)
    return activity;
}
/**
 * Time in microsec
 * @param  {number} time
 */
const wait = async (time) => {
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            resolve()
        },time)
    })
}
module.exports = {
    wait,
    getToken,
    getActivity,
    postActivity,
    startConversation
}