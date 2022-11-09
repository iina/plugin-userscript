import { loadUserScripts, SCRIPT_LIST_PATH } from "./utils";
import * as msg from "./msg";

const { menu, file, console } = iina;
const window = iina.standaloneWindow;

function addListeners() {
  window.onMessage(msg.LOAD_SCRIPTS, () => {
    window.postMessage(msg.LOAD_SCRIPTS_DONE, loadUserScripts());
  });

  window.onMessage(msg.SAVE_SCRIPTS, (s) => {
    window.postMessage(msg.SAVE_SCRIPTS_DONE, saveUserScripts(s));
  });

  window.onMessage(msg.GET_SCRIPT_CONTENT, ({ id }) => {
    const path = `@data/${id}.js`;
    if (!file.exists(path)) {
      console.log(`File ${path} doesn't exist; creating.`);
      file.write(path, "");
    }
    content = encodeURI(file.read(path));
    window.postMessage(msg.GET_SCRIPT_CONTENT_DONE, { content });
  });

  window.onMessage(msg.GET_SCRIPT_INFO, ({ id }) => {
    const script = loadUserScripts().find((s) => s.id === id);

    window.postMessage(msg.GET_SCRIPT_INFO_DONE, script);
  });

  window.onMessage(msg.SET_SCRIPT_INFO, ({ id, ...info }) => {
    const scripts = loadUserScripts().map((s) =>
      s.id === id ? { ...s, ...info } : s,
    );
    saveUserScripts(scripts);

    window.postMessage(msg.SET_SCRIPT_INFO_DONE, {});
  });

  window.onMessage(msg.SET_SCRIPT_CONTENT, ({ id, content }) => {
    const path = `@data/${id}.js`;
    if (!file.exists(path)) {
      console.log(`File ${path} doesn't exist; creating.`);
      file.write(path, "");
    }
    file.write(path, decodeURI(content));
    window.postMessage(msg.SET_SCRIPT_CONTENT_DONE, {});
  });
}

window.loadFile("dist/standalone/index.html");
addListeners();
window.setProperty({ title: "User Scripts" });
window.open();

menu.addItem(
  menu.item("Manage User Scripts...", () => {
    window.open();
  }),
);

function saveUserScripts(scripts) {
  if (!Array.isArray(scripts)) {
    throw new Error(`saveUserScripts: scripts should be an array`);
  }
  file.write(SCRIPT_LIST_PATH, JSON.stringify(scripts));
}

function getScriptContent() {}
