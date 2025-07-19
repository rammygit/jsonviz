const express = require('express');
const fs = require('fs');
const { Module, render } = require('viz.js/full.render.js');
const Viz = require('viz.js');

const app = express();
const port = 3000;

const viz = new Viz({ Module, render });

const { generateDotGraph } = require('./app');

// Call the function with the path to your rules JSON and output path
const jsontodotString = generateDotGraph('datanew.json', 'output_rules_graph.dot');

// Now you can use the DOT string, e.g., send to frontend, render with viz.js, etc.
console.log(jsontodotString);

// Read your DOT graph file
const dotString = fs.readFileSync('output_rules_graph.dot', 'utf8');

app.get('/', async (req, res) => {
  try {
    const svg = await viz.renderString(dotString);
    res.send(`
      <html>
        <head>
          <title>Home Purchase Rule Graph</title>
        </head>
        <body>
          <h2>Home Purchase Rule Graph (DOT → SVG)</h2>
          <div>${svg}</div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error rendering DOT graph: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

