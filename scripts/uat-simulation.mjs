// Move 5 UAT — SIMULATION / DOGFOOD (not real human UAT).
//
// There were no two real builders available, so this role-plays two of the
// Move 1 builders (Maha — jewellery image generator; Manoj — SEO content) and
// drives their before -> fix -> after through the REAL grading engine. The
// verdicts below are produced by src/lib/grading.js, not hand-asserted — that
// part is genuine. What is simulated is the human: a real person did not sit
// down and find these. Move 5's "two real builders, one cold" gate stays open.
//
//   node scripts/uat-simulation.mjs
//
// Note: the tool applies ONE rubric (rule set) to every case in a feature
// (see src/app/api/features/[id]/runs/route.js) — so each persona has a single
// coherent rubric, not per-case rules.

import { gradeByRule } from "../src/lib/grading.js";

const builders = [
  {
    builder: "Maha (warm) — AI Jewellery Image Generator",
    rubric: [
      { type: "must_contain", value: "yellow gold" }, // every piece is yellow gold
      { type: "must_not_contain", value: "distorted" }, // no render artifacts
    ],
    knownGood: "Yellow gold piece, clean studio background, no artifacts.",
    v1: [
      "Single solitaire on a rose gold band, marble background.",      // wrong metal
      "Yellow gold tennis bracelet, even studio lighting.",
      "Yellow gold pendant with a slightly distorted clasp.",          // artifact
      "Yellow gold drop earrings on a marble surface.",
      "Classic gold bangle, plain studio shot.",                       // 'gold' not 'yellow gold'
    ],
    v2: [
      "Single solitaire on a yellow gold band, marble background.",
      "Yellow gold tennis bracelet, even studio lighting.",
      "Yellow gold pendant with a clean, intact clasp.",
      "Yellow gold drop earrings on a marble surface.",
      "Classic yellow gold bangle, plain studio shot.",
    ],
  },
  {
    builder: "Manoj (cold) — SEO Content Generator",
    rubric: [
      { type: "max_length", value: 60 },                 // meta titles <= 60
      { type: "must_not_contain", value: "IGI-Graded" }, // no invented certifications
    ],
    knownGood: "Gold Savings Scheme – Save More Monthly",
    v1: [
      "Start Your Gold Savings Scheme Today and Save More Every Month", // 61 chars
      "Gold Jewellery Collections | Kalyan Jewellers",
      "Shop BIS Hallmark & IGI-Graded Gold Jewellery",                  // invented cert
      "Diamond Rings for Every Occasion | Kalyan",
      "Buy 22K & 24K Certified Gold Coins Online — Best Live Rates Daily", // 64 chars
    ],
    v2: [
      "Gold Savings Scheme – Save More Monthly",
      "Gold Jewellery Collections | Kalyan Jewellers",
      "Shop BIS Hallmark Certified Gold Jewellery",
      "Diamond Rings for Every Occasion | Kalyan",
      "Buy 22K & 24K Certified Gold Coins — Live Rates",
    ],
  },
];

function gradeRun(outputs, knownGood, rubric) {
  return outputs.map((o) => gradeByRule(o, knownGood, rubric));
}

for (const b of builders) {
  console.log("\n=== " + b.builder + " ===");
  const r1 = gradeRun(b.v1, b.knownGood, b.rubric);
  const r2 = gradeRun(b.v2, b.knownGood, b.rubric);

  const tally = (rs) => ({
    pass: rs.filter((g) => g.verdict === "pass").length,
    fail: rs.filter((g) => g.verdict === "fail").length,
  });
  const t1 = tally(r1);
  const t2 = tally(r2);

  console.log(`v1: ${t1.pass} pass / ${t1.fail} fail`);
  r1.forEach((g, i) => {
    if (g.verdict === "fail") console.log(`  case ${i + 1} FAIL — ${g.note}`);
  });
  console.log(`v2: ${t2.pass} pass / ${t2.fail} fail`);

  let fixed = 0;
  let broke = 0;
  r1.forEach((g, i) => {
    if (g.verdict === "fail" && r2[i].verdict === "pass") fixed++;
    if (g.verdict === "pass" && r2[i].verdict === "fail") broke++;
  });
  console.log(`compare v1->v2: ${fixed} fixed, ${broke} broke`);
}

console.log("\n(SIMULATION — verdicts are real engine output; the builders are not.)");
