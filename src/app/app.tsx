import React from "react";
import styles from "./App.module.css";
import { useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { RefObject } from "react";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { SocketIOClientProvider } from "texhub-broadcast/dist/websocket/conn/socket_io_client_provider";
import { ManagerOptions, SocketOptions } from "socket.io-client";

const App: React.FC = () => {
  const edContainer = useRef<HTMLDivElement>(null);
  var ydoc: Y.Doc;
  const preInitEditor = (file: any) => {
    const editorAttr = {
      projectId: "props.projectId",
      docId: file.file_id,
      name: file.name,
    };
    initSocketIOEditor(editorAttr, null, edContainer);
  };

  const metadata = {
    labels: new Set<string>([]),
    packageNames: new Set<string>([]),
    commands: [],
    referenceKeys: new Set<string>([]),
    fileTreeData: {
      _id: "1",
      name: "a.tex",
      docs: [],
      folders: [],
      fileRefs: [],
    },
  };

  function initSocketIOEditor(
    editorAttr: any,
    activeEditorView: any,
    edContainer: RefObject<HTMLDivElement>
  ) {
    let docOpt = {
      guid: editorAttr.docId,
      collectionid: editorAttr.projectId,
      // https://discuss.yjs.dev/t/error-garbage-collection-must-be-disabled-in-origindoc/2313
      gc: false,
    };
    ydoc = new Y.Doc(docOpt);
    // setCurYDoc(ydoc);
    const ytext: Y.Text = ydoc.getText(editorAttr.docId);
    const undoManager = new Y.UndoManager(ytext);
    let wsProvider: SocketIOClientProvider = doSocketIOConn(ydoc, editorAttr);
    ydoc.on("update", (update, origin) => {});
    const texEditorState = EditorState.create({
      doc: ytext.toString(),
      extensions: createExtensions({
        ytext: ytext,
        wsProvider: wsProvider,
        undoManager: undoManager,
        docName: docOpt.guid,
        metadata: metadata,
      }),
    });
    if (
      edContainer.current &&
      edContainer.current.children &&
      edContainer.current.children.length > 0
    ) {
      return;
    }
    const editorView: EditorView = new EditorView({
      state: texEditorState,
      parent: edContainer.current!,
    });
    //setEditorInstance(editorView);
    // setSocketIOProvider(wsProvider);
  }

  const doSocketIOConn = (ydoc: Y.Doc, editorAttr: any): any => {
    // avoid the cached expired token
    let options: Partial<ManagerOptions & SocketOptions> = {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 15000,
      reconnectionDelayMax: 15000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      tryAllTransports: true,
      path: "/sync",
      auth: {
        //token: getAccessToken(),
      },
    };
    const wsProvider: SocketIOClientProvider = new SocketIOClientProvider(
      process.env.SOCKET_URL!,
      editorAttr.docId,
      ydoc,
      options,
      {
        maxBackoffTime: 1000000,
        params: {
          // https://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html#query-param
          docId: editorAttr.docId,
          // from: "web_tex_editor",
        },
      }
    );
    const uInfo = localStorage.getItem("userInfo");
    if (!uInfo) {
      console.error("user info is null", uInfo);
      return wsProvider;
    }
    const user: any = JSON.parse(uInfo);
    const ydocUser = {
      name: user.nickname,
      //color: userColor.color,
      //colorLight: userColor.light,
    };
    const permanentUserData = new Y.PermanentUserData(ydoc);
    permanentUserData.setUserMapping(ydoc, ydoc.clientID, ydocUser.name);
    wsProvider.awareness.setLocalStateField("user", ydocUser);
    wsProvider.on("connect_error", (err: any) => {
      console.error("connection error:" + editorAttr.docId, err);
      // the reason of the error, for example "xhr poll error"
      console.error(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.error(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.error(err.context);
    });
    wsProvider.on("message", (event: MessageEvent) => {
      debugger;
      console.log("socketiomessage", event);
    });
    wsProvider.on("status", (event: any) => {});
    return wsProvider;
  };

  const createExtensions = (options: Record<string, any>): Extension[] => [
    yCollab(options.ytext, options.wsProvider.awareness, options.undoManager),
    // https://stackoverflow.com/questions/78011822/how-to-fix-the-codemirror-text-infilite-copy
    //highlight_extension
  ];

  return (
    <div className={styles.container}>
      <div>
        <button type="button">切换</button>
      </div>
      <div>
        <div ref={edContainer} className={styles.editorContainer}></div>
      </div>
    </div>
  );
};

export default App;
