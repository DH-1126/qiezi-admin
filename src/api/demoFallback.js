const baseProducts = [
  ['888003072154', 'QQ-安卓', 'QQ扫码', 131, 186, 38, 40590, 25000, 13, '传说', 60, 3.5, 'standard', 'selling'],
  ['704103071545', '微信-苹果', '微信扫码', 233, 286, 36, 70510, 30000, 23, '巅峰', 60, 5.2, 'standard', 'selling'],
  ['120793071544', 'QQ-安卓', 'QQ扫码', 30, 285, 40, 8800, 10000, 3, '黄金', 60, 0.3, 'standard', 'selling'],
  ['170683071543', '微信-苹果', '微信扫码', 106, 178, 42, 24293, 10000, 11, '钻石', 60, 1.8, 'quick', 'selling'],
  ['620553071542', 'QQ-安卓', 'QQ扫码', 110, 168, 44, 33330, 15000, 11, '铂金', 60, 2.1, 'quick', 'selling'],
  ['782673072152', 'QQ-安卓', 'QQ扫码', 177, 235, 42, 57530, 40000, 18, '黄金', 60, 3.8, 'standard', 'selling'],
  ['913254072153', '微信-安卓', '微信扫码', 95, 142, 46, 21850, 8000, 7, '白银', 55, 1.2, 'standard', 'selling'],
  ['441296071548', 'QQ-苹果', 'QQ扫码', 205, 268, 35, 62380, 35000, 20, '青铜', 60, 4.5, 'standard', 'selling'],
  ['597261071548', 'QQ-安卓', 'QQ扫码', 65, 92, 48, 12500, 5000, 3, '黑鹰', 40, 0.6, 'quick', 'selling'],
  ['832157071547', '微信-苹果', '微信扫码', 280, 320, 33, 92400, 50000, 28, '巅峰', 60, 6, 'standard', 'selling'],
  ['159367071549', 'QQ-安卓', 'QQ扫码', 45, 76, 50, 8800, 3000, 2, '无段位', 25, 0.9, 'quick', 'offline'],
  ['345289071541', '微信-安卓', '微信扫码', 150, 212, 39, 41800, 20000, 10, '铂金', 60, 2.5, 'standard', 'selling'],
];

const products = baseProducts.map((item, index) => {
  const [productNo, server, loginMethod, hafuCoin, totalAsset, ratio, price, deposit, rentDays, rank, level, kdRatio, ratioType, status] = item;
  return {
    id: `demo-p${index + 1}`,
    productNo,
    title: `登录区服:${server} 总资产:${totalAsset}M 纯币资产:${hafuCoin}M ${rank}段位`,
    server,
    loginMethod,
    hafuCoin,
    totalAsset,
    ratio,
    ratioType,
    price,
    deposit,
    rentDays,
    rank,
    level,
    kdRatio,
    status,
    banRecord: '无封禁记录',
    faceOwner: index % 4 !== 2,
    trainingCenter: Math.min(7, Math.max(3, Math.round(level / 9))),
    safeBox: hafuCoin >= 180 ? '3x3' : hafuCoin >= 90 ? '2x3' : '2x2',
    firingRange: 4 + (index % 4),
    accountLoginType: '扫码登录',
    loginRegion: ['河南郑州', '广东深圳', '湖北武汉', '浙江杭州'][index % 4],
    images: [],
    topSkins: index % 3 === 0 ? ['暗星', '处刑者'] : ['北极星'],
    extraItemNames: index % 2 ? ['AWM子弹', '六级甲'] : ['红弹', '六级头'],
    skinAssets: {},
    extraItems: [],
    sellerNickname: ['炉石老司机', '传说打手', '竞技场之王'][index % 3],
    publishTime: `2026-07-${String(18 - index).padStart(2, '0')} 12:00:00`,
  };
});

