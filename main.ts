import SysLogServer from 'syslog-server'
import { RouterMessage } from './router-message'
import { WindowsToaster } from 'node-notifier'
import path from 'path'
import moment, { Moment } from 'moment'
import opn from 'opn'
import dedent from 'dedent-js'

const syslogServer: SysLogServer = new SysLogServer()

interface SysLogData {
  date: Date
  host: string
  message: string
  protocol: string
}

const notifier = new WindowsToaster()
let previousMessage: RouterMessage|null = null
let lastDisconnectNotificationDate: Moment|null = null
let useSound = true

function notify (title: string, message: string) {
  notifier.notify({
    title,
    message,
    icon: path.join(__dirname, 'zyxel.png'),
    sound: useSound
  }, (error, message) => {
    if (error) {
      console.error(error)
      return
    }
    switch (message) {
      case undefined:
        opn('http://192.168.1.1/#tools.log')
        break
      case 'timeout':
        break
      case 'dismissed':
        useSound = false
        break
    }
  })
}

syslogServer.on('message', (data: SysLogData) => {
  const message = new RouterMessage(data.date, data.host, data.message, data.protocol, previousMessage)
  if (message.isPPPD &&
    message.isExit &&
    message.exitReason &&
    (lastDisconnectNotificationDate === null || moment().diff(lastDisconnectNotificationDate, 'minutes') > 30)
  ) {
    notify('Router PPPD exited', message.exitReason)
    lastDisconnectNotificationDate = moment()
  } else if (
    message.isNDM &&
    message.isPPPoE &&
    message.isDefaultRoutePPPOE
  ) {
    lastDisconnectNotificationDate = null
    notify(
      'PPPoE connected',
      dedent`
      Local IP: ${message.pppdInfo.localIp}
      Remote IP: ${message.pppdInfo.remoteIp}
      Primary DNS: ${message.pppdInfo.primaryDNS}
      Secondary DNS: ${message.pppdInfo.secondaryDNS}`
    )
  } else {
    previousMessage = message
  }
})

syslogServer.start()
