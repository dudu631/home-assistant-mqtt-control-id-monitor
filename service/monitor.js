var axios = require('axios');
const { loginIfNeeded } = require('./login');

const checkMonitorConfiguration = async (controlDevice) => {
    if (!controlDevice.id) {
        console.error(`Device ${controlDevice.control_id_ip} wasn't configured.`)
        return;
    }
    const sessionId = await loginIfNeeded(controlDevice);
    try {
        const response = await axios
            .post(`http://${controlDevice.control_id_ip}/get_configuration.fcgi?session=${sessionId}`,
                {
                    monitor: ["hostname", "port", "path"],
                }
            );
        if (
            response.data.monitor.hostname === process.env.CONTROL_ID_MONITOR_HOST_IP &&
            response.data.monitor.port === process.env.CONTROL_ID_MONITOR_PORT &&
            response.data.monitor.path === 'api/notifications'
        ) {
            console.log('Monitor configuration correct! ' + `[${process.env.CONTROL_ID_MONITOR_HOST_IP}:${process.env.CONTROL_ID_MONITOR_PORT}]`);
        } else {
            console.log('Monitor configuration on device wrong! Setting new configuration: ' + `${process.env.CONTROL_ID_MONITOR_HOST_IP}:${process.env.CONTROL_ID_MONITOR_PORT}`);
            await axios
                .post(`/set_configuration.fcgi?session=${sessionId}`,
                    {
                        monitor: {
                            hostname: process.env.CONTROL_ID_MONITOR_HOST_IP,
                            port: process.env.CONTROL_ID_MONITOR_PORT
                        }
                    }
                );
        }
    } catch (error) {
        console.error(`Check monitor config error: `, error.message);
        console.error(error);
    }
}

module.exports = { checkMonitorConfiguration }