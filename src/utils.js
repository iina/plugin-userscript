const { menu, file, console } = iina;

export const SCRIPT_LIST_PATH = "@data/script-list.json";

export function loadUserScripts() {
  function createScriptList() {
    file.write(SCRIPT_LIST_PATH, "[]");
  }
  if (!file.exists(SCRIPT_LIST_PATH)) {
    createScriptList();
  }
  const content = file.read(SCRIPT_LIST_PATH);
  let scripts = [];
  try {
    scripts = JSON.parse(content);
    console.log(`Scripts loaded: ${scripts.length}`);
  } catch {
    console.log("Cannot parse the script list - will recreate one");
    file.write(`${SCRIPT_LIST_PATH}.backup`, content);
    createScriptList();
  }
  return scripts;
}

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}
