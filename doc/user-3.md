# User 3: Siddharth

## Siddharth — Brand Rulebook Checker

**Profile:** Co-Founder & Creative Head, Madarth (~20 years experience)
**Clients:** Amul, Adidas, CSK, Flipkart, PhonePe, KVB

### Pass Condition

The classifier must correctly determine whether content is **PASS (compliant)** or **FAIL (non-compliant)** according to the brand rulebook.

> **Critical Risk:** False Passes — content that violates brand guidelines but is incorrectly approved as compliant.

| #   | Content Evaluated                                   | Expected Verdict (Known-Good) | Actual Output                                              | Result  | Would've Shipped? | Already Knew? |
| --- | --------------------------------------------------- | ----------------------------- | ---------------------------------------------------------- | ------- | ----------------- | ------------- |
| 1   | Correct logo, approved brand colours, approved font | PASS                          | PASS — "All brand elements within guideline"               | ✅ Pass | Yes               | N/A           |
| 2   | Off-brand colour used (pink instead of brand teal)  | FAIL — colour violation       | PASS — "Brand elements appear consistent"                  | ❌ Fail | Yes               | No            |
| 3   | Unapproved font used                                | FAIL — typography violation   | FAIL — "Non-standard typeface detected"                    | ✅ Pass | Yes               | N/A           |
| 4   | Logo present but below minimum size requirement     | FAIL — logo-size violation    | PASS — "Logo placement and visibility acceptable"          | ❌ Fail | Yes               | No            |
| 5   | Compliant content with unconventional layout        | PASS                          | PASS — "Layout unconventional but within brand parameters" | ✅ Pass | Yes               | N/A           |

---

## Results Summary

| Metric       | Value |
| ------------ | ----- |
| Total Tests  | 5     |
| Passed       | 3     |
| Failed       | 2     |
| Pass Rate    | 60%   |
| False Passes | 2     |

### Critical False Passes

- Off-brand colour approved as compliant
- Logo-size violation approved as compliant

### Failure Categories

| Category            | Example                                   |
| ------------------- | ----------------------------------------- |
| Colour Compliance   | Failed to detect off-brand colour usage   |
| Logo Compliance     | Failed to detect minimum-size violation   |
| False Positive Risk | Incorrectly approved non-compliant assets |

---

## Final Assessment

> **Final Score: 3 / 5**
>
> 🔴 The system successfully identifies typography violations but misses colour and logo-size violations. Both failures are false passes, which are substantially riskier than false fails because non-compliant assets would proceed to client review or production unchecked. For enterprise brands such as PhonePe, CSK, Adidas, or Amul, these represent client-facing quality-control failures rather than internal workflow issues.
