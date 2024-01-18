var express = require('express');
var axios = require('axios');
var router = express.Router();

const sessionId = "OmJ/uepriEiaV7334yOdAbzV";

router.post('/notifications/dao', async function (req, res, next) {

  const user_id = req.body.object_changes[0]['values']?.user_id;
  // console.log(`user_id: ${user_id}`);
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
  } catch (error) {
    console.error(error);
  }

  res.sendStatus(200);

});

module.exports = router;
