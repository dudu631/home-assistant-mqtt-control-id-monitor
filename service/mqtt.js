const mqtt = require("mqtt");

const url = process.env.MQTT_URL;

const options = {
    clientId: 'control_id_test',
    username: process.env.MQTT_USER || '',
    password: process.env.MQTT_PW || '',
};

const client = mqtt.connect(url, options);

client.on('connect',  (_pckg) => {
    console.log('MQTT Connected successfully')
    client.publish(
        "homeassistant/sensor/control-id-test/User_Access/config",
        JSON.stringify({
            "state_topic": "homeassistant/sensor/control-id-test/User_Access/state",
            "value_template": "{{ value_json.user_name}}",
            "unique_id": "user_name",
            "name": "User Access",
            "expire_after": 5,
            "device": {
                "identifiers": [
                    "control_id_face_test"
                ],
                "name": "Control Id Face Test Device",
                "manufacturer": "Control Id",
                "model": "Control Id Face Test",
                "sw_version": "1.0.0",
            }
        })
    );
})

const publishEventInformation = (event) => {
    const topic = `homeassistant/sensor/control-id-test/User_Access/state`;
    const message = JSON.stringify({user_name: `${event.name}`});
    client.publish(topic, message);
    console.log('Message State Published!');
}

module.exports = { publishEventInformation };