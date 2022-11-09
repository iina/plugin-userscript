import React, { useEffect, useState } from "react";
// import { css } from "@emotion/css";
import { Link, useHistory } from "react-router-dom";
import { Button, Level, Form } from "react-bulma-components";
import { css } from "@emotion/css";
import * as msg from "../msg";
import { uuidv4 } from "../utils";

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
    flex-direction: column;
    width: 100%;
    height: 100vh;

    .top {
      padding: 16px;
      margin: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    }

    .list {
      width: 100%;
      height: 100%;
      overflow: scroll;

      .table th {
        text-align: left;
      }
    }
  `;

  return (
    <div className={style}>
      <div className="top">
        <p>
          IINA User Scripts work like those in browsers - they let you use the
          IINA plugin API to add and share desired functionalities without the
          hassle of creating a plugin package.
        </p>
        <Button
          onClick={addScript}
          color="primary"
          size="small"
          style={{ float: "right" }}
        >
          New Script
        </Button>
      </div>
      <div className="list">
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>User Scripts</th>
              <th width="60"></th>
              <th width="60"></th>
            </tr>
          </thead>
          <tbody>
            {scripts.list.map((script) => (
              <tr>
                <td>{script.name}</td>
                <td>
                  <Link to={`/edit/${script.id}`}>Edit</Link>
                </td>
                <td>
                  <a href="#" onClickCapture={delScript(script)}>
                    Delete
                  </a>
                </td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
