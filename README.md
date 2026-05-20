# AF Command Center

## Run
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Life module (simplified)
Life now has only three areas:
- What's on your mind?
- Dream List
- Joy Box

Users type natural language once, then `classifyLifeEntry(text)` auto-categorizes entries locally (rule-based), saves to localStorage key:
`af-command-center:life:v1`.

## SPA routing note
This app uses BrowserRouter. Production deployment needs SPA fallback/rewrite so deep links like `/study/sim-uob` resolve to `index.html` on refresh.
