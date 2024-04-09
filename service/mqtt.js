const mqtt = require("mqtt");
const { toDashCase } = require('../utils/index');

const url = process.env.CONTROL_ID_MQTT_CONFIG_SERVER;

const options = {
    clientId: 'control_id_test',
    username: process.env.CONTROL_ID_MQTT_CONFIG_USER || '',
    password: process.env.CONTROL_ID_MQTT_CONFIG_PASSWORD || '',
};

const client = mqtt.connect(url, options);

const DEVICE_NAME_TOPIC = toDashCase(process.env.CONTROL_ID_NAME ?? '');

client.on('connect', (_pckg) => {
    console.log('MQTT Connected successfully')
    client.publish(
        `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access/config`,
        JSON.stringify({
            "state_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`,
            "json_attributes_topic": `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`,
            "value_template": "{{value_json.user_name}}",
            "unique_id": "user_name",
            "name": "User Access",
            "expire_after": process.env.SENSOR_EXPIRATION ?? 5,
            "device": {
                "identifiers": [
                    `${DEVICE_NAME_TOPIC}`
                ],
                "name": `${process.env.CONTROL_ID_NAME} Device`,
                "manufacturer": "Control ID",
                "model": "Control Id Face",
                "sw_version": "1.0.0",
            }
        })
    );
})

const publishEventInformation = (event) => {
    const topic = `homeassistant/sensor/${DEVICE_NAME_TOPIC}/User_Access`;
    const message = JSON.stringify({
        user_name: event.name,
        last_access: event.last_access,
        user_id: event.id
    });

    client.publish(topic, message);
    console.log('Message Published!');
}

module.exports = { publishEventInformation };