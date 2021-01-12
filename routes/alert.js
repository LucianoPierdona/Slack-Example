const Axios = require('axios');
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
  const symbol = 'SHOP';
  const response = await Axios.get(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${process.env.API_KEY}`
  );
  const lastRefreshed = response.data['Meta Data']['3. Last Refreshed'];
  const lastClose =
    response.data['Time Series (5min)'][lastRefreshed]['4. close'];

  await Axios.post(
    `https://hooks.slack.com/services/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`,
    {
      text: `Alert! Alert! *${symbol}* is now $${lastClose}`,
    }
  );

  res.json(lastClose);
});

module.exports = router;
