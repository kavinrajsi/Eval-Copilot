// Server-only Claude call behind the suggest-only assist in grading.js.
//
// This file statically imports the Anthropic SDK, so it must never be imported
// from a Client Component. grading.js loads it via dynamic import() inside an
// async function that only runs on the server (the runs API route), which keeps
// the SDK out of the client bundle.

import Anthropic from "@anthropic-ai/sdk";

// Lightweight, high-frequency assist (runs per golden case), so default to the
// fast/cheap Haiku tier. Override to "claude-sonnet-4-5" for sharper judgment.
const MODEL = process.env.ANTHROPIC_SUGGEST_MODEL || "claude-haiku-4-5";

const SYSTEM = `You are a meticulous QA reviewer assisting a human grader of AI feature outputs.

You NEVER give a final pass/fail verdict — a human decides that. Your only job is to flag concrete, likely problems for that human to confirm.

Compare the ACTUAL output against the KNOWN-GOOD answer the team committed to in advance. Call out specific issues you can see: missing required detail, wrong facts or numbers, invented/unsupported claims, banned or off-brand terms, tone mismatch, or length/format problems. Ground every point in the two texts — do not speculate beyond them.

Respond in 1-3 short, plain-text sentences. If nothing clearly stands out, say so and remind the reviewer to still confirm the fuzzy dimensions a rule can't check. No preamble, no markdown, no verdict.`;

/**
 * Ask Claude to suggest possible failures for one output. Returns a plain-text
 * note (never a verdict). Throws on provider/network errors so the caller can
 * fall back to the heuristic.
 *
 * @param {string} actual
 * @param {string} knownGood
 * @returns {Promise<string>}
 */
export async function suggestViaClaude(actual, knownGood) {
  // Reads ANTHROPIC_API_KEY from the environment.
  const client = new Anthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `KNOWN-GOOD answer:\n${knownGood || "(none provided)"}\n\nACTUAL output:\n${actual || "(empty)"}\n\nFlag possible problems with the actual output for a human to review.`,
      },
    ],
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}
