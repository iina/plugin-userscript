import React, { useEffect, useState } from "react";
// import { css } from "@emotion/css";
import { Link } from "react-router-dom";
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

  const addScript = async () => {
    console.log(11111);
    const newScript = {
      id: uuidv4(),
      name: `script_${Math.random()}`,
    };
    const list = [...scripts.list, newScript];
    await saveUserScripts(list);
    setScripts({ list });
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

  // const tableStyle = css`
  //   td {
  //     padding: 8px;
  //   }
  // `;

  return (
    <div>
      <h1>User Scripts</h1>
      <button onClick={addScript}>New</button>
      <table className={"a"}>
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {scripts.list.map((script) => (
            <tr>
              <td>{script.name}</td>
              <td>
                <Link to={`/edit/${script.id}`}>Edit</Link>
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
  );
};

export default List;
