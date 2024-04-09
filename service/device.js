var axios = require('axios');
const { loginIfNeeded } = require('./login');
const { setDevice } = require('./storage');

const getDeviceId = async (controlDevice) => {
    if(controlDevice.id) return;

    const sessionId = await loginIfNeeded(controlDevice);
    try {
        const response = await axios
            .post(`http://${controlDevice.control_id_ip}/load_objects.fcgi?session=${sessionId}`,
                {
                    "object": "devices",
                    "fields": [
                        "id",
                        "name",
                        "ip",
                    ]
                });
        if (response.data && response.data.devices.length === 1) {
            const deviceResponse = response.data.devices[0];
            controlDevice.id = deviceResponse.id;
            controlDevice.session_id = sessionId;
            setDevice(controlDevice);
        } else {
            console.error(`More than 1 device found in device configuration: `, response.data);
        }

    } catch (error) {
        console.error(`Get device id error: `, error.message);
    }
}

module.exports = { getDeviceId }