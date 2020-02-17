let Namespace = {
  name: '/player',
  server: <ref *2> Server {
    nsps: {
      '/': [Namespace],
      '/host': [Namespace],
      '/player': [Circular *1]
    },
    parentNsps: Map {},
    _path: '/socket.io',
    _serveClient: true,
    parser: {
      protocol: 4,
      types: [Array],
      CONNECT: 0,
      DISCONNECT: 1,
      EVENT: 2,
      ACK: 3,
      ERROR: 4,
      BINARY_EVENT: 5,
      BINARY_ACK: 6,
      Encoder: [Function: Encoder],
      Decoder: [Function: Decoder]
    },
    encoder: Encoder {},
    _adapter: [Function: Adapter],
    _origins: '*:*',
    sockets: Namespace {
      name: '/',
      server: [Circular *2],
      sockets: [Object],
      connected: [Object],
      fns: [],
      ids: 0,
      rooms: [],
      flags: {},
      adapter: [Adapter],
      _events: [Object: null prototype],
      _eventsCount: 1
    },
    eio: Server {
      clients: [Object],
      clientsCount: 4,
      wsEngine: 'ws',
      pingTimeout: 5000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 100000000,
      transports: [Array],
      allowUpgrades: true,
      allowRequest: [Function: bound ],
      cookie: 'io',
      cookiePath: '/',
      cookieHttpOnly: true,
      perMessageDeflate: [Object],
      httpCompression: [Object],
      initialPacket: [Array],
      ws: [WebSocketServer],
      _events: [Object: null prototype],
      _eventsCount: 1
    },
    httpServer: Server {
      _events: [Object: null prototype],
      _eventsCount: 5,
      _maxListeners: undefined,
      _connections: 5,
      _handle: [TCP],
      _usingWorkers: false,
      _workers: [],
      _unref: false,
      allowHalfOpen: true,
      pauseOnConnect: false,
      httpAllowHalfOpen: false,
      timeout: 0,
      keepAliveTimeout: 5000,
      maxHeadersCount: null,
      headersTimeout: 40000,
      _connectionKey: '6::::3000',
      [Symbol(IncomingMessage)]: [Function: IncomingMessage],
      [Symbol(ServerResponse)]: [Function: ServerResponse],
      [Symbol(asyncId)]: 4
    },
    engine: Server {
      clients: [Object],
      clientsCount: 4,
      wsEngine: 'ws',
      pingTimeout: 5000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 100000000,
      transports: [Array],
      allowUpgrades: true,
      allowRequest: [Function: bound ],
      cookie: 'io',
      cookiePath: '/',
      cookieHttpOnly: true,
      perMessageDeflate: [Object],
      httpCompression: [Object],
      initialPacket: [Array],
      ws: [WebSocketServer],
      _events: [Object: null prototype],
      _eventsCount: 1
    }
  },
  sockets: {
    '/player#tzoTAh1EiFJUEKogAAAB': Socket {
      nsp: [Circular *1],
      server: [Server],
      adapter: [Adapter],
      id: '/player#tzoTAh1EiFJUEKogAAAB',
      client: [Client],
      conn: [Socket],
      rooms: [Object],
      acks: {},
      connected: true,
      disconnected: false,
      handshake: [Object],
      fns: [],
      flags: {},
      _rooms: [],
      _events: [Object: null prototype],
      _eventsCount: 6
    },
    '/player#LGGktr-Zj9hiN0KsAAAD': Socket {
      nsp: [Circular *1],
      server: [Server],
      adapter: [Adapter],
      id: '/player#LGGktr-Zj9hiN0KsAAAD',
      client: [Client],
      conn: [Socket],
      rooms: [Object],
      acks: {},
      connected: true,
      disconnected: false,
      handshake: [Object],
      fns: [],
      flags: {},
      _rooms: [],
      _events: [Object: null prototype],
      _eventsCount: 6,
      type: 1,
      roomCode: 'PSXC',
      playerName: 'val'
    }
  },
  connected: {
    '/player#tzoTAh1EiFJUEKogAAAB': Socket {
      nsp: [Circular *1],
      server: [Server],
      adapter: [Adapter],
      id: '/player#tzoTAh1EiFJUEKogAAAB',
      client: [Client],
      conn: [Socket],
      rooms: [Object],
      acks: {},
      connected: true,
      disconnected: false,
      handshake: [Object],
      fns: [],
      flags: {},
      _rooms: [],
      _events: [Object: null prototype],
      _eventsCount: 6
    },
    '/player#LGGktr-Zj9hiN0KsAAAD': Socket {
      nsp: [Circular *1],
      server: [Server],
      adapter: [Adapter],
      id: '/player#LGGktr-Zj9hiN0KsAAAD',
      client: [Client],
      conn: [Socket],
      rooms: [Object],
      acks: {},
      connected: true,
      disconnected: false,
      handshake: [Object],
      fns: [],
      flags: {},
      _rooms: [],
      _events: [Object: null prototype],
      _eventsCount: 6,
      type: 1,
      roomCode: 'PSXC',
      playerName: 'val'
    }
  },
  fns: [],
  ids: 0,
  rooms: [ 'PSXC' ],
  flags: {},
  adapter: Adapter {
    nsp: [Circular *1],
    rooms: {
      '/player#tzoTAh1EiFJUEKogAAAB': [Room],
      '/player#LGGktr-Zj9hiN0KsAAAD': [Room],
      PSXC: [Room]
    },
    sids: {
      '/player#tzoTAh1EiFJUEKogAAAB': [Object],
      '/player#LGGktr-Zj9hiN0KsAAAD': [Object]
    },
    encoder: Encoder {}
  },
  _events: [Object: null prototype] { connection: [Function (anonymous)] },
  _eventsCount: 1
}