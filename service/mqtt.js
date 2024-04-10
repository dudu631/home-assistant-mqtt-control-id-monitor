const mqtt = require("mqtt");
const { toDashCase } = require('../utils/index');

const url = process.env.CONTROL_ID_MQTT_CONFIG_SERVER;

const options = {
    clientId: 'control_id_mqtt_addon',
    username: process.env.CONTROL_ID_MQTT_CONFIG_USER || '',
    password: process.env.CONTROL_ID_MQTT_CONFIG_PASSWORD || '',
};

let client;

const connectToMQTTBroker = async () => {
    client = mqtt.connect(url, options);

    return new Promise((resolve, reject) => {
        client.on('reconnect', function () {
            console.log('MQTT Reconnecting...');
        });
        client.on('offline', function () {
            console.log('MQTT Offline');
        })

        client.on('connect', () => {
            console.log('MQTT Connected successfully');
            resolve(client);
        });

        client.on('error', (error) => {
            console.error('Error connecting to MQTT broker:', error);
            reject(error);
        });

    });
}


const publish = async (topic, message, options) => {
    return new Promise((resolve, reject) => {
        client.publish(topic, message, options, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

const configureMqttDevice = async (device) => {
    const DEVICE_NAME_TOPIC = toDashCase(device.control_id_name ?? '');
    await publish(
        `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Acess/config`,
        JSON.stringify({
            "state_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`,
            "json_attributes_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`,
            "value_template": "{{value_json.user_name}}",
            "unique_id": "user_name",
            "name": "User Access Event",
            "icon": "mdi:account-arrow-right",
            "expire_after": process.env.SENSOR_EXPIRATION ?? 5,
            "device": {
                "identifiers": [
                    `${DEVICE_NAME_TOPIC}`
                ],
                "name": `${device.control_id_name}`,
                "manufacturer": "Control ID",
                "model": "Control Id Face",
                "sw_version": "1.0.0",
            }
        })
    );

    await publish(
        `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Last_Access/config`,
        JSON.stringify({
            "state_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`,
            "json_attributes_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`,
            "value_template": "{{value_json.last_access}}",
            "unique_id": "last_access",
            "name": "Last Access",
            "icon": "mdi:account-clock",
            "device_class": "timestamp",
            "device": {
                "identifiers": [
                    `${DEVICE_NAME_TOPIC}`
                ],
            }
        })
    );

    await publish(
        `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Ip/config`,
        JSON.stringify({
            "state_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Options`,
            "json_attributes_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Options`,
            "value_template": "{{value_json.device_ip}}",
            "unique_id": "device_ip",
            "name": "Device IP",
            "icon": "mdi:ip-network-outline",
            "device": {
                "identifiers": [
                    `${DEVICE_NAME_TOPIC}`
                ],
            },
        })
    );
    await publish(
        `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Id/config`,
        JSON.stringify({
            "state_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Options`,
            "json_attributes_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Options`,
            "value_template": "{{value_json.device_id}}",
            "unique_id": "device_id",
            "name": "Device ID",
            "icon": "mdi:identifier",
            "device": {
                "identifiers": [
                    `${DEVICE_NAME_TOPIC}`
                ],
            },
        })
    );

}

const publishDeviceInformation = (device) => {
    const DEVICE_NAME_TOPIC = toDashCase(device.control_id_name ?? '');
    const topic = `homeassistant/sensor/${DEVICE_NAME_TOPIC}/Device_Options`;
    const message = JSON.stringify({
        device_ip: device.control_id_ip,
        device_id: device.id,
    });
    client.publish(topic, message);
    console.log('Device Options Published!');
}


const publishEventInformation = (event, deviceName) => {
    const DEVICE_NAME_TOPIC = toDashCase(deviceName ?? '');
    const topic = `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`;

    const formatTimestamp = (timestamp) => {
        const offsetHours = +3;
        const offsetMilliseconds = offsetHours * 60 * 60 * 1000;
        const date = new Date((timestamp * 1000) + offsetMilliseconds);
        return date.toISOString();
    }

    console.log(event.last_access);
    const message = JSON.stringify({
        user_name: event.name,
        last_access: formatTimestamp(event.last_access),
        user_id: event.id
    });

    client.publish(topic, message);
    console.log('Message Published!');
}

module.exports = { connectToMQTTBroker, publishEventInformation, configureMqttDevice, publishDeviceInformation };