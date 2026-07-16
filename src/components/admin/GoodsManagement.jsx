import { useEffect, useMemo, useState } from 'react';
import './GoodsManagement.css';

const GOODS_STORAGE_KEY = 'qiezi_admin_goods_v3';
const CHANNEL_ACCOUNT_STORAGE_KEY = 'qiezi_channel_account_v1';
const GOODS_IMAGE = `${import.meta.env.BASE_URL}assets/goods-avatar.png`;

const EMPTY_FILTERS = {
  productType: '全部商品',
  status: '全部商品',
  userId: '',
  phone: '',
  title: '',
  productNo: '',
  thirdProductId: '',
  onlineStart: '',
  onlineEnd: '',
  offlineStart: '',
  offlineEnd: '',
};

const BASE_GOODS = [
  {
    productNo: '7273424328', thirdProductId: '812065', productType: '三方商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '总资产：382 M 纯币资产：382 M  区服：PC/QQ 账密：扫码登录 段位：黑鹰 安全箱：3x3 awm子弹：276 靶场等级：7级 账号等级：60 训练中心：7级',
    cost: 1015.2, rent: 1082.88, deposit: 500, quickRatio: '否', rentDays: 38, settlementMode: '租期内打完', status: '上架中', onlineTime: '2026-07-15 20:37:44', offlineTime: '', lastOperateTime: '2026-07-15 20:37:44', lastOperator: '',
    auditResult: '审核通过', auditTime: '/', auditor: '/', submitTime: '2026-07-15 20:37:44', safeBox: '3x3', faceOwner: '是', shootingRange: '7级', loginMethod: '扫码登录', accountLevel: '60', remark: '赛伊德 造物纪元-kc17和电玩高手-scarh，6头：10个，6甲：10个，绝密KD：1.1', rank: '黑鹰', accountType: '纯币号', ratioSetting: '租期内打完 买家-36,卖家-', helmet6: '10', armor6: '10', redAmmo: '/', card33: '/', barrett: '/', totalAsset: '382', pureCoin: '382', banRecord: '无封禁记录', trainingCenter: '7级', commonLoginArea: '/', ownerGift: '', knifeSkins: '/', gunSkins: '/', operatorSkins: '/', sellerDeposit: null,
  },
  {
    productNo: '3143424327', thirdProductId: '812064', productType: '三方商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '总资产：76 M 纯币资产：76 M  区服：PC/QQ 账密：账密登录 段位：黑鹰 安全箱：2x3 awm子弹：4 靶场等级：7级 账号等级：60 训练中心：7级 刀皮：坠星者',
    cost: 192.6, rent: 205.44, deposit: 300, quickRatio: '否', rentDays: 8, settlementMode: '租期内打完', safeBox: '2x3', shootingRange: '7级', loginMethod: '账密登录', accountLevel: '60', rank: '黑鹰', totalAsset: '76', pureCoin: '76', knifeSkins: '坠星者', awmAmmo: '4',
  },
  {
    productNo: '5649924326', thirdProductId: '812063', productType: '三方商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '总资产：41 M 纯币资产：41 M  区服：PC/QQ 账密：扫码登录 段位：钻石 安全箱：2x2 awm子弹：3 靶场等级：4级 账号等级：40 训练中心：4级',
    cost: 107.1, rent: 114.24, deposit: 100, quickRatio: '否', rentDays: 4, settlementMode: '租期内打完', safeBox: '2x2', shootingRange: '4级', loginMethod: '扫码登录', accountLevel: '40', rank: '钻石', totalAsset: '41', pureCoin: '41', awmAmmo: '3',
  },
  {
    productNo: '2188324325', thirdProductId: '812062', productType: '三方商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '总资产：80 M 纯币资产：80 M  区服：PC/QQ 账密：账密登录 段位：三角洲巅峰 安全箱：3x3 awm子弹：67 靶场等级：7级 账号等级：60 训练中心：7级 刀皮：处刑者,坠星者',
    cost: 212.4, rent: 226.56, deposit: 500, quickRatio: '否', rentDays: 8, settlementMode: '租期内打完', safeBox: '3x3', shootingRange: '7级', loginMethod: '账密登录', accountLevel: '60', rank: '三角洲巅峰', totalAsset: '80', pureCoin: '80', knifeSkins: '处刑者、坠星者', awmAmmo: '67',
  },
  {
    productNo: '1315124324', thirdProductId: '812061', productType: '三方商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '总资产：85 M 纯币资产：85 M  区服：PC/QQ 账密：扫码登录 段位：白银 安全箱：2x2 awm子弹：10 靶场等级：6级 账号等级：60 训练中心：6级',
    cost: 201.6, rent: 215.04, deposit: 150, quickRatio: '否', rentDays: 9, settlementMode: '租期内打完', safeBox: '2x2', shootingRange: '6级', loginMethod: '扫码登录', accountLevel: '60', rank: '白银', totalAsset: '85', pureCoin: '85', awmAmmo: '10',
  },
  {
    productNo: '2582924323', thirdProductId: '812060', productType: '三方商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '总资产：110 M 纯币资产：110 M  区服：PC/QQ 账密：扫码登录 段位：铂金 安全箱：3x3 awm子弹：4 靶场等级：7级 账号等级：60 训练中心：7级 刀皮：怜悯',
    cost: 308.7, rent: 329.28, deposit: 600, quickRatio: '否', rentDays: 11, settlementMode: '租期内打完', safeBox: '3x3', shootingRange: '7级', loginMethod: '扫码登录', accountLevel: '60', rank: '铂金', totalAsset: '110', pureCoin: '110', knifeSkins: '怜悯', awmAmmo: '4',
  },
  {
    productNo: '5201024299', thirdProductId: '', productType: '自建商品', channel: 'PC', gameServer: '微信', sellerId: '154420045', phone: '18942914433',
    title: '登录区服:微信 总资产：45 M 纯币资产：45 M  角色：水墨云图 维什戴尔 不破誓约 街头之王 黑鹰坠落 账密：扫码登录 段位：钻石 安全箱：3x3 靶场等级：6级 账号等级：30 训练中心：6级 刀皮：信条 暗星 龙牙 处刑者 电锯惊魂 北极星 坠星者 黑海',
    cost: 136.37, rent: 150.01, deposit: 19, quickRatio: '否', rentDays: 5, settlementMode: '协商保底消耗', safeBox: '3x3', shootingRange: '6级', loginMethod: '扫码登录', accountLevel: '30', rank: '钻石', totalAsset: '45', pureCoin: '45', knifeSkins: '信条、暗星、龙牙、处刑者、电锯惊魂、北极星、坠星者、黑海',
  },
  {
    productNo: '2032124298', thirdProductId: '', productType: '自建商品', channel: 'PC', gameServer: 'QQ', sellerId: '154420045', phone: '18942914433',
    title: '登录区服:QQ 总资产：50 M 纯币资产：50 M  账密：账密登录 安全箱：3x3 靶场等级：5级 账号等级：50 训练中心：6级',
    cost: 142.86, rent: 157.15, deposit: 1, quickRatio: '否', rentDays: 5, settlementMode: '协商保底消耗', safeBox: '3x3', shootingRange: '5级', loginMethod: '账密登录', accountLevel: '50', totalAsset: '50', pureCoin: '50',
  },
  {
    productNo: '7055524297', thirdProductId: '', productType: '自建商品', channel: 'PC', gameServer: '微信', sellerId: '154577265', phone: '13600365350',
    title: '登录区服:微信 总资产：20 M 纯币资产：20 M  账密：扫码登录 安全箱：3x3 靶场等级：6级 账号等级：50 训练中心：5级',
    cost: 54.06, rent: 59.47, deposit: 1, quickRatio: '否', rentDays: 2, settlementMode: '租期内打完', safeBox: '3x3', shootingRange: '6级', loginMethod: '扫码登录', accountLevel: '50', totalAsset: '20', pureCoin: '20',
  },
  {
    productNo: '5522724296', thirdProductId: '', productType: '自建商品', channel: 'PC', gameServer: 'QQ', sellerId: '154577265', phone: '13600365350',
    title: '登录区服:QQ 总资产：50 M 纯币资产：50 M  账密：账密登录 段位：青铜 安全箱：3x3 靶场等级：5级 账号等级：30 训练中心：6级',
    cost: 76.93, rent: 84.63, deposit: 1, quickRatio: '是', rentDays: 5, settlementMode: '租期内打完', safeBox: '3x3', shootingRange: '5级', loginMethod: '账密登录', accountLevel: '30', rank: '青铜', totalAsset: '50', pureCoin: '50',
  },
];

