# path & trajectory planning visualizer

At its core, a trajectory planner tries to find a time-dependent path (hence trajectory) to get from a starting position to a goal position.

It has a short planning horizon and therfore needs to dynamically replan its trajectory, until it finally reaches its goal. This gives it the possibility to adapt to moving obstacles!

For more details checkout the tutorial!

## Project setup

Install dependencies:
```
npm install
```

If the installation of `node-canvas` fails, follow the instructions [here](https://github.com/Automattic/node-canvas/wiki/_pages).

Create the static bundle file:
```
npx browserify index.js -o static/bundle.js 
```

Deploy or run with Live Server.

Use `watchify` for development, which is much faster due to agressive caching:
```
npx watchify index.js -o static/bundle.js 
```

## Testing
```
npm test
```

## Linting
```
npx eslint .
```
