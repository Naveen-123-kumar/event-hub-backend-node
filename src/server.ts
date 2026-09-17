import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { connectMySQL } from "./config/mysql";

const startServer = async (): Promise<void> => {
  await connectDatabase();
  await connectMySQL();

  app.get("/", (req, res) => {
    res.send("EventHub Node Backend is running...");
  });

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
