import { serve } from "@hono/node-server";
import app from "./server";

const PORT = parseInt(process.env.PORT || "3001", 10);
console.log(`Server starting on port ${PORT}...`);

serve({
  fetch: app.fetch,
  port: PORT,
}).listen(() => {
  console.log(`Server running on http://localhost:${PORT}`);
});