import { Vehicle } from "@/core/domain/entities/vehicle.js";
import { MongoDriver } from "@mikro-orm/mongodb";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => {
  if (process.env.NODE_ENV === "test") return { entities: [Vehicle], driver: SqliteDriver, dbName: ":memory:" };

  return {
    driver: MongoDriver,
    clientUrl: process.env.DATABASE_URL,
    entities: [Vehicle],
    pool: { min: 2, max: 10 },
  };
});
