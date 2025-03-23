import { decoding, encoding } from "lib0";
// @ts-ignore
import syncProtocol from "y-protocols/dist/sync.cjs";

const enc = () => {
    // encode
    const encoder = encoding.createEncoder();
    const encoded = new TextEncoder().encode("test");
    encoding.writeVarUint(encoder, 1);
    syncProtocol.writeUpdate(encoder, encoded);
    const message = encoding.toUint8Array(encoder);
    
  
    // decode
    const decoder = decoding.createDecoder(message);
    const result = decoding.readVarString(decoder);
    let update = syncProtocol.readUpdate(decoder);
    console.log(
      'Message parse',
      update
    );
  };
  
  enc();