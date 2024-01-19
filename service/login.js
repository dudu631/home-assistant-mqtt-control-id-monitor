const { default: axios } = require("axios");

const login = async () => {
    try {
        const response = await axios
            .post(`/login.fcgi`,
                {
                    login: process.env.CONTROL_ID_USER,
                    password: process.env.CONTROL_ID_PW
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
        process.env.CONTROL_ID_SESSION_ID = session;
        console.log(`No session ID or not valid. New session_id: [ ${session} ]`);
        return session;
    }
    console.log('Session still valid: ' + sessionId);
    return sessionId;
};

module.exports = { login, isValidSession, loginIfNeeded };