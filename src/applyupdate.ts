import * as Y from "yjs";
import { PostgresqlPersistance } from "./postgresql_persistance.js";
import "dotenv/config";
import { decoding, encoding } from "lib0";

const applyUpdate = () => {
  const ydoc = new Y.Doc();
  const yarray = ydoc.getArray("sharedArray");
  const updateFromClientA = Y.encodeStateAsUpdate(ydoc);
  yarray.insert(0, ["Hello from Client A"]);

  yarray.observe((event) => {
    console.log("Y.Array changed:", yarray.toArray());
  });

  const updateFromClientB = Y.encodeStateAsUpdate(ydoc);
  yarray.insert(1, ["Hello from Client B"]);
  Y.applyUpdate(ydoc, updateFromClientA);
  Y.applyUpdate(ydoc, updateFromClientB);
  console.log("text:", ydoc.getArray("sharedArray").get(0));
  console.log("Final document content:", yarray.toArray());
};

const applyUpdateDemo = () => {
  const doc1 = new Y.Doc();
  const doc2 = new Y.Doc();

  doc1.on("update", (update) => {
    Y.applyUpdate(doc2, update);
  });

  doc2.on("update", (update) => {
    Y.applyUpdate(doc1, update);
  });

  // All changes are also applied to the other document
  doc1.getArray("myarray").insert(0, ["Hello doc2, you got this?"]);
  doc1.getArray("myarray").insert(1,["d"]);
  let output = doc2.getArray("myarray").toArray() // => 'Hello doc2, you got this?'
  console.log(output);
};
let p = new PostgresqlPersistance();
// p.getYDoc("2d7ed5d1ea664488a89cf1af74eeb462");
p.getYDoc("2c851b5c327e431ea2d58b186e7f680a");
// p.getYDoc("1ba933f88ff540f9adc9ff9b39f38ff5");
// file id choose
//82e72c00fef346faaac13038d0984fc0
// p.getYDoc("82e72c00fef346faaac13038d0984fc0");
// p.getYDoc("c4d477b30f4d4bfcaa027ce8ce4f048b");