function createGoods() {
  const operators = ['', '詹志威', '王永祁', '顾修鸣'];
  return Array.from({ length: 14 }, (_, index) => {
    const base = BASE_GOODS[index % BASE_GOODS.length];
    const day = String(15 - (index % 14)).padStart(2, '0');
    const hour = String(20 - (index % 12)).padStart(2, '0');
    const status = index < 4 ? '上架中' : '已下架';
    const onlineTime = index < 10 ? (base.onlineTime || `2026-07-${day} ${hour}:37:44`) : `2026-07-${day} ${hour}:37:44`;
    const productNo = index < 10 ? base.productNo : String(9000000000 - index * 7311);
    const thirdProductId = base.productType === '三方商品' ? String(812065 - index) : '';
    return {
      auditResult: '审核通过', auditTime: '/', auditor: '/', faceOwner: '是', accountType: '纯币号', ratioSetting: `${base.settlementMode || '租期内打完'} 买家-36,卖家-`,
      remark: '原型演示商品，账号和资产信息仅用于产品交互验证。', helmet6: '/', armor6: '/', redAmmo: '/', card33: '/', barrett: '/', banRecord: '无封禁记录', trainingCenter: '7级', commonLoginArea: '/', ownerGift: '', knifeSkins: '/', gunSkins: '/', operatorSkins: '/', sellerDeposit: null, awmAmmo: '/',
      ...base,
      id: `goods-${index + 1}`,
      productNo,
      thirdProductId,
      status,
      onlineTime,
      submitTime: base.submitTime || onlineTime,
      offlineTime: status === '已下架' ? `2026-07-${day} 23:00:00` : '',
      lastOperateTime: base.lastOperateTime || onlineTime,
      lastOperator: base.lastOperator ?? operators[index % operators.length],
      image: GOODS_IMAGE,
    };
  });
}

