const mqtt = require("mqtt");

const url = 'mqtt://192.168.0.xxx:1883'

const options = {
    clientId: 'control_id_test',
    username: '',
    password: '',
}

const client = mqtt.connect(url, options);

client.on('connect',  (err) => {
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
    console.log('published!');
}

module.exports = { publishEventInformation };