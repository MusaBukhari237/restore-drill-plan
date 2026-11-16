const el = id => document.getElementById(id);
function show(value) { el("result").textContent = value; }
function appendText(value) {
  const p = document.createElement("p"); p.textContent = value; el("result").append(p);
}
function action(callback) {
  const button = el("run");
  button.onclick = async () => {
    button.disabled = true;
    try { await callback(); } catch (error) { show(error.message); }
    finally { button.disabled = false; }
  };
}
function renderTable(rows) {
  const wrapper = document.createElement("div"), table = document.createElement("table");
  wrapper.className = "grid";
  rows.forEach((row,index) => {
    const tr = table.insertRow();
    row.forEach(value => {
      const cell = document.createElement(index ? "td" : "th");
      cell.textContent = String(value);
      if (!index) cell.scope = "col";
      tr.append(cell);
    });
  });
  wrapper.append(table); el("result").append(wrapper);
}
let previousUrl;
function download(filename, contents, type = "text/csv") {
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  previousUrl = URL.createObjectURL(new Blob([contents],{type}));
  const link = document.createElement("a");
  link.className = "download"; link.href = previousUrl;
  link.download = filename; link.textContent = "Download " + filename;
  el("result").append(link);
}
import {restorePlan} from "./tool.mjs";
el("example").onclick = () => { el("archive").value = "sample.dump"; el("container").value = "restore-drill-demo"; };
action(() => {
  const steps = restorePlan(el("archive").value,el("version").value,el("container").value);
  show(steps.length + " commands for a disposable restore");
  const pre = document.createElement("pre");
  pre.textContent = steps.map((args,i) => (i+1)+". "+args.map(arg => /^[a-zA-Z0-9_./:=+-]+$/.test(arg) ? arg : '"'+arg+'"').join(" ")).join("\n");
  el("result").append(pre);
  appendText("Wait for the readiness check to succeed. Stop on any failure. Run the cleanup step only for the drill container you created.");
  download("restore-plan.json",JSON.stringify(steps,null,2)+"\n","application/json");
});
