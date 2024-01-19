var axios = require('axios');
const { loginIfNeeded } = require('./login');

const checkMonitorConfiguration = async () => {
    const sessionId = await loginIfNeeded(process.env.CONTROL_ID_SESSION_ID);
    try {
        const response = await axios
            .post(`/get_configuration.fcgi?session=${sessionId}`,
                {
                    monitor: ["hostname", "port", "path"]
                }
            );
        if (
            response.data.monitor.hostname === process.env.CONTROL_ID_MONITOR_HOST &&
            response.data.monitor.port === process.env.CONTROL_ID_MONITOR_PORT &&
            response.data.monitor.path === 'api/notifications'
        ) {
            console.log('Monitor configuration correct! '+`[${process.env.CONTROL_ID_MONITOR_HOST}:${process.env.CONTROL_ID_MONITOR_PORT}]`);
        } else {
            console.log('Monitor configuration on device wrong! Setting new configuration: '+`${process.env.CONTROL_ID_MONITOR_HOST}:${process.env.CONTROL_ID_MONITOR_PORT}`);
            await axios
                .post(`/set_configuration.fcgi?session=${sessionId}`,
                    {
                        monitor: {
                            hostname: process.env.CONTROL_ID_MONITOR_HOST,
                            port: process.env.CONTROL_ID_MONITOR_PORT
                        }
                    }
                );
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { checkMonitorConfiguration }