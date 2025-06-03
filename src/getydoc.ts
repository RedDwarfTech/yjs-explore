import * as Y from "rdyjs";
import { PostgresqlPersistance } from "./postgresql_persistance.js";
import "dotenv/config";

let p = new PostgresqlPersistance();
// p.getYDoc("2d7ed5d1ea664488a89cf1af74eeb462");
p.getYDoc("82e72c00fef346faaac13038d0984fc0");
// p.getYDoc("34d335d6b82843b587ebe09eb1d17318_history");

// p.getYDoc("1ba933f88ff540f9adc9ff9b39f38ff5");
// file id choose
//82e72c00fef346faaac13038d0984fc0
// p.getYDoc("82e72c00fef346faaac13038d0984fc0");
// p.getYDoc("c4d477b30f4d4bfcaa027ce8ce4f048b");
