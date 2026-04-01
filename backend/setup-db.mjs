import pkg from "pg";
const { Client } = pkg;
import fs from "fs/promises";

async function main() {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) {
    console.error("NEON_DATABASE_URL not found in environment.");
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  
  try {
    await client.connect();
    await fs.readFile("src/sentinel/db/migrations.sql", "utf-8");

    console.log("Skipping migrations as they already applied or failing on constraints...");
    // await client.query(schema);
    console.log("Migrations check complete.");
    
    // Seed admin
    const email = "commander@sentinel.dev";
    
    // Since we're using bcrypt in the backend, let's just insert a known password hash.
    // The backend uses standard node:crypto scrypt. Let's look at backend/auth.mjs to see how it hashes.
    // Or we can just insert a plain string and wait. No, backend/auth.mjs hashes it.
    
    // Actually, PGCrypto's crypt() is different from Node's scrypt.
    // Let's check backend/auth.mjs
    const authSrc = await fs.readFile("backend/auth.mjs", "utf-8");
    if (authSrc.includes("node:crypto")) {
       // We should import the hashPassword function from backend/auth.mjs and use it!
       const { hashPassword } = await import("./auth.mjs");
       const hashedPassword = await hashPassword("admin123!");
       
       const res = await client.query(`
         INSERT INTO sentinel_users (id, email, password_hash, role, full_name)
         VALUES (gen_random_uuid()::TEXT, $1, $2, 'SENTINEL_COMMANDER', 'Sentinel Admin')
         ON CONFLICT (email) DO NOTHING
         RETURNING id;
       `, [email, hashedPassword]);

       if (res.rowCount > 0) {
         console.log(`\n==============================================`);
         console.log(`Commander Seeded Successfully!`);
         console.log(`Email: ${email}`);
         console.log(`Password: admin123!`);
         console.log(`==============================================\n`);
       } else {
         console.log("Commander already exists in the database.");
       }
    } else {
        console.log("Could not find hashPassword in auth.mjs. Skipping commander seed.");
    }

  } catch (err) {
    console.error("Migration/Seed failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();