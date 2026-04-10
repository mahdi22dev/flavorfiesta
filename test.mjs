import fs from 'fs';
import fetch from 'node-fetch';

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});

async function test() {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_DATABASE_ID;
  const token = env.CLOUDFLARE_D1_TOKEN;

  const sql = "SELECT * FROM recipes LIMIT 2";
  
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params: [] }),
    }
  );

  const json = await res.json();
  console.log(JSON.stringify(json.result?.[0]?.results, null, 2));
}

test();
