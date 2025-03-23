import { decoding, encoding } from "lib0";
// @ts-ignore
import syncProtocol from "y-protocols/dist/sync.cjs";

const enc = () => {
    // encode
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, 3);
    const encoded = new TextEncoder().encode("a");
    encoding.writeVarString(encoder, 'test message');
    syncProtocol.writeUpdate(encoder, encoded);
    const message = encoding.toUint8Array(encoder);
    syncProtocol.readVarUint8Array();
  
    // decode
    const decoder = decoding.createDecoder(message);
    const result = decoding.readVarString(decoder);
    syncProtocol.readVarUint8Array();
    console.log(
      'Message content from server::',
      result
    );
  };
  
  enc();