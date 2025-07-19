const fs = require('fs');
const graphlib = require('graphlib');
const dot = require('graphlib-dot');

/**
 * Generates a DOT graph from a JSON rules file.
 *
 * @param {string} inputFilePath - Path to the JSON file containing rules.
 * @param {string} outputFilePath - Path to save the generated DOT file.
 * @returns {string} The DOT graph as a string.
 */
function generateDotGraph(inputFilePath, outputFilePath = 'rules_graph.dot') {
  // Load your JSON rules
  const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
  const rules = data.rules;

  // Build graph
  const g = new graphlib.Graph({ directed: true });

  // Add nodes with label as "name (P<priority>)"
  for (const rule of rules) {
    g.setNode(rule.id, { label: `${rule.name} (P${rule.priority})` });
  }

  // Add edges using ID for `next_step`
  for (const rule of rules) {
    const nextId = rule.actions?.next_step;
    if (nextId && rules.find(r => r.id === nextId)) {
      g.setEdge(rule.id, nextId);
    }
  }

  // Export DOT format
  const dotOutput = dot.write(g);

  // Write to file
  fs.writeFileSync(outputFilePath, dotOutput);
  console.log(`DOT file generated: ${outputFilePath}`);

  return dotOutput;
}

module.exports = { generateDotGraph };
