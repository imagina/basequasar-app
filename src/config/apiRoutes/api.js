const base_url = env('BASE_URL', 'http://localhost:8000');
const api_url = base_url + '/api';

export default {
  base_url,
  api_url,
  token_url: base_url + '/api/login',
}
