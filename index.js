const bridge = require('./healthbot')
module.exports = {
    getToken: bridge.getToken,
    getActivity: bridge.getActivity,
    postActivity: bridge.postActivity,
    startConversation: bridge.startConversation,
    wait: bridge.wait
};
