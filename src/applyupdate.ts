import * as Y from "rdyjs";
import { PostgresqlPersistance } from "./postgresql_persistance.js";
import "dotenv/config";

let p = new PostgresqlPersistance();
// p.getYDoc("2d7ed5d1ea664488a89cf1af74eeb462");
// p.getYDoc("2c851b5c327e431ea2d58b186e7f680a");
// p.getYDoc("34d335d6b82843b587ebe09eb1d17318_history");

// p.getYDoc("1ba933f88ff540f9adc9ff9b39f38ff5");
// file id choose
//82e72c00fef346faaac13038d0984fc0
// p.getYDoc("82e72c00fef346faaac13038d0984fc0");
// p.getYDoc("c4d477b30f4d4bfcaa027ce8ce4f048b");

const testSnapshot = () => {
  const ydoc = new Y.Doc({ gc: false });
  ydoc.getText().insert(0, "world!");
  const snapshot = Y.snapshot(ydoc);
  ydoc.getText().insert(0, "hello ");
  const restored = Y.createDocFromSnapshot(ydoc, snapshot);
  console.log(restored.getText().toString());
};

testSnapshot();
