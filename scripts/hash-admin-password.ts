import argon2 from 'argon2';

async function main() {
  const password = process.argv[2];

  if (!password) {
    throw new Error('Masukkan password. Contoh: npm run auth:hash-password -- "passwordku"');
  }

  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  console.log(hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