const announcements = [
  { id: 'demo-a1', title: '9月26日更新公告', summary: '一周年快乐，庆典活动开启', content: '三角洲行动全新赛季开启，更多活动与福利已上线。', publishTime: '2026-07-18 10:00:00' },
  { id: 'demo-a2', title: '封号包赔政策升级', summary: '高额赔付比例，安全交易有保障', content: '平台已升级租号保障规则，具体赔付以订单详情中的保障说明为准。', publishTime: '2026-07-16 14:30:00' },
];

const readJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const parseBody = (options) => {
  try { return JSON.parse(options?.body || '{}'); } catch { return {}; }
};

const result = (data) => ({ handled: true, data });
const unhandled = () => ({ handled: false });

function demoUser() {
  return readJson('user', { id: 'demo-user', phone: '15971444761', nickname: '演示用户', kycStatus: 'verified' });
}

function demoWallet() {
  return readJson('qiezi_demo_wallet', { balance: 500000, freezeAmount: 0, alipayBound: true, alipayAccount: '159****4761' });
}

function demoOrders() {
  return readJson('qiezi_demo_orders', [
    { id: 'demo-o1', orderNo: 'QZ202607180001', productNo: products[1].productNo, productId: products[1].id, totalAmount: products[1].price + products[1].deposit, deposit: products[1].deposit, rentDays: products[1].rentDays, status: 'renting', role: 'buyer' },
    { id: 'demo-o2', orderNo: 'QZ202607170002', productNo: products[3].productNo, productId: products[3].id, totalAmount: products[3].price + products[3].deposit, deposit: products[3].deposit, rentDays: products[3].rentDays, status: 'pending_ship', role: 'seller' },
  ]);
}

