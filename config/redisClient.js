const redis = require("redis");

let client;

(async () => {
  client = redis.createClient({
    url: "redis://localhost:6379"
  });

  client.on("error", (err) => console.error("❌ Redis Client Error:", err));

  await client.connect();
  console.log("✅ Connected to Redis (localhost:6379)");
})();

module.exports = {
  getClient: () => client
};
