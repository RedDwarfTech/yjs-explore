// @ts-ignore
import * as Y from "yjs";
import { dbConfig } from "../db_config.js";
import { TeXSync } from "../tex_sync.js";
import * as binary from "lib0/binary.js";
import pg, { QueryResult } from "pg";
import { decoding } from "lib0";
const { Pool } = pg;

export class PostgresqlPersistance {
  pool: pg.Pool;

  constructor() {
    const pool = new Pool({
      host: "reddwarf-postgresql.reddwarf-storage.svc.cluster.local",
      port: "5432",
      database: "yjs",
      user: "postgres",
      password: process.env.PG_PASSWORD,
      max: 100,
      idleTimeoutMillis: 30000,
    });
    this.pool = pool;
  }

  async getPgBulkData(db: pg.Pool, opts: any, docName: string) {
    try {
      let col = [];
      col.push("id");
      col.push("clock");
      if (opts.values) {
        col.push("value");
      }
      if (opts.keys) {
        col.push("key");
      }
      let col_concat = col.join(",");
      const queryPart = "select " + col_concat;
      const fromPart = " from tex_sync ";
      const filterPart =
        " where doc_name = '" +
        docName +
        "' and content_type='update' and clock>=0 and clock < 4429";
      let orderPart = " order by clock asc";
      if (opts.reverse) {
        orderPart = " order by clock desc";
      }
      let limitPart = "";
      if (opts.limit) {
        limitPart = " limit " + opts.limit;
      }
      const sql = queryPart + fromPart + filterPart + orderPart + limitPart;
      let result: QueryResult<TeXSync> = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error("Query error:", err);
      throw err;
    }
  }

  async getYDoc(docName: string): Promise<Y.Doc> {
    const updates: Array<TeXSync> = await this.getPgBulkData(
      this.pool,
      { values: true, keys: false, reverse: false },
      docName
    );
    const ydoc = new Y.Doc();
    ydoc.transact(() => {
      try {
        for (let i = 0; i < updates.length; i++) {
          let update: TeXSync = updates[i];
          let updateVal: Uint8Array = update.value;
          const decoder = decoding.createDecoder(updateVal);
          const structDecoder = new Y.UpdateDecoderV2(decoder);
          console.log(structDecoder);
        }
      } catch (err) {
        console.error("apply update failed", err);
      }
    });
    let txt = ydoc.getText(docName);
    let txt1 = txt.toString();
    console.log(txt1);
    return ydoc;
  }
}
