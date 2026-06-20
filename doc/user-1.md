# User 1: Maha

## Maha — AI Jewellery Product-Shoot Image Generator

**Profile:** Designer (13 years experience)
**Built:** Vibe-coded internal tool
**Client:** Jewellery brand

### Pass Condition

The generated image must render the jewellery product **accurately and exactly according to the brief**.

| #   | Input Brief                                                 | Expected Output (Known-Good)                                               | Actual Output                                                                                                | Result  | Would've Shipped? | Already Knew? |
| --- | ----------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------- | ----------------- | ------------- |
| 1   | Gold solitaire ring, white marble background, soft daylight | One centre stone, yellow-gold band, clean marble background, no distortion | Single stone rendered correctly; yellow-gold band, clean marble background, no distortion, lighting on brief | ✅ Pass | Yes               | N/A           |
| 2   | Diamond tennis bracelet, 20 stones, black velvet background | Exactly 20 evenly set stones, intact clasp                                 | Only **17 stones** rendered; clasp area distorted and merged into the band                                   | ❌ Fail | Yes               | No            |
| 3   | Filigree temple pendant with intricate detailing            | Symmetric pendant with crisp filigree and no loss of detail                | Filigree detail **melted into solid blobs** on the left side; overall structure asymmetric                   | ❌ Fail | Yes               | No            |
| 4   | Rose-gold hoop earrings, grey studio background             | Matching pair of earrings in rose gold                                     | Rendered in **yellow gold** instead of rose gold; one earring slightly larger than the other                 | ❌ Fail | Yes               | No            |
| 5   | Emerald-cut three-stone ring in platinum                    | Emerald-cut centre stone with two side stones; silver-tone metal           | Centre stone rendered **round instead of emerald-cut**; metal tone correct                                   | ❌ Fail | Yes               | No            |

---

## Results Summary

| Metric          | Value |
| --------------- | ----- |
| Total Tests     | 5     |
| Passed          | 1     |
| Failed          | 4     |
| Pass Rate       | 20%   |
| Silent Failures | 4     |

### Silent Failures Observed

- Wrong stone count (20 → 17)
- Distorted clasp geometry
- Melted filigree details
- Incorrect gold colour (rose gold → yellow gold)
- Mismatched earring pair sizing
- Incorrect gemstone cut (emerald-cut → round)

> **Final Score: 1 / 5**
>
> 🔴 Critical issue: Multiple silent failures would have passed through to production and gone live undetected, despite appearing visually plausible at first glance.
