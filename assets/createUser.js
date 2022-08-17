export default async function createUser(userData) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
}