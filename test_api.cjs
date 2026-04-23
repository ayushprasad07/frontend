const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'moris@gmail.com',
      password: 'moris123'
    }, {
      withCredentials: true
    });
    console.log('Login Response:', loginRes.data);
    
    const cookies = loginRes.headers['set-cookie'];
    console.log('Cookies received:', cookies);

    const itemsRes = await axios.get('http://localhost:3000/api/item', {
      headers: {
        Cookie: cookies[0]
      }
    });
    console.log('Items Response:', itemsRes.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
test();
