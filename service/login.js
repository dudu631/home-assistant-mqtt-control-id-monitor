const { default: axios } = require("axios");

const config = {
    user: '',
    pw: ''
}

const login = async () => {
    try {
        const response = await axios
            .post(`/login.fcgi`,
                {
                    login: 'admin',
                    password: 'admin'
                }
            );
        return response.data.session;
    } catch (error) {
        console.error(`Login error`, error);
    }
};

const isValidSession = async (sessionId) => {
    try {
        const response = await axios
            .post(`/session_is_valid.fcgi?session=${sessionId}`);
        return response.data.session_is_valid;
    } catch (error) {
        console.error(error);
    }
};

const loginIfNeeded = async (sessionId) => {
    const is_valid = await isValidSession(sessionId);
    if (!sessionId || !is_valid) {
        const session = await login();
        console.log('No session ID or not valid. New session_id: ' + session);
        return session;
    }
    console.log('Session still valid: ' + sessionId);
    return sessionId;
};

module.exports = { login, isConnected: isValidSession, loginIfNeeded };