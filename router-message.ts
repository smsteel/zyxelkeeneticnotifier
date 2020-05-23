interface PPPDInfo {
  localIp?: string
  remoteIp?: string
  primaryDNS?: string
  secondaryDNS?: string
}

export class RouterMessage {
  private id: number|null = null
  private service: string|null = null
  private description: string = ''
  private procssId: number|null = null
  private pppdInfoLazy: PPPDInfo|null = null

  constructor (public date: Date, private host: string, private message: string, private protocol: string, public previousMessage: RouterMessage|null) {
    const matches = this.message.match(/<(\d+)>\w{3} \d* \d{2}:\d{2}:\d{2} (\w+)(\[(\d+)\])?: (.+)/)
    if (matches) {
      const [, id, service, , processId, description] = matches
      this.id = parseInt(id)
      this.service = service
      this.description = description
      this.procssId = parseInt(processId)
    }
  }

  public get isPPPD (): boolean {
    return this.service?.toLowerCase() === 'pppd'
  }

  public get isNDM (): boolean {
    return this.service?.toLowerCase() === 'ndm'
  }

  public get isPPPoE (): boolean {
    return this.description.toLowerCase().includes('pppoe')
  }

  public get isInterfaceUp (): boolean {
    return this.description.toLowerCase().includes('interface is up')
  }

  public get isDefaultRoutePPPOE (): boolean {
    return this.description.toLowerCase().includes('adding default route via pppoe')
  }

  public get isExit (): boolean {
    return this.description.toLowerCase().includes('exit')
  }

  public get isDNS (): boolean {
    return this.description.toLowerCase().includes('dns address')
  }

  public get isIP (): boolean {
    return this.description.toLowerCase().includes('ip address')
  }

  public get isLocal (): boolean {
    return this.description.toLowerCase().includes('local')
  }

  public get isRemote (): boolean {
    return this.description.toLowerCase().includes('remote')
  }

  public get isPrimary (): boolean {
    return this.description.toLowerCase().includes('primary')
  }

  public get isSecondary (): boolean {
    return this.description.toLowerCase().includes('secondary')
  }

  public get ip (): string|undefined {
    const matches = this.description.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
    if (!matches) {
      return
    }
    return matches[0]
  }

  public get pppdInfo (): PPPDInfo {
    if (this.pppdInfoLazy) {
      return this.pppdInfoLazy
    }
    let previousMessage = this.previousMessage
    const info: PPPDInfo = {}
    while (previousMessage) {
      if (previousMessage.isIP && previousMessage.isLocal) {
        info.localIp = previousMessage.ip
      } else if (previousMessage.isIP && previousMessage.isRemote) {
        info.remoteIp = previousMessage.ip
      } else if (previousMessage.isDNS && previousMessage.isPrimary) {
        info.primaryDNS = previousMessage.ip
      } else if (previousMessage.isDNS && previousMessage.isSecondary) {
        info.secondaryDNS = previousMessage.ip
      }
      previousMessage = previousMessage.previousMessage
    }
    this.pppdInfoLazy = info
    return info
  }

  public get exitReason (): string | null {
    if (!this.isExit || !this.previousMessage) {
      return null
    }
    return this.previousMessage.description
  }
}