function loadChannelAccount() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHANNEL_ACCOUNT_STORAGE_KEY));
    if (saved?.accountId) return saved;
  } catch {
    // Invalid demo cache falls back to a newly generated account.
  }
  const account = {
    channelName: '咸鱼',
    accountId: `XY${String(Date.now()).slice(-10)}`,
    accountName: '咸鱼',
  };
  localStorage.setItem(CHANNEL_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  return account;
}

function formatDateTime(date = new Date()) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function loadGoods() {
  try {
    const saved = JSON.parse(localStorage.getItem(GOODS_STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    // Invalid demo cache falls back to a fresh data set.
  }
  return createGoods();
}

const COLUMN_DEFS = [
  { key: 'productNo', label: '商品编号', width: 120, sortable: true },
  { key: 'thirdProductId', label: '三方商品ID', width: 110, sortable: true },
  { key: 'productType', label: '商品类型', width: 100 },
  { key: 'channel', label: '渠道', width: 80 },
  { key: 'title', label: '商品标题', width: 300 },
  { key: 'image', label: '商品图片', width: 88 },
  { key: 'gameServer', label: '游戏区服', width: 90 },
  { key: 'sellerId', label: '用户ID', width: 110, sortable: true },
  { key: 'phone', label: '手机号', width: 120 },
  { key: 'cost', label: '成本金额(元)', width: 110, sortable: true },
  { key: 'rent', label: '出租金额(元)', width: 110, sortable: true },
  { key: 'deposit', label: '押金金额(元)', width: 110, sortable: true },
  { key: 'quickRatio', label: '是否快出比例', width: 110 },
  { key: 'rentDays', label: '推荐租期(天)', width: 110, sortable: true },
  { key: 'settlementMode', label: '结算模式', width: 120 },
  { key: 'status', label: '商品状态', width: 100 },
  { key: 'onlineTime', label: '上架时间', width: 165, sortable: true },
  { key: 'offlineTime', label: '下架时间', width: 165, sortable: true },
  { key: 'lastOperateTime', label: '最后操作时间', width: 165, sortable: true },
  { key: 'lastOperator', label: '最后操作人', width: 110 },
  { key: 'actions', label: '操作', width: 130 },
];

function compareValue(a, b, direction) {
  const av = a ?? '';
  const bv = b ?? '';
  const result = typeof av === 'number' && typeof bv === 'number'
    ? av - bv
    : String(av).localeCompare(String(bv), 'zh-CN', { numeric: true });
  return direction === 'asc' ? result : -result;
}

function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'right-gap', total];
  if (current >= total - 3) return [1, 'left-gap', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'left-gap', current - 1, current, current + 1, 'right-gap', total];
}

function statusClass(status) {
  if (status === '上架中') return 'is-online';
  if (status === '审核中') return 'is-review';
  return 'is-offline';
}

