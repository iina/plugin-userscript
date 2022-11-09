import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { css } from "@emotion/css";
import CodeMirror from "@uiw/react-codemirror";
import { Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { Button, Level, Form } from "react-bulma-components";

import * as msg from "../msg";

import { EditorView } from "@codemirror/view";

const FontSizeTheme = EditorView.theme({
  "&": {
    fontSize: "11pt",
  },
});

const FontSizeThemeExtension = [FontSizeTheme];

const language = new Compartment();

async function getScriptContent(id) {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.GET_SCRIPT_CONTENT, { id });
    iina.onMessage(msg.GET_SCRIPT_CONTENT_DONE, (s) => resolve(s));
  });
}

async function getScriptInfo(id) {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.GET_SCRIPT_INFO, { id });
    iina.onMessage(msg.GET_SCRIPT_INFO_DONE, (s) => resolve(s));
  });
}

async function setScriptContent(id, content) {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.SET_SCRIPT_CONTENT, { id, content });
    iina.onMessage(msg.SET_SCRIPT_CONTENT_DONE, (s) => resolve(s));
  });
}

async function setScriptName(id, name) {
  console.log(name);
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.SET_SCRIPT_INFO, { id, name });
    iina.onMessage(msg.SET_SCRIPT_INFO_DONE, (s) => resolve(s));
  });
}

const Editor = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [info, setInfo] = useState({});

  useEffect(() => {
    const load = async () => {
      const { content } = await getScriptContent(id);
      const info = await getScriptInfo(id);
      setCode(decodeURI(content));
      setInfo(info);
    };
    load();
  }, []);

  const saveCode = async () => {
    await setScriptContent(id, encodeURI(code));
  };

  const haneleNameChange = async (event) => {
    const name = event.target.value;
    await setScriptName(id, name);
    setInfo({ ...info, name });
  };

  const style = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;

    .top {
      padding: 16px;
      margin: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    }

    .editor {
      width: 100%;
      height: 100%;
      overflow: scroll;
    }
  `;

  return (
    <div className={style}>
      <Level className="top" breakpoint="mobile">
        <Level.Side align="left">
          <Level.Item>
            <Button.Group hasAddons={true} size="small">
              <Button to="/" renderAs={Link} color="primary">
                Back
              </Button>
              <Button onClick={saveCode}>Save</Button>
            </Button.Group>
          </Level.Item>
        </Level.Side>
        <Level.Side align="right">
          <Level.Item>
            <h4>Script Name</h4>
          </Level.Item>
          <Level.Item>
            <Form.Input
              value={info.name}
              onChange={haneleNameChange}
              size="small"
            ></Form.Input>
          </Level.Item>
        </Level.Side>
      </Level>
      <CodeMirror
        className="editor"
        value={code}
        options={{
          mode: "js",
        }}
        lazyLoadMode={false}
        extensions={[language.of(javascript()), FontSizeThemeExtension]}
        onChange={(value) => {
          setCode(value);
        }}
      />
    </div>
  );
};

export default Editor;
