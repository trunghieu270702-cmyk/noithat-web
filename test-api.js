const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:3001/api/v1/units', {
      name: 'Test Unit',
      slug: 'test-unit',
      segment: 'trung-cap',
      location: 'Hanoi',
      projectType: 'Chung cu',
      style: 'Hien dai',
      experience: 5,
      status: 'ACTIVE',
      avatar: []
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error:', err.response?.status, err.response?.data || err.message);
  }
}
run();
