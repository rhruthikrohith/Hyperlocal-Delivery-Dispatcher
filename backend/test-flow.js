
const API_URL = `http://localhost:${process.env.PORT || 5001}/api`;

async function runTestFlow() {
  console.log('=== STARTING HYPERLOCAL DISPATCHER FLOW TEST ===\n');

  // Step 1: Seed the database
  console.log('Step 1: Seeding database with mock data...');
  try {
    const seedRes = await fetch(`${API_URL}/orders/seed-mock-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!seedRes.ok) {
      throw new Error(`Seed failed with status ${seedRes.status}`);
    }
    const seedData = await seedRes.json();
    console.log('✅ Database seeded successfully:', seedData.message);
  } catch (error) {
    console.error('❌ Failed to seed database:', error.message);
    process.exit(1);
  }

  // Step 2: Login as Customer (ramesh@seeded.com)
  console.log('\nStep 2: Logging in as Customer (ramesh@seeded.com)...');
  let customerToken;
  let customerId;
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ramesh@seeded.com',
        password: 'password123'
      })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
    const loginData = await loginRes.json();
    customerToken = loginData.token;
    customerId = loginData.user.id;
    console.log(`✅ Customer logged in. Name: ${loginData.user.name}, Token acquired.`);
  } catch (error) {
    console.error('❌ Customer login failed:', error.message);
    process.exit(1);
  }

  // Step 3: Login as Rider (rahul@seeded.com)
  console.log('\nStep 3: Logging in as Rider (rahul@seeded.com)...');
  let riderToken;
  let riderId;
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rahul@seeded.com',
        password: 'password123'
      })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
    const loginData = await loginRes.json();
    riderToken = loginData.token;
    riderId = loginData.user.id;
    console.log(`✅ Rider logged in. Name: ${loginData.user.name}, Token acquired.`);
  } catch (error) {
    console.error('❌ Rider login failed:', error.message);
    process.exit(1);
  }

  // Step 4: Ensure Rider Status is Online
  console.log('\nStep 4: Ensuring Rider Status is ON...');
  try {
    const statsRes = await fetch(`${API_URL}/riders/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      }
    });
    if (!statsRes.ok) throw new Error(`Stats failed: ${statsRes.statusText}`);
    const statsData = await statsRes.json();
    if (statsData.riderStatus !== 'online') {
      const toggleRes = await fetch(`${API_URL}/riders/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${riderToken}`
        }
      });
      if (!toggleRes.ok) throw new Error(`Toggle failed: ${toggleRes.statusText}`);
      const toggleData = await toggleRes.json();
      console.log(`✅ Rider Status updated to:`, toggleData.riderStatus);
    } else {
      console.log(`✅ Rider is already online.`);
    }
  } catch (error) {
    console.error('❌ Ensuring rider online failed:', error.message);
    process.exit(1);
  }

  // Step 5: Customer Creates a New Order
  console.log('\nStep 5: Customer creating a new order...');
  let orderId;
  const orderDetails = {
    customerName: 'Rohith Test User',
    pickupAddress: 'Gachibowli, Hyderabad, Telangana',
    deliveryAddress: 'Jubilee Hills, Hyderabad, Telangana',
    items: [
      { name: 'Special Burger', quantity: 2, price: 8.50 },
      { name: 'Cold Coffee', quantity: 2, price: 4.00 }
    ],
    paymentMethod: 'COD',
    pickupPhone: '+91 88888 88888',
    deliveryPhone: '+91 99999 99999'
  };

  try {
    const createRes = await fetch(`${API_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify(orderDetails)
    });
    if (!createRes.ok) throw new Error(`Order creation failed: ${createRes.statusText}`);
    const orderData = await createRes.json();
    orderId = orderData._id;
    console.log(`✅ Order created successfully!`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Initial Status: ${orderData.status}`);
    console.log(`   Distance calculated: ${orderData.distance} km`);
    console.log(`   Estimated Delivery Time (ETA): ${orderData.eta} mins`);
    console.log(`   Delivery Fee: $${orderData.deliveryFee}`);
    console.log(`   Total Amount: $${orderData.totalAmount}`);
    console.log(`   COD Amount (total + delivery fee): $${orderData.codAmount}`);
  } catch (error) {
    console.error('❌ Order creation failed:', error.message);
    process.exit(1);
  }

  // Step 6: Rider directly claims/accepts the unassigned pending order
  console.log(`\nStep 6: Rider Rahul directly claiming/accepting unassigned Order ${orderId}...`);
  try {
    const acceptRes = await fetch(`${API_URL}/orders/${orderId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      }
    });
    if (!acceptRes.ok) throw new Error(`Claim failed: ${acceptRes.statusText}`);
    const acceptData = await acceptRes.json();
    console.log(`✅ Order accepted/claimed! Status is now "${acceptData.status}"`);
  } catch (error) {
    console.error('❌ Rider direct claim failed:', error.message);
    process.exit(1);
  }

  // Step 7: Rider updates status to "Arrived at Pickup"
  console.log(`\nStep 7: Rider updating status to "Arrived at Pickup"...`);
  try {
    const statusRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      },
      body: JSON.stringify({
        status: 'Arrived at Pickup',
        note: 'Rider reached Bakehouse Bakery'
      })
    });
    if (!statusRes.ok) throw new Error(`Status update failed: ${statusRes.statusText}`);
    const statusData = await statusRes.json();
    console.log(`✅ Status updated to "${statusData.status}"`);
  } catch (error) {
    console.error('❌ Status update failed:', error.message);
    process.exit(1);
  }

  // Step 8: Rider updates status to "Picked Up"
  console.log(`\nStep 8: Rider updating status to "Picked Up"...`);
  try {
    const statusRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      },
      body: JSON.stringify({
        status: 'Picked Up',
        note: 'Items picked up from pickup point'
      })
    });
    if (!statusRes.ok) throw new Error(`Status update failed: ${statusRes.statusText}`);
    const statusData = await statusRes.json();
    console.log(`✅ Status updated to "${statusData.status}"`);
  } catch (error) {
    console.error('❌ Status update failed:', error.message);
    process.exit(1);
  }

  // Step 9: Rider updates status to "In Transit"
  console.log(`\nStep 9: Rider updating status to "In Transit"...`);
  try {
    const statusRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      },
      body: JSON.stringify({
        status: 'In Transit',
        note: 'Rider is on the way to 221B Baker St'
      })
    });
    if (!statusRes.ok) throw new Error(`Status update failed: ${statusRes.statusText}`);
    const statusData = await statusRes.json();
    console.log(`✅ Status updated to "${statusData.status}"`);
  } catch (error) {
    console.error('❌ Status update failed:', error.message);
    process.exit(1);
  }

  // Step 10: Rider updates status to "Delivered"
  console.log(`\nStep 10: Rider updating status to "Delivered"...`);
  try {
    const statusRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      },
      body: JSON.stringify({
        status: 'Delivered',
        note: 'Cash collected and order handed over to customer'
      })
    });
    if (!statusRes.ok) throw new Error(`Status update failed: ${statusRes.statusText}`);
    const statusData = await statusRes.json();
    console.log(`✅ Status updated to "${statusData.status}"`);
    console.log(`   Payment Status: ${statusData.paymentStatus}`);
  } catch (error) {
    console.error('❌ Status update failed:', error.message);
    process.exit(1);
  }

  // Step 11: Verify Rider stats (earnings & collectedCash) updated
  console.log(`\nStep 11: Verifying Rider Rahul's updated stats...`);
  try {
    const statsRes = await fetch(`${API_URL}/riders/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      }
    });
    if (!statsRes.ok) throw new Error(`Stats retrieval failed: ${statsRes.statusText}`);
    const statsData = await statsRes.json();
    console.log('✅ Rider statistics:');
    console.log(`   Earnings (total): $${statsData.earnings}`);
    console.log(`   Collected COD Cash: $${statsData.collectedCash}`);
    console.log(`   Rider workload reset to: ${statsData.riderWorkload}`);
  } catch (error) {
    console.error('❌ Rider stats verification failed:', error.message);
    process.exit(1);
  }

  // Step 12: Get final timeline of the order
  console.log(`\nStep 12: Fetching final timeline of Order ${orderId}...`);
  try {
    const ordersRes = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      }
    });
    if (!ordersRes.ok) throw new Error(`Orders retrieval failed: ${ordersRes.statusText}`);
    const orders = await ordersRes.json();
    const finalOrder = orders.find(o => o._id === orderId);
    
    if (!finalOrder) {
      throw new Error('Order not found in customer orders list');
    }

    console.log('✅ Final Order Status:', finalOrder.status);
    console.log('Timeline Details:');
    finalOrder.timeline.forEach((event, index) => {
      console.log(`   [${index + 1}] Status: ${event.status.padEnd(20)} | Note: ${event.note || ''} | Time: ${new Date(event.timestamp).toLocaleTimeString()}`);
    });
  } catch (error) {
    console.error('❌ Timeline verification failed:', error.message);
    process.exit(1);
  }

  console.log('\n=== HYPERLOCAL DISPATCHER FLOW TEST PASSED SUCCESSFULLY ===');
}

runTestFlow();
