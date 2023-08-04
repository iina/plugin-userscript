import React, { useEffect, useState } from "react";
// import { css } from "@emotion/css";
import { Link, useHistory } from "react-router-dom";
import { css } from "@emotion/css";
import * as msg from "../msg";
import { uuidv4 } from "../utils";

import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Table from "@mui/joy/Table";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";

import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Code from "@mui/icons-material/Code";

async function loadUserScripts() {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.LOAD_SCRIPTS);
    iina.onMessage(msg.LOAD_SCRIPTS_DONE, (s) => resolve(s));
  });
}

async function saveUserScripts(scripts) {
  return new Promise((resolve, reject) => {
    iina.postMessage(msg.SAVE_SCRIPTS, scripts);
    iina.onMessage(msg.SAVE_SCRIPTS_DONE, () => resolve());
  });
}

const List = () => {
  const [scripts, setScripts] = useState({ list: [] });
  useEffect(() => {
    const load = async () => {
      const list = await loadUserScripts();
      console.log(list);
      setScripts({ list });
    };
    load();
  }, []);

  const history = useHistory();

  const addScript = async () => {
    console.log(11111);
    const newScript = {
      id: uuidv4(),
      name: `script_${Math.random()}`,
    };
    const list = [...scripts.list, newScript];
    await saveUserScripts(list);
    setScripts({ list });
    history.push(`/edit/${newScript.id}`);
  };

  const delScript = (script) => async () => {
    if (!window.confirm(`Are you sure to delete ${script.name}?`)) {
      return;
    }
    const list = scripts.list.filter((s) => s !== script);
    await saveUserScripts(list);
    setScripts({ list });
  };

  const editScript = (script) => async () => {
    const list = scripts.list.filter((s) => s !== script);
    await saveUserScripts(list);
    setScripts({ list });
  };

  const style = css`
    display: flex;
    width: 100%;
    height: 100vh;
  `;

  const card = (
    <div style={{ padding: "8px" }}>
      <Card variant="outlined" size="sm">
        <Typography level="title-md">About User Scripts</Typography>
        <Typography level="body-sm">
          IINA User Scripts work like those in browsers - they let you use the
          IINA plugin API to add and share desired functionalities without the
          hassle of creating a plugin package.
        </Typography>
        <CardContent orientation="horizontal">
          <Button
            startDecorator={<Add />}
            onClick={addScript}
            size="sm"
            style={{ float: "right" }}
          >
            New Script
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const scriptList = (
    <div style={{ padding: "0 8px 8px 8px" }}>
      <Sheet
        variant="outlined"
        sx={{ width: "100%", boxShadow: "sm", borderRadius: "sm" }}
      >
        <Table>
          <thead>
            <tr>
              <th>Script Name</th>
              <th></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {scripts.list.map((script) => (
              <tr>
                <td>
                  <Typography startDecorator={<Code />}>
                    {script.name}
                  </Typography>
                </td>
                <td></td>
                <td>
                  <ButtonGroup size="sm">
                    <Button
                      startDecorator={<Edit />}
                      variant="soft"
                      component={Link}
                      to={`/edit/${script.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      startDecorator={<Delete />}
                      variant="soft"
                      color="danger"
                      onClick={delScript(script)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </Table>
      </Sheet>
    </div>
  );

  return (
    <Stack spacing={0}>
      {card}
      {scriptList}
    </Stack>
  );
};

export default List;
