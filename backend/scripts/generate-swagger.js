const fs = require("fs");
const path = require("path");

console.log(
  "======================================"
);

console.log(
  "Generating Swagger documentation..."
);

console.log(
  "Working directory:",
  process.cwd()
);

console.log(
  "======================================"
);

const swaggerSpec = require(
  "../src/config/swagger"
);

const outputPath = path.resolve(
  __dirname,
  "../src/config/swagger-generated.json"
);

const paths = Object.keys(
  swaggerSpec.paths || {}
);

if (paths.length === 0) {
  console.error("");
  console.error(
    "ERROR: Swagger generation completed but no API routes were found."
  );

  console.error(
    "Check Swagger annotations inside src/routes/*.js"
  );

  console.error(
    "and check the apis path in src/config/swagger.js."
  );

  console.error("");

  process.exit(1);
}

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    swaggerSpec,
    null,
    2
  ),
  "utf8"
);

console.log("");
console.log(
  "Swagger JSON generated successfully."
);

console.log(
  `Output: ${outputPath}`
);

console.log(
  `Total API paths: ${paths.length}`
);

console.log("");
console.log(
  "Swagger paths:"
);

paths.forEach((route) => {
  console.log(
    `  ${route}`
  );
});

console.log("");
console.log(
  "Swagger generation completed."
);