#!/usr/bin/env node

/**
 * Dodo Payments Setup Script
 * Helps configure Dodo Payments API keys in .env
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🦤 Dodo Payments Setup\n');
  console.log('This script will help you configure Dodo Payments for BlurKit.\n');

  console.log('📋 Before starting, make sure you have:');
  console.log('   1. Signed up at https://app.dodopayments.com');
  console.log('   2. Your account is in TEST MODE');
  console.log('   3. Created your first product/price\n');

  const proceed = await question('Ready to proceed? (y/n): ');

  if (proceed.toLowerCase() !== 'y') {
    console.log('\n👋 Come back when you\'re ready!\n');
    rl.close();
    return;
  }

  console.log('\n📍 Get your keys from: https://app.dodopayments.com/settings/api-keys\n');

  const secretKey = await question('Enter your DODO_SECRET_KEY (test mode): ');
  const webhookSecret = await question('Enter your DODO_WEBHOOK_SECRET: ');

  if (!secretKey || !webhookSecret) {
    console.log('\n❌ Both keys are required. Please try again.\n');
    rl.close();
    return;
  }

  // Read current .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Update the keys
  envContent = envContent.replace(
    /DODO_SECRET_KEY=.*/,
    `DODO_SECRET_KEY=${secretKey}`
  );
  envContent = envContent.replace(
    /DODO_WEBHOOK_SECRET=.*/,
    `DODO_WEBHOOK_SECRET=${webhookSecret}`
  );

  // Write back to .env
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Dodo Payments configured successfully!\n');
  console.log('📝 Next steps:');
  console.log('   1. Create your products/prices in Dodo dashboard');
  console.log('   2. Set up webhook endpoint: https://blurkit.app/api/payment/webhook');
  console.log('   3. Test checkout flow with test cards');
  console.log('   4. Run: npm run dev\n');

  console.log('🧪 Test the integration:');
  console.log('   curl -X POST http://localhost:3000/api/payment/checkout \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"planId": "price_xxxxx", "email": "test@example.com"}\'\n');

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