export default function GoodsManagement({ onOpenDetail, onCreateOrder }) {
  const [goods, setGoods] = useState(loadGoods);
  const [channelAccount] = useState(loadChannelAccount);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('');
  const [sort, setSort] = useState({ key: 'onlineTime', direction: 'desc' });
  const [visibleColumns, setVisibleColumns] = useState(() => COLUMN_DEFS.map(column => column.key));
  const [columnDraft, setColumnDraft] = useState(() => COLUMN_DEFS.map(column => column.key));
  const [showColumns, setShowColumns] = useState(false);
  const [pendingOffline, setPendingOffline] = useState([]);
  const [showChannelAccount, setShowChannelAccount] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [backendOrderForm, setBackendOrderForm] = useState({ channel: '咸鱼', channelOrderNo: '' });
  const [backendOrderError, setBackendOrderError] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(GOODS_STORAGE_KEY, JSON.stringify(goods));
  }, [goods]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredGoods = useMemo(() => {
    const result = goods.filter(item => {
      if (filters.productType !== '全部商品' && item.productType !== filters.productType) return false;
      if (filters.status !== '全部商品' && item.status !== filters.status) return false;
      if (filters.userId && !item.sellerId.includes(filters.userId.trim())) return false;
      if (filters.phone && !item.phone.includes(filters.phone.trim())) return false;
      if (filters.title && !item.title.toLowerCase().includes(filters.title.trim().toLowerCase())) return false;
      if (filters.productNo && !item.productNo.includes(filters.productNo.trim())) return false;
      if (filters.thirdProductId && !item.thirdProductId.includes(filters.thirdProductId.trim())) return false;
      if (filters.onlineStart && item.onlineTime.slice(0, 10) < filters.onlineStart) return false;
      if (filters.onlineEnd && item.onlineTime.slice(0, 10) > filters.onlineEnd) return false;
      if (filters.offlineStart && (!item.offlineTime || item.offlineTime.slice(0, 10) < filters.offlineStart)) return false;
      if (filters.offlineEnd && (!item.offlineTime || item.offlineTime.slice(0, 10) > filters.offlineEnd)) return false;
      return true;
    });
    return [...result].sort((a, b) => compareValue(a[sort.key], b[sort.key], sort.direction));
  }, [filters, goods, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredGoods.length / pageSize));
  const pagedGoods = filteredGoods.slice((page - 1) * pageSize, page * pageSize);
  const selectedOnPage = pagedGoods.filter(item => selectedIds.has(item.id));
  const allPageSelected = pagedGoods.length > 0 && selectedOnPage.length === pagedGoods.length;

  useEffect(() => {
    setPage(current => Math.min(current, totalPages));
  }, [totalPages]);

  const updateDraft = (key, value) => setDraftFilters(current => ({ ...current, [key]: value }));

  const handleQuery = () => {
    setFilters({ ...draftFilters });
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleReset = () => {
    setDraftFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setSelectedIds(new Set());
  };

  const toggleSelectAll = () => {
    setSelectedIds(current => {
      const next = new Set(current);
      if (allPageSelected) pagedGoods.forEach(item => next.delete(item.id));
      else pagedGoods.forEach(item => next.add(item.id));
      return next;
    });
  };

  const toggleSelect = id => {
    setSelectedIds(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const requestOffline = ids => {
    if (!ids.length) return;
    setPendingOffline(ids);
  };

  const confirmOffline = () => {
    const now = formatDateTime();
    const idSet = new Set(pendingOffline);
    setGoods(current => current.map(item => idSet.has(item.id)
      ? { ...item, status: '已下架', offlineTime: now, lastOperateTime: now, lastOperator: '邓辉' }
      : item));
    setSelectedIds(current => {
      const next = new Set(current);
      pendingOffline.forEach(id => next.delete(id));
      return next;
    });
    setPendingOffline([]);
    setToast(`已下架 ${idSet.size} 个商品`);
  };

  const openBackendOrder = product => {
    setOrderProduct(product);
    setBackendOrderForm({ channel: '咸鱼', channelOrderNo: '' });
    setBackendOrderError('');
  };

  const confirmBackendOrder = () => {
    const channelOrderNo = backendOrderForm.channelOrderNo.trim();
    if (!channelOrderNo) {
      setBackendOrderError('请输入咸鱼渠道对应的订单号');
      return;
    }
    let result;
    try {
      result = onCreateOrder?.({
        product: orderProduct,
        channel: backendOrderForm.channel,
        channelOrderNo,
      });
    } catch {
      result = { success: false, reason: '系统异常，请稍后重试' };
    }
    if (!result?.success) {
      setOrderProduct(null);
      setBackendOrderError('');
      setOrderResult({ type: 'error', reason: result?.reason || '系统异常，请稍后重试' });
      return;
    }
    const now = formatDateTime();
    setGoods(current => current.map(item => item.id === orderProduct.id
      ? { ...item, status: '已下架', offlineTime: now, lastOperateTime: now, lastOperator: '邓辉（后台下单）' }
      : item));
    setOrderProduct(null);
    setBackendOrderError('');
    setOrderResult({ type: 'success', orderNo: result.orderNo });
  };

  const changeSort = key => {
    setSort(current => current.key === key
      ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' });
  };

  const exportGoods = () => {
    const exportColumns = COLUMN_DEFS.filter(column => visibleColumns.includes(column.key) && !['image', 'actions'].includes(column.key));
    const rows = [
      exportColumns.map(column => column.label),
      ...filteredGoods.map(item => exportColumns.map(column => item[column.key] ?? '')),
    ];
    const csv = `\ufeff${rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `商品管理_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast(`已导出 ${filteredGoods.length} 条商品数据`);
  };

  const saveColumns = () => {
    if (!columnDraft.length) return;
    setVisibleColumns([...columnDraft]);
    setShowColumns(false);
    setToast('列展示设置已保存');
  };

  const renderCell = (item, key) => {
    if (key === 'title') return <div className="goods-admin-title-cell" title={item.title}>{item.title}</div>;
    if (key === 'image') return <button className="goods-admin-image-link" onClick={() => setPreviewImage(item.image)}><img src={item.image} alt="商品" />1张</button>;
    if (key === 'productNo' || key === 'sellerId') return <button className="goods-admin-link" onClick={() => onOpenDetail(item)}>{item[key]}</button>;
    if (key === 'thirdProductId') return item[key] || '-';
    if (['cost', 'rent', 'deposit'].includes(key)) return Number(item[key]).toLocaleString('zh-CN', { minimumFractionDigits: key === 'deposit' ? 0 : 2, maximumFractionDigits: 2 });
    if (key === 'status') return <span className={`goods-admin-status ${statusClass(item.status)}`}>{item.status}</span>;
    if (key === 'offlineTime' || key === 'lastOperator') return item[key] || '-';
    if (key === 'actions') return (
      <div className="goods-admin-actions">
        <button onClick={() => onOpenDetail(item)}>查看详情</button>
        {item.status === '上架中' && <button onClick={() => openBackendOrder(item)}>后台下单</button>}
        {item.status !== '已下架' && <button className="danger" onClick={() => requestOffline([item.id])}>下架</button>}
      </div>
    );
    return item[key];
  };

  return (
    <div className="goods-admin-page">
      <section className="goods-admin-filter-panel">
        <div className="goods-admin-filter-row">
          <DateField label="上架时间" start={draftFilters.onlineStart} end={draftFilters.onlineEnd} onStart={value => updateDraft('onlineStart', value)} onEnd={value => updateDraft('onlineEnd', value)} />
          <DateField label="下架时间" start={draftFilters.offlineStart} end={draftFilters.offlineEnd} onStart={value => updateDraft('offlineStart', value)} onEnd={value => updateDraft('offlineEnd', value)} />
          <label className="goods-admin-field"><span>商品类型</span><select value={draftFilters.productType} onChange={event => updateDraft('productType', event.target.value)}><option>全部商品</option><option>三方商品</option><option>自建商品</option></select></label>
          <label className="goods-admin-field"><span>商品状态</span><select value={draftFilters.status} onChange={event => updateDraft('status', event.target.value)}><option>全部商品</option><option>上架中</option><option>已下架</option><option>审核中</option></select></label>
        </div>
        <div className="goods-admin-filter-row">
          <TextField label="用户ID" placeholder="请输入用户ID" value={draftFilters.userId} onChange={value => updateDraft('userId', value)} />
          <TextField label="手机号" placeholder="请输入手机号" value={draftFilters.phone} onChange={value => updateDraft('phone', value)} />
          <TextField label="商品标题" placeholder="请输入商品标题" value={draftFilters.title} onChange={value => updateDraft('title', value)} wide />
          <TextField label="商品编号" placeholder="请输入商品编号" value={draftFilters.productNo} onChange={value => updateDraft('productNo', value)} />
          <TextField label="三方商品ID" placeholder="三方商品ID" value={draftFilters.thirdProductId} onChange={value => updateDraft('thirdProductId', value)} />
        </div>
        <div className="goods-admin-filter-actions">
          <button className="primary" onClick={handleQuery}>查 询</button>
          <button onClick={handleReset}>重 置</button>
          <button onClick={exportGoods}>导 出</button>
          <button className="danger-outline" disabled={!selectedIds.size} onClick={() => requestOffline([...selectedIds])}>批量下架</button>
          <button onClick={() => setShowChannelAccount(true)}>渠道账号管理</button>
          <span>{selectedIds.size ? `已选中 ${selectedIds.size} 条数据` : '未选中任何数据'}</span>
        </div>
      </section>

      <section className="goods-admin-table-card">
        <div className="goods-admin-table-tools">
          <span>共 {filteredGoods.length} 条数据</span>
          <div className="goods-admin-column-wrap">
            <button className="goods-admin-column-button" onClick={() => { setColumnDraft([...visibleColumns]); setShowColumns(value => !value); }}>⚙ 列展示</button>
            {showColumns && (
              <div className="goods-admin-column-panel">
                <strong>列展示</strong>
                <div className="goods-admin-column-list">
                  {COLUMN_DEFS.map(column => (
                    <label key={column.key}>
                      <input type="checkbox" checked={columnDraft.includes(column.key)} onChange={() => setColumnDraft(current => current.includes(column.key) ? current.filter(key => key !== column.key) : [...current, column.key])} />
                      {column.label}
                    </label>
                  ))}
                </div>
                <div className="goods-admin-column-footer">
                  <button onClick={() => setColumnDraft(COLUMN_DEFS.map(column => column.key))}>重 置</button>
                  <button className="primary" onClick={saveColumns}>保 存</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="goods-admin-table-scroll">
          <table className="goods-admin-table">
            <thead>
              <tr>
                <th className="goods-admin-check-column"><input aria-label="全选本页商品" type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} /></th>
                {COLUMN_DEFS.filter(column => visibleColumns.includes(column.key)).map(column => (
                  <th key={column.key} style={{ minWidth: column.width }} className={column.key === 'actions' ? 'goods-admin-sticky-action' : ''}>
                    <button className={column.sortable ? 'sortable' : ''} onClick={() => column.sortable && changeSort(column.key)}>
                      {column.label}
                      {column.sortable && <span>{sort.key === column.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedGoods.map(item => (
                <tr key={item.id} className={selectedIds.has(item.id) ? 'is-selected' : ''}>
                  <td className="goods-admin-check-column"><input aria-label={`选择商品${item.productNo}`} type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} /></td>
                  {COLUMN_DEFS.filter(column => visibleColumns.includes(column.key)).map(column => (
                    <td key={column.key} className={column.key === 'actions' ? 'goods-admin-sticky-action' : ''}>{renderCell(item, column.key)}</td>
                  ))}
                </tr>
              ))}
              {!pagedGoods.length && <tr><td colSpan={visibleColumns.length + 1} className="goods-admin-empty">暂无符合条件的商品</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="goods-admin-pagination">
          <span>共 {filteredGoods.length} 条数据</span>
          <button disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))}>‹</button>
          {getPageItems(page, totalPages).map((item, index) => typeof item === 'number'
            ? <button key={item} className={page === item ? 'is-active' : ''} onClick={() => setPage(item)}>{item}</button>
            : <span key={`${item}-${index}`}>•••</span>)}
          <button disabled={page === totalPages} onClick={() => setPage(current => Math.min(totalPages, current + 1))}>›</button>
          <select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1); }}><option value={10}>10 条/页</option><option value={20}>20 条/页</option><option value={50}>50 条/页</option></select>
          <span>跳至</span>
          <input value={jumpPage} onChange={event => setJumpPage(event.target.value.replace(/\D/g, ''))} onKeyDown={event => { if (event.key === 'Enter') { const target = Math.min(totalPages, Math.max(1, Number(jumpPage) || 1)); setPage(target); setJumpPage(''); } }} />
          <span>页</span>
        </div>
      </section>

      {pendingOffline.length > 0 && <ConfirmOffline count={pendingOffline.length} onCancel={() => setPendingOffline([])} onConfirm={confirmOffline} />}
      {showChannelAccount && <ChannelAccountModal account={channelAccount} onClose={() => setShowChannelAccount(false)} />}
      {orderProduct && (
        <BackendOrderModal
          product={orderProduct}
          form={backendOrderForm}
          error={backendOrderError}
          onChange={value => { setBackendOrderForm(current => ({ ...current, channelOrderNo: value })); setBackendOrderError(''); }}
          onCancel={() => { setOrderProduct(null); setBackendOrderError(''); }}
          onConfirm={confirmBackendOrder}
        />
      )}
      {orderResult && <BackendOrderResultModal result={orderResult} onConfirm={() => setOrderResult(null)} />}
      {previewImage && <ImagePreview src={previewImage} onClose={() => setPreviewImage('')} />}
      {toast && <div className="goods-admin-toast">✓ {toast}</div>}
    </div>
  );
}

export function ProductDetailPage({ product, onBack }) {
  const [previewImage, setPreviewImage] = useState('');
  const display = value => value === null || value === undefined || value === '' ? '/' : value;
  return (
    <div className="goods-detail-page">
      <div className="goods-detail-header">
        <div><span className="goods-detail-eyebrow">商品详情页</span><h2>商品详情</h2></div>
        <button onClick={onBack}>返 回</button>
      </div>

      <DetailSection title="基本信息">
        <DetailItem label="用户ID" value={product.sellerId} link />
        <DetailItem label="审核结果" value={product.auditResult} success />
        <DetailItem label="审核时间" value={display(product.auditTime)} />
        <DetailItem label="手机号" value={product.phone} />
        <DetailItem label="审核人" value={display(product.auditor)} />
        <DetailItem label="提交时间" value={product.submitTime} />
        <DetailItem label="下架时间" value={display(product.offlineTime)} />
      </DetailSection>

      <DetailSection title="商品信息">
        <DetailItem label="商品编号" value={product.productNo} link />
        <DetailItem label="安全箱" value={display(product.safeBox)} />
        <DetailItem label="人脸是否本人" value={display(product.faceOwner)} />
        <DetailItem label="推荐租期(天)" value={`${product.rentDays}天`} />
        <DetailItem label="商品标题" value={product.title} wide />
        <DetailItem label="靶场等级" value={display(product.shootingRange)} />
        <DetailItem label="登录方式" value={display(product.loginMethod)} />
        <DetailItem label="个性标题" value={product.title} wide />
        <div className="goods-detail-item"><span>商品图片:</span><button className="goods-detail-image" onClick={() => setPreviewImage(product.image)}><img src={product.image} alt="商品截图" /></button></div>
        <DetailItem label="awm子弹" value={display(product.awmAmmo)} />
        <DetailItem label="账号等级" value={display(product.accountLevel)} />
        <DetailItem label="商品备注" value={display(product.remark)} wide />
        <DetailItem label="段位" value={display(product.rank)} />
        <DetailItem label="号主赠送" value={display(product.ownerGift)} />
        <DetailItem label="游戏区服" value={display(product.gameServer)} />
        <DetailItem label="持有刀皮" value={display(product.knifeSkins)} />
        <DetailItem label="持有枪皮" value={display(product.gunSkins)} />
        <DetailItem label="账号类型" value={display(product.accountType)} />
        <DetailItem label="干员外观" value={display(product.operatorSkins)} />
        <DetailItem label="比例设定" value={display(product.ratioSetting)} wide />
      </DetailSection>

      <DetailSection title="额外道具付费设置">
        <DetailItem label="6头" value={display(product.helmet6)} />
        <DetailItem label="6甲" value={display(product.armor6)} />
        <DetailItem label="红弹" value={display(product.redAmmo)} />
        <DetailItem label="3*3体验卡" value={display(product.card33)} />
        <DetailItem label="巴雷特" value={display(product.barrett)} />
        <DetailItem label="仓库总资产(M)" value={display(product.totalAsset)} />
        <DetailItem label="哈夫币纯币(M)" value={display(product.pureCoin)} />
        <DetailItem label="封禁记录" value={display(product.banRecord)} />
        <DetailItem label="训练中心" value={display(product.trainingCenter)} />
        <DetailItem label="常用登录地" value={display(product.commonLoginArea)} />
        <DetailItem label="商品类型" value={display(product.productType)} />
        <DetailItem label="三方商品ID" value={display(product.thirdProductId)} />
      </DetailSection>

      <section className="goods-detail-section goods-detail-price-section">
        <h3>价格信息</h3>
        <div className="goods-detail-price-grid">
          <PriceCard label="成本金额 (元)" value={product.cost} />
          <PriceCard label="出租金额 (元)" value={product.rent} primary />
          <PriceCard label="卖家押金金额 (元)" value={product.sellerDeposit} />
          <PriceCard label="买家押金金额 (元)" value={product.deposit} />
        </div>
      </section>
      {previewImage && <ImagePreview src={previewImage} onClose={() => setPreviewImage('')} />}
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, wide }) {
  return <label className={`goods-admin-field ${wide ? 'is-wide' : ''}`}><span>{label}</span><input value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} /></label>;
}

function DateField({ label, start, end, onStart, onEnd }) {
  return (
    <div className="goods-admin-field goods-admin-date-field">
      <span>{label}</span>
      <input aria-label={`${label}开始`} type="date" value={start} onChange={event => onStart(event.target.value)} />
      <em>~</em>
      <input aria-label={`${label}结束`} type="date" value={end} onChange={event => onEnd(event.target.value)} />
    </div>
  );
}

function ConfirmOffline({ count, onCancel, onConfirm }) {
  return (
    <div className="goods-admin-modal-layer" role="dialog" aria-modal="true" aria-label="确认下架">
      <button className="goods-admin-modal-mask" aria-label="关闭" onClick={onCancel} />
      <div className="goods-admin-confirm">
        <div className="goods-admin-confirm-icon">!</div>
        <div><h3>确认下架商品？</h3><p>下架后商品将不再对用户展示，本次共处理 {count} 个商品。</p></div>
        <div className="goods-admin-confirm-actions"><button onClick={onCancel}>取 消</button><button className="primary" onClick={onConfirm}>确 定</button></div>
      </div>
    </div>
  );
}

function ChannelAccountModal({ account, onClose }) {
  return (
    <div className="goods-admin-modal-layer" role="dialog" aria-modal="true" aria-label="渠道账号管理">
      <button className="goods-admin-modal-mask" aria-label="关闭" onClick={onClose} />
      <div className="goods-admin-form-modal">
        <div className="goods-admin-form-header"><h3>渠道账号管理</h3><button onClick={onClose}>×</button></div>
        <div className="goods-admin-account-grid">
          <div><span>渠道名称</span><strong>{account.channelName}</strong></div>
          <div><span>账号ID</span><strong>{account.accountId}</strong></div>
          <div><span>账号名称</span><strong>{account.accountName}</strong></div>
        </div>
        <div className="goods-admin-confirm-actions"><button className="primary" onClick={onClose}>关 闭</button></div>
      </div>
    </div>
  );
}

function BackendOrderModal({ product, form, error, onChange, onCancel, onConfirm }) {
  const money = value => `¥${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <div className="goods-admin-modal-layer" role="dialog" aria-modal="true" aria-label="后台下单">
      <button className="goods-admin-modal-mask" aria-label="取消后台下单" onClick={onCancel} />
      <div className="goods-admin-form-modal goods-admin-order-modal">
        <div className="goods-admin-form-header"><h3>后台下单</h3><button onClick={onCancel}>×</button></div>
        <div className="goods-admin-order-summary">
          <label><span>商品编号</span><strong>{product.productNo}</strong></label>
          <label className="is-wide"><span>商品标题</span><strong>{product.title}</strong></label>
          <div className="goods-admin-money-row">
            <label><span>成本金额</span><strong>{money(product.cost)}</strong></label>
            <label><span>出租金额</span><strong>{money(product.rent)}</strong></label>
            <label><span>押金</span><strong>{money(product.deposit)}</strong></label>
          </div>
          <label><span><em>*</em> 下单渠道</span><select value={form.channel} disabled><option>咸鱼</option></select></label>
          <label><span><em>*</em> 渠道订单号</span><input autoFocus value={form.channelOrderNo} placeholder="请输入咸鱼渠道订单号" onChange={event => onChange(event.target.value)} onKeyDown={event => event.key === 'Enter' && onConfirm()} />{error && <small>{error}</small>}</label>
        </div>
        <div className="goods-admin-confirm-actions"><button onClick={onCancel}>取 消</button><button className="primary" onClick={onConfirm}>确 认</button></div>
      </div>
    </div>
  );
}

function BackendOrderResultModal({ result, onConfirm }) {
  const success = result.type === 'success';
  return (
    <div className="goods-admin-modal-layer" role="alertdialog" aria-modal="true" aria-label={success ? '下单成功' : '下单失败'}>
      <div className="goods-admin-modal-mask" />
      <div className="goods-admin-result-modal">
        <div className={`goods-admin-result-icon ${success ? 'is-success' : 'is-error'}`}>{success ? '✓' : '×'}</div>
        <div className="goods-admin-result-content">
          <h3>提示</h3>
          {success
            ? <p>下单成功，订单编号为 <strong>{result.orderNo}</strong>，请前往订单列表查看</p>
            : <p>下单失败，原因为：{result.reason}</p>}
        </div>
        <div className="goods-admin-confirm-actions"><button className="primary" autoFocus onClick={onConfirm}>确 认</button></div>
      </div>
    </div>
  );
}

function ImagePreview({ src, onClose }) {
  return (
    <div className="goods-admin-modal-layer goods-admin-image-preview" role="dialog" aria-modal="true" aria-label="商品图片预览">
      <button className="goods-admin-modal-mask" aria-label="关闭图片预览" onClick={onClose} />
      <button className="goods-admin-preview-close" onClick={onClose}>×</button>
      <img src={src} alt="商品大图" />
    </div>
  );
}

function DetailSection({ title, children }) {
  return <section className="goods-detail-section"><h3>{title}</h3><div className="goods-detail-grid">{children}</div></section>;
}

function DetailItem({ label, value, wide, link, success }) {
  return <div className={`goods-detail-item ${wide ? 'is-wide' : ''}`}><span>{label}:</span><strong className={`${link ? 'is-link' : ''} ${success ? 'is-success' : ''}`}>{value}</strong></div>;
}

function PriceCard({ label, value, primary }) {
  const formatted = value === null || value === undefined ? 'null' : Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <div className={`goods-detail-price-card ${primary ? 'is-primary' : ''}`}><span>{label}</span><strong>{formatted}</strong></div>;
}
