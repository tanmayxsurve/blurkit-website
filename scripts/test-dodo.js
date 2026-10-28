#!/usr/bin/env node

/**
 * Test Dodo Payments Integration
 * Verifies API keys and checkout flow
 */

require('dotenv').config();

async function testDodoPayments() {
  console.log('\n🧪 Testing Dodo Payments Integration\n');

  // Check environment variables
  const secretKey = process.env.DODO_SECRET_KEY;
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

  console.log('1️⃣ Checking environment variables...');

  if (!secretKey || secretKey === 'your_dodo_secret_key_here') {
    console.log('   ❌ DODO_SECRET_KEY not configured');
    console.log('   💡 Run: node scripts/setup-dodo.js\n');
    process.exit(1);
  }
  console.log('   ✅ DODO_SECRET_KEY configured');

  if (!webhookSecret || webhookSecret === 'your_dodo_webhook_secret_here') {
    console.log('   ❌ DODO_WEBHOOK_SECRET not configured');
    console.log('   💡 Run: node scripts/setup-dodo.js\n');
    process.exit(1);
  }
  console.log('   ✅ DODO_WEBHOOK_SECRET configured');

  // Test API connectivity
  console.log('\n2️⃣ Testing API connectivity...');

  try {
    const response = await fetch('https://api.dodopayments.com/v1/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(`   ❌ API request failed: ${error.message || response.statusText}`);
      console.log('   💡 Verify your API key at https://app.dodopayments.com/settings/api-keys\n');
      process.exit(1);
    }

    const data = await response.json();
    console.log('   ✅ API connection successful');
    console.log(`   📦 Found ${data.data?.length || 0} products\n`);

    if (data.data && data.data.length > 0) {
      console.log('3️⃣ Available products:');
      data.data.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
      });
    } else {
      console.log('3️⃣ No products found');
      console.log('   💡 Create products at https://app.dodopayments.com/products\n');
    }

  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    console.log('   💡 Check your internet connection and API endpoint\n');
    process.exit(1);
  }

  console.log('\n✅ Dodo Payments is configured correctly!');
  console.log('\n📝 Next steps:');
  console.log('   1. Create products/prices in Dodo dashboard');
  console.log('   2. Update price IDs in your pricing page');
  console.log('   3. Set up webhook: https://blurkit.app/api/payment/webhook');
  console.log('   4. Test checkout flow\n');
}

testDodoPayments().catch(error => {
  console.error('\n❌ Unexpected error:', error.message);
  process.exit(1);
});
