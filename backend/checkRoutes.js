const express = require('express');
const router = require('./routes/index');

let errorCount = 0;

// Iterate through the router stack to check for undefined handlers
router.stack.forEach((layer) => {
  if (layer.route) {
    layer.route.stack.forEach((routeHandler) => {
      if (typeof routeHandler.handle !== 'function') {
        console.error(`ERROR: Route ${layer.route.path} has an undefined handler for method ${routeHandler.method}`);
        errorCount++;
      }
    });
  }
});

if (errorCount === 0) {
  console.log('SUCCESS: All registered routes have valid callback functions.');
} else {
  console.log(`FAILED: Found ${errorCount} invalid route handlers.`);
}
