// Madarth® brand-compliance rule set — a test feature for the grading engine.
//
//   node scripts/madarth-brand-check.mjs   (or: npm run brand:madarth)
//
// The engine only decides DETERMINISTIC rules (see src/lib/grading.js), so this
// encodes the unambiguous "WHAT IS NEVER MADARTH" list as machine rules. The
// qualitative half of the brand — voice (PG Wodehouse + Crazy Mohan), "rooted in
// a real human truth", "earns its wit" — is NOT machine-checkable; it belongs to
// the rubric's plain-English text and the AI suggest/judge path, with a human
// making the final call. Listed at the bottom so it isn't silently dropped.
//
// Like the rest of a feature in this tool, ONE rubric applies to every case.
// Brand compliance fits that well: the rules are mostly "must not contain an
// off-brand element", which is the same across all copy.

import { gradeByRule } from "../src/lib/grading.js";

// rule_text — the brand essence, for the AI suggest/judge path (no machine verdict).
export const ruleText = [
  "Madarth voice: PG Wodehouse precision + Crazy Mohan warmth, over filter coffee.",
  "Earnest not solemn, direct not blunt, Tamil at heart. Confident and earned, never",
  "arrogant, cold, verbose, generic pan-Indian, or agency-speak. Work must be rooted",
  "in a real human truth, carry a recognisable point of view, and not look AI-generated.",
].join(" ");

// Machine rules — the deterministic "NEVER Madarth" constraints.
export const rules = [
  { type: "must_not_contain", value: "purple gradient" }, // never Madarth
  { type: "must_not_contain", value: "neon" },
  { type: "must_not_contain", value: "#000000" },         // never pure black
  { type: "must_not_contain", value: "#FFFFFF" },         // never pure white
  { type: "must_not_contain", value: "storytelling" },    // banned agency-speak
  { type: "must_not_contain", value: "journey" },
  { type: "must_not_contain", value: "ecosystem" },
  { type: "must_not_contain", value: "premium" },         // generic "premium" aesthetic
  { type: "must_not_contain", value: "Roboto" },          // banned headline faces
  { type: "must_not_contain", value: "Arial" },
];

const knownGood = "On-brand: rooted cultural truth, Madarth palette and fonts, no agency-speak.";

// Sample copy/design briefs. v1 = before review (off-brand slips in), v2 = after fix.
const v1 = [
  "Our premium ecosystem powers your brand journey.",                 // 3 banned terms
  "Rooted in Mylapore, sharp in output — an idea wears a veshti and sneakers.",
  "Headline set in Arial Bold on a purple gradient background.",      // banned font + gradient
  "Background charcoal #1C1C1A, cream #FFF8E7, Mango Gold #F5B800.",
  "Use pure black #000000 text for maximum contrast.",               // pure black
];

const v2 = [
  "Rooted truth, sharp craft — branding that grows without losing soul.",
  "Rooted in Mylapore, sharp in output — an idea wears a veshti and sneakers.",
  "Headline set in Anek ExtraBold (charcoal) with a single green Caveat accent.",
  "Background charcoal #1C1C1A, cream #FFF8E7, Mango Gold #F5B800.",
  "Use charcoal #1C1C1A text — never pure black.",
];

function gradeRun(outputs) {
  return outputs.map((o) => gradeByRule(o, knownGood, rules));
}

function report(label, outputs) {
  const rs = gradeRun(outputs);
  const pass = rs.filter((g) => g.verdict === "pass").length;
  const fail = rs.filter((g) => g.verdict === "fail").length;
  console.log(`${label}: ${pass} pass / ${fail} fail`);
  rs.forEach((g, i) => {
    if (g.verdict === "fail") console.log(`  case ${i + 1} FAIL — ${g.note}`);
  });
  return rs;
}

console.log("=== Madarth® Brand Compliance — machine rules ===");
const r1 = report("v1 (before review)", v1);
const r2 = report("v2 (after fix)", v2);

let fixed = 0;
let broke = 0;
r1.forEach((g, i) => {
  if (g.verdict === "fail" && r2[i].verdict === "pass") fixed++;
  if (g.verdict === "pass" && r2[i].verdict === "fail") broke++;
});
console.log(`compare v1->v2: ${fixed} fixed, ${broke} broke`);

console.log("\nNot machine-checkable (AI suggest/judge + human decide):");
console.log("  voice (Wodehouse + Crazy Mohan), rooted human truth, earns its wit,");
console.log("  recognisable POV, does not look AI-generated, productive tension.");
