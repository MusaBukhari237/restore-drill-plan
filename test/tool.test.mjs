import test from "node:test";
import assert from "node:assert/strict";
import * as core from "../docs/tool.mjs";

test("targets disposable infrastructure and rejects paths and injected arguments", () => {
  const plan=core.restorePlan("sample.dump","18","restore-drill-example");
  assert.deepEqual(plan[0].slice(4,8),["--detach","--network","none","--name"]);
  assert.equal(plan.some(step => step.includes("--publish") || step.includes("--clean")),false);
  assert.ok(plan[5].includes("--exit-on-error"));
  assert.throws(() => core.restorePlan("../sample.dump","18","restore-drill-example"),/basename/);
  assert.throws(() => core.restorePlan("sample.dump","18","postgres;rm"),/Name/);
});
