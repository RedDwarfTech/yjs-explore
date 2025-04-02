import * as Y from "rdyjs";
import { SocketIOClientProvider } from "texhub-broadcast/dist/websocket/conn/socket_io_client_provider";

const mainDoc = new Y.Doc()
//const provider = new SocketIOClientProvider("", "roomname", mainDoc)

mainDoc.on('subdocs', ({added, removed, loaded}) => {
  loaded.forEach(subdoc => {
    //provider.addSubdoc(subdoc) 
  })
})

const subDoc = mainDoc.get('sub',Y.Map)