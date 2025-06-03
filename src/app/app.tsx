import React from "react";
import styles from "./App.module.css";
import { useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { RefObject } from "react";
import { Compartment, EditorState, Extension } from "@codemirror/state";
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
    let wsProvider: any = doSocketIOConn(ydoc, editorAttr);
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
  }

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
