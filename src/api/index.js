const BASE_URL = '/mock-api';

export async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('未登录');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || error.error || '请求失败');
  }

  return res.json();
}

export function login(phone, code) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ phone, code }) });
}

export function submitKYC(realName, idCard) {
  return request('/auth/kyc', { method: 'POST', body: JSON.stringify({ realName, idCard }) });
}

export function getCurrentUser() {
  return request('/user/current');
}

export function getWallet() {
  return request('/wallet/info');
}

export function getTransactions(page = 1) {
  return request(`/wallet/transactions?page=${page}`);
}

export function recharge(amount) {
  return request('/wallet/recharge', { method: 'POST', body: JSON.stringify({ amount }) });
}

export function withdraw(amount) {
  return request('/wallet/withdraw', { method: 'POST', body: JSON.stringify({ amount }) });
}

export function bindAlipay() {
  return request('/wallet/alipay/bind', { method: 'POST' });
}

export function getProducts(params = {}) {
  const q = new URLSearchParams(params);
  return request(`/products?${q}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function getOrders(params = {}) {
  const q = new URLSearchParams(params);
  return request(`/orders?${q}`);
}

export function createOrder(productId) {
  return request('/orders', { method: 'POST', body: JSON.stringify({ productId }) });
}

export function orderAction(orderId, action, extra = {}) {
  return request(`/orders/${orderId}/${action}`, { method: 'POST', body: JSON.stringify(extra) });
}
