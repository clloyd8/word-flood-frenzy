

## Adjust Scoring Formula to Round to Nearest 5

Update the scoring utility so all point values end in 0 or 5, while still keeping the gentler weighted curve.

### Formula

Use `word.length * (word.length + 2) * 2`, then round to the nearest 5:

`score = Math.round(length * (length + 2) * 2 / 5) * 5`

| Word Length | Score |
|-------------|-------|
| 3 letters   | 30    |
| 4 letters   | 50    |
| 5 letters   | 70    |
| 6 letters   | 95    |
| 7 letters   | 125   |
| 8 letters   | 160   |

### Change

**src/utils/scoreUtils.ts** -- Update the formula to round to the nearest 5.

