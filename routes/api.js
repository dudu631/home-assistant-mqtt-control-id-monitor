var express = require('express');
var axios = require('axios');
const { publishEventInformation } = require('../service/mqtt');
const { loginIfNeeded } = require('../service/login');
var router = express.Router();

router.post('/notifications/dao', async function (req, res, next) {

  const user_id = req.body.object_changes[0]['values']?.user_id;
  console.log(req.body.object_changes[0]);

  const sessionId = await loginIfNeeded(process.env.CONTROL_ID_SESSION_ID);
  try {

    const response = await axios
      .post(`/load_objects.fcgi?session=${sessionId}`,
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
    console.log('user found! data:');
    console.log(response.data);
    publishEventInformation(response.data.users[0]);
  } catch (error) {
    console.error(error);
  }

  res.sendStatus(200);
});

module.exports = router;
