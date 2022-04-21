const express = require('express')
const { AttestationChecker } = require('./attestation-checker')
const { config } = require('./config')
const { SMSNotifier } = require('./sms-notifier')

const app = express()
const port = 3000

const notifer = new SMSNotifier()
const checker = new AttestationChecker(config, notifer)
checker.start();

// TODO: ADD or remove pubkeys
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
