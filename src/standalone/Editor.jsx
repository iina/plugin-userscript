import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { Button } from "react-bulma-components";

import * as msg from "../msg";

const language = new Compartment();

async function getScriptContent(id) {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.GET_SCRIPT_CONTENT, { id });
    iina.onMessage(msg.GET_SCRIPT_CONTENT_DONE, (s) => resolve(s));
  });
}

async function setScriptContent(id, content) {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.SET_SCRIPT_CONTENT, { id, content });
    iina.onMessage(msg.SET_SCRIPT_CONTENT_DONE, (s) => resolve(s));
  });
}

const Editor = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");

  useEffect(() => {
    const load = async () => {
      const { content } = await getScriptContent(id);
      setCode(decodeURI(content));
    };
    load();
  }, []);

  const saveCode = async () => {
    await setScriptContent(id, encodeURI(code));
  };

  return (
    <div>
      <Button.Group hasAddons={true}>
        <Button to="/" renderAs={Link} color="primary">
          Back
        </Button>
        <Button onClick={saveCode}>Save</Button>
      </Button.Group>
      <h4>Edit {id}</h4>
      Name:
      <CodeMirror
        value={code}
        options={{
          mode: "js",
        }}
        lazyLoadMode={false}
        extensions={[language.of(javascript())]}
        onChange={(value) => {
          setCode(value);
        }}
      />
    </div>
  );
};

export default Editor;
