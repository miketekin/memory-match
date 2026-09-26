# Memory Match

A cat-themed memory matching game. Flip cards to find six matching pairs of cats, pulled fresh from the [Cat as a Service](https://cataas.com) API every time you load the page.

**Live demo:** https://miketekin.github.io/memory-match/

## How it works

1. On load, the app requests six cat IDs from `https://cataas.com/api/cats`, using a random `skip` offset so each game gets a different set of cats.
2. The six IDs are duplicated into pairs and shuffled onto a 4 x 3 board.
3. Every cat image is downloaded once, before the board renders, as a blob and turned into an object URL with `URL.createObjectURL`. Flipping a card only swaps the `<img>` `src` between that cached URL and a face-down SVG placeholder, so there are no additional network requests during play.
4. Click handling follows the classic rules: the first click flips a card, the second flips another and checks for a match (matched pairs stay face up), and a third click turns the two unmatched cards back over before flipping the new one.
5. Reset reshuffles the same twelve cards.

## Stack

- React
- TypeScript
- Vite
- ESLint
- GitHub Actions workflow that builds and deploys to GitHub Pages on push to `main`

## Running locally

```bash
npm install
npm run dev
```

Vite prints a local URL in the terminal (typically `http://localhost:5173/memory-match/`, though the port changes if 5173 is in use). Open it in a browser.

## Next steps

- Exclude animated GIFs from the fetched cats to improve load time
- Reuse the downloaded images on reset instead of fetching the same twelve again, and release the old object URLs with `URL.revokeObjectURL`
- Handle the cataas API being unavailable instead of staying on the loading screen
- Tests for the flip and match state logic
- Score: count card flips per game, lower is better
- Timer

## Credits

- Cat photos from [Cat as a Service](https://cataas.com)
- Face-down card icon: [Cat](https://www.svgrepo.com/svg/487176/cat) by [Neuicons](https://github.com/neuicons/neu) via SVG Repo, [MIT License](src/assets/LICENSE-neuicons.txt)
