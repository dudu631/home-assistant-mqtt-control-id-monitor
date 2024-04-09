const { default: axios } = require("axios");
const { setDevice } = require("./storage");

const login = async (controlDevice) => {
    try {
        const response = await axios
            .post(`http://${controlDevice.control_id_ip}/login.fcgi`,
                {
                    login: process.env.CONTROL_ID_USER,
                    password: process.env.CONTROL_ID_PW
                }
            );
        return response.data.session;
    } catch (error) {
        console.error(`${controlDevice.control_id_name} - Login error: `, error.message);
    }
};

const isValidSession = async (controlDevice, sessionId) => {
    if(!sessionId) return false;
    try {
        const response = await axios
            .post(`http://${controlDevice.control_id_ip}/session_is_valid.fcgi?session=${sessionId}`);
        return response.data.session_is_valid;
    } catch (error) {
        console.error(`${controlDevice.control_id_name} - Session Validation error: `, error.message);
    }
};

const loginIfNeeded = async (controlDevice) => {
    const is_valid = await isValidSession(controlDevice, controlDevice.session_id);
    if (!is_valid) {
        const session = await login(controlDevice);
        controlDevice.session_id = session;
        if(controlDevice.id) // at start we still dont have this info
            setDevice(controlDevice);
        console.log(`${controlDevice.control_id_name} - No session ID or not valid. New session_id: [ ${session} ]`);
        return session;
    }
    console.log(`${controlDevice.control_id_name} - Session still valid: ` + controlDevice.session_id);
    return controlDevice.session_id;
};

module.exports = { login, isValidSession, loginIfNeeded };