import { loadUserScripts } from "./utils";

const scripts = loadUserScripts();

iina.console.log(scripts);

for (const { id, name } of scripts) {
  iina.console.log(`Running script "${name}", id=${id}`);
  const path = `@data/${id}.js`;
  if (!iina.file.exists(path)) {
    console.log(`File ${path} doesn't exist; skipped.`);
  }
  const content = iina.file.read(path);
  eval(content);
}
