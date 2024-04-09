var express = require('express');
var axios = require('axios');
const { publishEventInformation } = require('../service/mqtt');
const { loginIfNeeded } = require('../service/login');
const { getDevice } = require('../service/storage');
var router = express.Router();

router.post('/notifications/dao', async function (req, res, next) {

  const user_id = req.body.object_changes[0]['values']?.user_id;
  // console.log(req.body);
  const device_id = req.body.device_id;
  const device = getDevice(device_id);

  if(!device){
    console.error(`Device ${device_id} not found in storage.`);
    return;
  }

  const sessionId = await loginIfNeeded(device);
  try {

    const response = await axios
      .post(`http://${device.control_id_ip}/load_objects.fcgi?session=${sessionId}`,
        {
          "object": "users",
          "fields": [
            "id",
            "name",
            "last_access"
          ],
          "where": {
            "users": {
              "id": Number(user_id)
            }
          }
        });
    console.log('User found! data:');
    console.log(response.data);
    publishEventInformation(response.data.users[0], device.control_id_name);
  } catch (error) {
    console.error(error.message);
  }

  res.sendStatus(200);
});

module.exports = router;
