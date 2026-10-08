const fs = require('fs');
let code = fs.readFileSync('app/sitemap.ts', 'utf8');

code = code.replace(
  `    {
      url: \`\${baseUrl}/adopt\`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },`,
  `    {
      url: \`\${baseUrl}/adopt\`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: \`\${baseUrl}/study\`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: \`\${baseUrl}/ask\`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: \`\${baseUrl}/relationships-guide\`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },`
);

fs.writeFileSync('app/sitemap.ts', code, 'utf8');
console.log("Updated sitemap");
