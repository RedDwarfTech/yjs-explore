// @ts-ignore
import encoding from "lib0/dist/encoding.cjs";
import NodeBuffer, {Buffer} from "node:buffer";
// @ts-ignore
import decoding from "lib0/dist/decoding.cjs";
import { readVarUint8Array } from "lib0/decoding.js";
function base64ToUint8Array(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return new Uint8Array(buffer);
  }

const func = () => {
    const b64 ="AAG9AQADxLmwsQgJAB8gHT8dXgloCnUCeAGnAdUCjwQB7cvFkAYCAAQKAaW8jTgxAARPCmownAEoxwEBywEv/AEJhgI3wAIf4QJCpgMBqQMBrAMZ6wMB7QMB7wMBgwSnA/8JNbYKRv4KAoELEJMLJb8LAcELHeALEPILJ6AMF7kMEMsMJ/QMAfYMQ7sNJ+QNCe4NAfANKJoOAZwOHrwOFtQOEOYOFv4OH58PAqIPGb0PBcMPPIEQJ6oQAq0QFsUQAQ==";
    const message = base64ToUint8Array(b64);
    const decoder = decoding.createDecoder(message);
    const subDocMessageType: number = decoding.readVarUint(decoder);
    let bf = Buffer.from(message);
    console.log(process.versions)
    let isUtf8 = NodeBuffer.isUtf8(bf);
    let rmain = readVarUint8Array(decoder);
    let parsed = (new TextDecoder('utf-8', { fatal: false, ignoreBOM: true })).decode(rmain);
    const docGuid = decoding.readVarString(decoder);
    console.log(docGuid);
}


func();
