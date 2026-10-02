const fs = require("fs");
const path = require("path");

const swaggerSpec = require(
  "../src/config/swagger"
);

const outputPath = path.resolve(
  __dirname,
  "../src/config/swagger-generated.json"
);

const paths =
  Object.keys(
    swaggerSpec.paths || {}
  );

if (paths.length === 0) {
  console.error(
    "ERROR: Swagger generation completed but no API routes were found."
  );

  console.error(
    "Check the apis path in src/config/swagger.js."
  );

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

console.log(
  "Swagger JSON generated successfully."
);

console.log(
  `Output: ${outputPath}`
);

console.log(
  `Total API paths: ${paths.length}`
);

console.log(
  "Swagger paths:"
);

paths.forEach((route) => {
  console.log(
    `  ${route}`
  );
});