import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { css } from "@emotion/css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";

import * as msg from "../msg";

import { useColorScheme } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";

import ArrowBack from "@mui/icons-material/ArrowBack";
import Save from "@mui/icons-material/Save";
import Done from "@mui/icons-material/Done";
import { Alert } from "@mui/joy";

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
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.SET_SCRIPT_INFO, { id, name });
    iina.onMessage(msg.SET_SCRIPT_INFO_DONE, (s) => resolve(s));
  });
}

const Editor = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [info, setInfo] = useState({});
  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);

  function postNotification(message, type = "success") {
    if (notifTimeout.current) {
      clearTimeout(notifTimeout.current);
    }
    setNotif({ message, type });
    notifTimeout.current = setTimeout(() => {
      setNotif(null);
    }, 2000);
  }

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
    postNotification("Saved.");
  };

  const haneleNameChange = async (event) => {
    const name = event.target.value;
    setInfo({ ...info, name });
  };

  const commitNameChange = async () => {
    await setScriptName(id, info.name);
    postNotification("Name updated.");
  };

  const Toolbar = () => (
    <Sheet
      variant="outlined"
      sx={{ width: "100%", boxShadow: "sm", borderRadius: "sm", p: "8px" }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <ButtonGroup size="sm">
          <Button
            startDecorator={<ArrowBack />}
            variant="soft"
            component={Link}
            to="/"
          >
            Exit
          </Button>
          <Button startDecorator={<Save />} onClick={saveCode}>
            Save
          </Button>
        </ButtonGroup>
        <Input
          variant="outlined"
          value={info.name}
          onChange={haneleNameChange}
          endDecorator={
            <Button color="neutral" onClick={commitNameChange}>
              <Done />
            </Button>
          }
        />
      </Stack>
    </Sheet>
  );

  const { mode, systemMode } = useColorScheme();
  const colorMode = systemMode || mode;

  const notificationContainer = css`
    position: fixed;
    z-index: 100;
    right: 16px;
    bottom: 16px;
    width: 240px;
  `;

  const container = css`
    display: flex;
    flex-direction: column;
    height: 100%;

    .cm-outer-container {
      flex: 1;
      height: 100%;
    }

    .cm-editor {
      height: 100%;
      position: relative;
    }

    .cm-scroller {
      position: absolute !important;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
    }
  `;

  return (
    <div style={{ padding: "8px", height: "100vh" }}>
      <div className={notificationContainer}>
        {notif === null ? null : (
          <Alert variant="solid" invertedColors color={notif.type}>
            <Typography level="body-sm">{notif.message}</Typography>
          </Alert>
        )}
      </div>
      <div className={container}>
        <Toolbar />
        <Sheet
          variant="outlined"
          sx={{
            width: "100%",
            boxShadow: "sm",
            borderRadius: "sm",
            p: "8px",
            height: "100%",
            marginTop: "8px",
          }}
        >
          <CodeMirror
            className="cm-outer-container"
            value={code}
            lazyLoadMode={false}
            theme={colorMode === "dark" ? xcodeDark : xcodeLight}
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => {
              setCode(value);
            }}
          />
        </Sheet>
      </div>
    </div>
  );
};

export default Editor;