export function demoFallback(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const parsed = new URL(url, 'https://demo.local');
  const path = parsed.pathname;

  if (method === 'GET' && path === '/products') {
    let list = [...products];
    const filters = parsed.searchParams;
    if (filters.get('server')) list = list.filter((item) => item.server === filters.get('server'));
    if (filters.get('loginMethod')) list = list.filter((item) => item.loginMethod === filters.get('loginMethod'));
    if (filters.get('hafuCoinMin')) list = list.filter((item) => item.hafuCoin >= Number(filters.get('hafuCoinMin')));
    if (filters.get('hafuCoinMax')) list = list.filter((item) => item.hafuCoin <= Number(filters.get('hafuCoinMax')));
    if (filters.get('priceMin')) list = list.filter((item) => item.price >= Number(filters.get('priceMin')));
    if (filters.get('priceMax')) list = list.filter((item) => item.price <= Number(filters.get('priceMax')));
    if (filters.get('rank')) list = list.filter((item) => item.rank === filters.get('rank'));
    if (filters.get('keyword')) list = list.filter((item) => `${item.title}${item.productNo}`.includes(filters.get('keyword')));
    const page = Number(filters.get('page') || 1);
    const pageSize = Number(filters.get('pageSize') || 10);
    return result({ list: list.slice((page - 1) * pageSize, page * pageSize), total: list.length, page, pageSize });
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (method === 'GET' && productMatch) return result(products.find((item) => item.id === productMatch[1]) || products[0]);

  if (method === 'POST' && path === '/auth/login') {
    const body = parseBody(options);
    if (!/^1\d{10}$/.test(body.phone || '')) throw new Error('手机号格式错误');
    if (body.code !== '123456') throw new Error('验证码错误');
    const user = { id: 'demo-user', phone: body.phone, nickname: `用户${body.phone.slice(-4)}`, kycStatus: 'verified' };
    writeJson('user', user);
    return result({ token: 'qiezi-demo-token', user });
  }

  if (method === 'GET' && path === '/user/current') return result(demoUser());
  if (method === 'GET' && path === '/wallet/info') return result(demoWallet());
  if (method === 'GET' && path === '/wallet/transactions') return result({ list: readJson('qiezi_demo_transactions', []), total: readJson('qiezi_demo_transactions', []).length });

  if (method === 'POST' && path === '/wallet/recharge') {
    const body = parseBody(options);
    const wallet = demoWallet();
    wallet.balance += Number(body.amount || 0);
    writeJson('qiezi_demo_wallet', wallet);
    const transactions = readJson('qiezi_demo_transactions', []);
    transactions.unshift({ id: `demo-t${Date.now()}`, type: 'recharge', amount: Number(body.amount || 0), status: 'success' });
    writeJson('qiezi_demo_transactions', transactions);
    return result({ success: true });
  }

  if (method === 'POST' && path === '/wallet/withdraw') {
    const body = parseBody(options);
    const wallet = demoWallet();
    if (Number(body.amount || 0) > wallet.balance) throw new Error('可用余额不足');
    wallet.balance -= Number(body.amount || 0);
    wallet.freezeAmount += Number(body.amount || 0);
    writeJson('qiezi_demo_wallet', wallet);
    return result({ success: true });
  }

  if (method === 'POST' && path === '/wallet/alipay/bind') {
    const wallet = demoWallet();
    writeJson('qiezi_demo_wallet', { ...wallet, alipayBound: true, alipayAccount: '159****4761' });
    return result({ success: true });
  }

  if (method === 'GET' && path === '/orders') {
    let list = demoOrders();
    if (parsed.searchParams.get('role')) list = list.filter((item) => item.role === parsed.searchParams.get('role'));
    if (parsed.searchParams.get('status')) list = list.filter((item) => item.status === parsed.searchParams.get('status'));
    return result({ list, total: list.length });
  }

  if (method === 'POST' && path === '/orders') {
    const product = products.find((item) => item.id === parseBody(options).productId) || products[0];
    const order = { id: `demo-o${Date.now()}`, orderNo: `QZ${Date.now()}`, productNo: product.productNo, productId: product.id, totalAmount: product.price + product.deposit, deposit: product.deposit, rentDays: product.rentDays, status: 'pending_pay', role: 'buyer' };
    writeJson('qiezi_demo_orders', [order, ...demoOrders()]);
    return result({ success: true, orderId: order.id });
  }

  const orderActionMatch = path.match(/^\/orders\/([^/]+)\/([^/]+)$/);
  if (method === 'POST' && orderActionMatch) {
    const statusMap = { pay: 'pending_ship', ship: 'pending_receive', receive: 'renting', cancel: 'cancelled', refund: 'refunding', renew: 'renting' };
    const list = demoOrders().map((item) => item.id === orderActionMatch[1] ? { ...item, status: statusMap[orderActionMatch[2]] || item.status } : item);
    writeJson('qiezi_demo_orders', list);
    return result({ success: true });
  }

  if (method === 'GET' && path === '/seller/products') {
    let list = products.slice(0, 6);
    const status = parsed.searchParams.get('status');
    const keyword = parsed.searchParams.get('keyword');
    if (status) list = list.filter((item) => item.status === status);
    if (keyword) list = list.filter((item) => item.productNo.includes(keyword));
    return result({ list, total: list.length });
  }

  if (method === 'POST' && path === '/products/estimate') {
    const body = parseBody(options);
    const standardRatio = Number(body.trainingCenter || 1) * 10 + (body.safeBox === '3x3' ? 5 : 0) + 20;
    return result({ standardRatio, quickRatio: Math.round(standardRatio * 0.85), netAmount: Number(body.hafuCoin || 0) * standardRatio * 100, suggestedDeposit: 10000, suggestedPeriod: Math.max(1, Math.round(Number(body.hafuCoin || 0) / 5)) });
  }

  if (method === 'POST' && path === '/products/publish') return result({ success: true, productId: `demo-p${Date.now()}` });

  if (method === 'GET' && path === '/announcements') return result({ list: announcements, total: announcements.length });
  const announcementMatch = path.match(/^\/announcements\/([^/]+)$/);
  if (method === 'GET' && announcementMatch) return result(announcements.find((item) => item.id === announcementMatch[1]) || announcements[0]);

  return unhandled();
}
