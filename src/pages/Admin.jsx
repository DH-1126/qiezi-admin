import { useState, useEffect, useRef } from 'react';

const menuItems = [
  { key: 'channel', label: '渠道管理', icon: '🔗', children: [
    { key: 'channel-config', label: '渠道配置' },
  ]},
  { key: 'dashboard', label: '数据看板', icon: '📊', children: [
    { key: 'dashboard-new', label: '新数据总览' },
    { key: 'dashboard-old', label: '数据总览' },
  ]},
  { key: 'service', label: '客服工作台', icon: '💬', children: [
    { key: 'service-record', label: '会话记录' },
  ]},
  { key: 'game', label: '游戏管理', icon: '🎮', children: [
    { key: 'game-config', label: '游戏配置' },
  ]},
  { key: 'orders', label: '订单管理', icon: '📋', children: [
    { key: 'order-list', label: '订单列表' },
    { key: 'order-pay', label: '支付流水' },
    { key: 'order-refund', label: '退款流水' },
  ]},
  { key: 'finance', label: '财务管理', icon: '💰', children: [
    { key: 'finance-account', label: '账户管理' },
    { key: 'finance-withdraw', label: '提现管理' },
  ]},
  { key: 'goods', label: '租号商品管理', icon: '📦', children: [
    { key: 'goods-audit', label: '商品审核' },
    { key: 'goods-rule', label: '租金规则' },
    { key: 'goods-manage', label: '商品管理' },
  ]},
  { key: 'operation', label: '运营管理', icon: '⚙️', children: [
    { key: 'op-app', label: '业务应用' },
    { key: 'op-ad', label: '广告位配置' },
    { key: 'op-notice', label: '系统公告' },
    { key: 'op-pay-channel', label: '支付通道总信息表' },
    { key: 'op-pay-category', label: '支付通道类别配置' },
    { key: 'op-pay-online', label: '线上支付通道配置' },
  ]},
  { key: 'users', label: '用户管理', icon: '👥', children: [
    { key: 'user-list', label: '用户列表' },
    { key: 'user-bind', label: '绑定用户列表' },
    { key: 'user-wallet', label: '用户钱包白名单' },
    { key: 'user-test-account', label: '测试账号管理' },
  ]},
  { key: 'supplier', label: '供货商菜单', icon: '🏪', children: [
    { key: 'supplier-config', label: '号商配置表' },
    { key: 'supplier-compare', label: '供货商对比' },
    { key: 'supplier-sync', label: '供货商商品同步记录' },
  ]},
  { key: 'version', label: '版本发布', icon: '🚀', children: [
    { key: 'version-app', label: 'App版本发布' },
    { key: 'version-channel', label: '发布渠道' },
  ]},
  { key: 'system', label: '系统管理', icon: '🖥️', children: [
    { key: 'sys-user', label: '用户管理' },
    { key: 'sys-role', label: '角色管理' },
    { key: 'sys-menu', label: '菜单管理' },
    { key: 'sys-dict', label: '数据字典' },
    { key: 'sys-switch', label: '系统开关' },
  ]},
];

const tabs = ['商品管理', '商品审核', '订单列表', '用户列表', '提现管理', '渠道配置', '新数据总览', '游戏配置', '商品属性配置', '游戏区服配置', '测试账号管理', '系统开关'];
const token = () => localStorage.getItem('admin_token');
const h = () => ({ 'Authorization': `Bearer ${token()}` });

// 渠道 mock 数据
const MOCK_CHANNELS = [
  { id: 20, name: 'QQ群1', code: 'wlzjyj', status: '启用' },
  { id: 19, name: '官网', code: 'official', status: '启用' },
  { id: 18, name: '分销A', code: 'fxa', status: '启用' },
  { id: 17, name: '百度搜索', code: 'bdss', status: '启用' },
  { id: 16, name: '耀扬QQ群', code: 'xosin', status: '启用' },
  { id: 15, name: 'xiaodaoB站牛杂师傅', code: 'NZ', status: '启用' },
  { id: 14, name: '耀扬渠道陈威龙', code: 'yycwl', status: '启用' },
  { id: 13, name: '快手租号', code: 'kszh', status: '启用' },
  { id: 12, name: '快手', code: 'ksa', status: '启用' },
  { id: 11, name: '小红书租号', code: 'xhszh', status: '启用' },
  { id: 10, name: '小红书', code: 'xhsa', status: '启用' },
  { id: 9, name: '咸鱼出号', code: 'xych', status: '启用' },
  { id: 8, name: '分销', code: 'qmfx', status: '启用' },
  { id: 7, name: '抖音推广收号', code: 'dysh', status: '启用' },
  { id: 6, name: '李金俱乐部', code: 'ljtg', status: '启用' },
  { id: 4, name: '闲鱼', code: 'xytg', status: '启用' },
  { id: 3, name: '抖音', code: 'dytg', status: '启用' },
  { id: 2, name: '闲鱼-镁燕', code: 'xymy', status: '启用' },
  { id: 1, name: 'xiaodaoQQ286887037', code: 'xiaodaoA', status: '启用' },
];

// 新数据总览 mock
const MOCK_DASHBOARD = [
  { statDate:'2026-07-01', channel:'ALL', pageUv:63, activeUsers:19, newRegUsers:9, totalListedGoods:184, newUserListedGoods:13, totalOrders:67, newUserOrders:5, paidUsers:18, newUserPaid:1, soldGoods:27, newUserSoldGoods:12, avgGoodsTurnover:'0d10h', platformSettlement:'1455.5', avgRentalDuration:'4d11h', userRepurchaseRate:0.96, selfGoodsCount:117, payedOrderCount:83, deliverySuccessRate:0.65, selfGoodsSoldCount:27, thirdGoodsSoldCount:0, settlementOrderCount:151, totalSettlementAmount:'783.28' },
  { statDate:'2026-06-30', channel:'ALL', pageUv:89, activeUsers:28, newRegUsers:50, totalListedGoods:188, newUserListedGoods:23, totalOrders:129, newUserOrders:11, paidUsers:40, newUserPaid:4, soldGoods:46, newUserSoldGoods:10, avgGoodsTurnover:'0d8h', platformSettlement:'643.08', avgRentalDuration:'4d10h', userRepurchaseRate:0.96, selfGoodsCount:65, payedOrderCount:73, deliverySuccessRate:0.56, selfGoodsSoldCount:43, thirdGoodsSoldCount:3, settlementOrderCount:40, totalSettlementAmount:'17445.96' },
  { statDate:'2026-06-29', channel:'ALL', pageUv:75, activeUsers:24, newRegUsers:58, totalListedGoods:265, newUserListedGoods:28, totalOrders:105, newUserOrders:10, paidUsers:40, newUserPaid:4, soldGoods:43, newUserSoldGoods:14, avgGoodsTurnover:'0d8h', platformSettlement:'753.54', avgRentalDuration:'3d13h', userRepurchaseRate:0.98, selfGoodsCount:69, payedOrderCount:59, deliverySuccessRate:0.54, selfGoodsSoldCount:41, thirdGoodsSoldCount:2, settlementOrderCount:77, totalSettlementAmount:'18796.75' },
  { statDate:'2026-06-28', channel:'ALL', pageUv:51, activeUsers:18, newRegUsers:52, totalListedGoods:218, newUserListedGoods:19, totalOrders:94, newUserOrders:10, paidUsers:38, newUserPaid:4, soldGoods:39, newUserSoldGoods:9, avgGoodsTurnover:'0d7h', platformSettlement:'808.08', avgRentalDuration:'3d16h', userRepurchaseRate:0.91, selfGoodsCount:59, payedOrderCount:70, deliverySuccessRate:0.47, selfGoodsSoldCount:38, thirdGoodsSoldCount:1, settlementOrderCount:3, totalSettlementAmount:'14972.14' },
  { statDate:'2026-06-27', channel:'ALL', pageUv:50, activeUsers:18, newRegUsers:47, totalListedGoods:228, newUserListedGoods:19, totalOrders:73, newUserOrders:11, paidUsers:29, newUserPaid:2, soldGoods:29, newUserSoldGoods:9, avgGoodsTurnover:'0d5h', platformSettlement:'579.54', avgRentalDuration:'4d2h', userRepurchaseRate:0.84, selfGoodsCount:66, payedOrderCount:52, deliverySuccessRate:0.56, selfGoodsSoldCount:29, thirdGoodsSoldCount:0, settlementOrderCount:15, totalSettlementAmount:'9629.04' },
  { statDate:'2026-06-26', channel:'ALL', pageUv:75, activeUsers:30, newRegUsers:44, totalListedGoods:325, newUserListedGoods:12, totalOrders:53, newUserOrders:9, paidUsers:28, newUserPaid:5, soldGoods:28, newUserSoldGoods:6, avgGoodsTurnover:'0d21h', platformSettlement:'785.59', avgRentalDuration:'8d20h', userRepurchaseRate:0.83, selfGoodsCount:40, payedOrderCount:34, deliverySuccessRate:0.76, selfGoodsSoldCount:26, thirdGoodsSoldCount:2, settlementOrderCount:38, totalSettlementAmount:'15921.66' },
  { statDate:'2026-06-25', channel:'ALL', pageUv:62, activeUsers:25, newRegUsers:46, totalListedGoods:85, newUserListedGoods:11, totalOrders:89, newUserOrders:18, paidUsers:25, newUserPaid:3, soldGoods:28, newUserSoldGoods:6, avgGoodsTurnover:'1d19h', platformSettlement:'1503.45', avgRentalDuration:'3d13h', userRepurchaseRate:0.86, selfGoodsCount:21, payedOrderCount:42, deliverySuccessRate:0.5, selfGoodsSoldCount:27, thirdGoodsSoldCount:1, settlementOrderCount:62, totalSettlementAmount:'11430.27' },
  { statDate:'2026-06-24', channel:'ALL', pageUv:69, activeUsers:32, newRegUsers:43, totalListedGoods:318, newUserListedGoods:19, totalOrders:127, newUserOrders:24, paidUsers:29, newUserPaid:6, soldGoods:31, newUserSoldGoods:11, avgGoodsTurnover:'0d15h', platformSettlement:'904.23', avgRentalDuration:'5d1h', userRepurchaseRate:0.8, selfGoodsCount:46, payedOrderCount:80, deliverySuccessRate:0.36, selfGoodsSoldCount:29, thirdGoodsSoldCount:2, settlementOrderCount:72, totalSettlementAmount:'11307.63' },
  { statDate:'2026-06-23', channel:'ALL', pageUv:82, activeUsers:34, newRegUsers:45, totalListedGoods:740, newUserListedGoods:16, totalOrders:112, newUserOrders:17, paidUsers:47, newUserPaid:4, soldGoods:51, newUserSoldGoods:10, avgGoodsTurnover:'1d16h', platformSettlement:'1210.37', avgRentalDuration:'4d19h', userRepurchaseRate:0.97, selfGoodsCount:47, payedOrderCount:80, deliverySuccessRate:0.56, selfGoodsSoldCount:47, thirdGoodsSoldCount:4, settlementOrderCount:57, totalSettlementAmount:'21315.95' },
  { statDate:'2026-06-22', channel:'ALL', pageUv:91, activeUsers:40, newRegUsers:62, totalListedGoods:841, newUserListedGoods:18, totalOrders:138, newUserOrders:18, paidUsers:55, newUserPaid:6, soldGoods:58, newUserSoldGoods:17, avgGoodsTurnover:'1d0h', platformSettlement:'1203.39', avgRentalDuration:'4d9h', userRepurchaseRate:1.03, selfGoodsCount:63, payedOrderCount:93, deliverySuccessRate:0.57, selfGoodsSoldCount:55, thirdGoodsSoldCount:3, settlementOrderCount:128, totalSettlementAmount:'25178.08' },
  { statDate:'2026-06-21', channel:'ALL', pageUv:47, activeUsers:20, newRegUsers:47, totalListedGoods:579, newUserListedGoods:24, totalOrders:111, newUserOrders:17, paidUsers:50, newUserPaid:9, soldGoods:55, newUserSoldGoods:18, avgGoodsTurnover:'0d5h', platformSettlement:'1649.75', avgRentalDuration:'4d0h', userRepurchaseRate:0.92, selfGoodsCount:63, payedOrderCount:83, deliverySuccessRate:0.61, selfGoodsSoldCount:51, thirdGoodsSoldCount:4, settlementOrderCount:1, totalSettlementAmount:'21305.45' },
  { statDate:'2026-06-20', channel:'ALL', pageUv:75, activeUsers:35, newRegUsers:69, totalListedGoods:1372, newUserListedGoods:27, totalOrders:110, newUserOrders:33, paidUsers:56, newUserPaid:12, soldGoods:61, newUserSoldGoods:17, avgGoodsTurnover:'0d9h', platformSettlement:'1343.53', avgRentalDuration:'3d14h', userRepurchaseRate:0.89, selfGoodsCount:69, payedOrderCount:82, deliverySuccessRate:0.67, selfGoodsSoldCount:51, thirdGoodsSoldCount:10, settlementOrderCount:53, totalSettlementAmount:'25485.4' },
  { statDate:'2026-06-19', channel:'ALL', pageUv:71, activeUsers:34, newRegUsers:52, totalListedGoods:1548, newUserListedGoods:21, totalOrders:159, newUserOrders:24, paidUsers:50, newUserPaid:5, soldGoods:55, newUserSoldGoods:13, avgGoodsTurnover:'0d7h', platformSettlement:'887.98', avgRentalDuration:'2d22h', userRepurchaseRate:0.86, selfGoodsCount:68, payedOrderCount:99, deliverySuccessRate:0.48, selfGoodsSoldCount:51, thirdGoodsSoldCount:4, settlementOrderCount:56, totalSettlementAmount:'24120.65' },
  { statDate:'2026-06-18', channel:'ALL', pageUv:79, activeUsers:37, newRegUsers:59, totalListedGoods:2376, newUserListedGoods:17, totalOrders:176, newUserOrders:28, paidUsers:65, newUserPaid:10, soldGoods:70, newUserSoldGoods:9, avgGoodsTurnover:'0d23h', platformSettlement:'1326.65', avgRentalDuration:'4d6h', userRepurchaseRate:0.91, selfGoodsCount:56, payedOrderCount:123, deliverySuccessRate:0.53, selfGoodsSoldCount:60, thirdGoodsSoldCount:10, settlementOrderCount:49, totalSettlementAmount:'30049.93' },
  { statDate:'2026-06-17', channel:'ALL', pageUv:83, activeUsers:40, newRegUsers:66, totalListedGoods:6465, newUserListedGoods:37, totalOrders:153, newUserOrders:19, paidUsers:58, newUserPaid:4, soldGoods:65, newUserSoldGoods:21, avgGoodsTurnover:'0d8h', platformSettlement:'876.06', avgRentalDuration:'3d5h', userRepurchaseRate:0.95, selfGoodsCount:116, payedOrderCount:91, deliverySuccessRate:0.7, selfGoodsSoldCount:61, thirdGoodsSoldCount:4, settlementOrderCount:57, totalSettlementAmount:'27689.62' },
  { statDate:'2026-06-16', channel:'ALL', pageUv:69, activeUsers:30, newRegUsers:71, totalListedGoods:432, newUserListedGoods:34, totalOrders:119, newUserOrders:16, paidUsers:40, newUserPaid:6, soldGoods:40, newUserSoldGoods:8, avgGoodsTurnover:'0d10h', platformSettlement:'989.59', avgRentalDuration:'2d17h', userRepurchaseRate:0.87, selfGoodsCount:94, payedOrderCount:77, deliverySuccessRate:0.51, selfGoodsSoldCount:37, thirdGoodsSoldCount:3, settlementOrderCount:69, totalSettlementAmount:'16437.87' },
  { statDate:'2026-06-15', channel:'ALL', pageUv:83, activeUsers:40, newRegUsers:112, totalListedGoods:1935, newUserListedGoods:62, totalOrders:140, newUserOrders:23, paidUsers:60, newUserPaid:10, soldGoods:64, newUserSoldGoods:16, avgGoodsTurnover:'0d12h', platformSettlement:'1050.06', avgRentalDuration:'3d18h', userRepurchaseRate:0.86, selfGoodsCount:124, payedOrderCount:95, deliverySuccessRate:0.57, selfGoodsSoldCount:63, thirdGoodsSoldCount:1, settlementOrderCount:123, totalSettlementAmount:'19329.33' },
  { statDate:'2026-06-14', channel:'ALL', pageUv:75, activeUsers:29, newRegUsers:130, totalListedGoods:909, newUserListedGoods:59, totalOrders:134, newUserOrders:26, paidUsers:50, newUserPaid:6, soldGoods:53, newUserSoldGoods:18, avgGoodsTurnover:'0d15h', platformSettlement:'1133.89', avgRentalDuration:'3d0h', userRepurchaseRate:1.01, selfGoodsCount:104, payedOrderCount:90, deliverySuccessRate:0.54, selfGoodsSoldCount:51, thirdGoodsSoldCount:2, settlementOrderCount:0, totalSettlementAmount:'21380.82' },
  { statDate:'2026-06-13', channel:'ALL', pageUv:65, activeUsers:25, newRegUsers:114, totalListedGoods:6934, newUserListedGoods:71, totalOrders:163, newUserOrders:38, paidUsers:62, newUserPaid:13, soldGoods:75, newUserSoldGoods:24, avgGoodsTurnover:'0d10h', platformSettlement:'1144.96', avgRentalDuration:'3d9h', userRepurchaseRate:0.99, selfGoodsCount:141, payedOrderCount:95, deliverySuccessRate:0.66, selfGoodsSoldCount:73, thirdGoodsSoldCount:2, settlementOrderCount:53, totalSettlementAmount:'27403.18' },
  { statDate:'2026-06-12', channel:'ALL', pageUv:104, activeUsers:47, newRegUsers:115, totalListedGoods:14385, newUserListedGoods:55, totalOrders:125, newUserOrders:24, paidUsers:50, newUserPaid:10, soldGoods:52, newUserSoldGoods:19, avgGoodsTurnover:'0d11h', platformSettlement:'1075.83', avgRentalDuration:'3d19h', userRepurchaseRate:0.98, selfGoodsCount:104, payedOrderCount:83, deliverySuccessRate:0.54, selfGoodsSoldCount:50, thirdGoodsSoldCount:2, settlementOrderCount:58, totalSettlementAmount:'20068.06' },
  { statDate:'2026-06-11', channel:'ALL', pageUv:116, activeUsers:43, newRegUsers:76, totalListedGoods:14125, newUserListedGoods:37, totalOrders:105, newUserOrders:14, paidUsers:52, newUserPaid:10, soldGoods:58, newUserSoldGoods:16, avgGoodsTurnover:'0d14h', platformSettlement:'1255.28', avgRentalDuration:'4d3h', userRepurchaseRate:1.07, selfGoodsCount:94, payedOrderCount:74, deliverySuccessRate:0.64, selfGoodsSoldCount:52, thirdGoodsSoldCount:6, settlementOrderCount:71, totalSettlementAmount:'25503.83' },
  { statDate:'2026-06-10', channel:'ALL', pageUv:93, activeUsers:41, newRegUsers:77, totalListedGoods:13715, newUserListedGoods:59, totalOrders:151, newUserOrders:29, paidUsers:57, newUserPaid:12, soldGoods:58, newUserSoldGoods:21, avgGoodsTurnover:'0d9h', platformSettlement:'1361.86', avgRentalDuration:'4d3h', userRepurchaseRate:1.01, selfGoodsCount:122, payedOrderCount:108, deliverySuccessRate:0.47, selfGoodsSoldCount:57, thirdGoodsSoldCount:1, settlementOrderCount:49, totalSettlementAmount:'23221.23' },
  { statDate:'2026-06-09', channel:'ALL', pageUv:84, activeUsers:34, newRegUsers:72, totalListedGoods:14920, newUserListedGoods:48, totalOrders:138, newUserOrders:35, paidUsers:67, newUserPaid:12, soldGoods:72, newUserSoldGoods:22, avgGoodsTurnover:'0d9h', platformSettlement:'2249.39', avgRentalDuration:'13d13h', userRepurchaseRate:1.08, selfGoodsCount:119, payedOrderCount:94, deliverySuccessRate:0.64, selfGoodsSoldCount:63, thirdGoodsSoldCount:9, settlementOrderCount:79, totalSettlementAmount:'31553.45' },
  { statDate:'2026-06-08', channel:'ALL', pageUv:92, activeUsers:39, newRegUsers:95, totalListedGoods:15956, newUserListedGoods:66, totalOrders:127, newUserOrders:21, paidUsers:46, newUserPaid:10, soldGoods:50, newUserSoldGoods:20, avgGoodsTurnover:'0d10h', platformSettlement:'1195.24', avgRentalDuration:'4d21h', userRepurchaseRate:1.06, selfGoodsCount:133, payedOrderCount:87, deliverySuccessRate:0.53, selfGoodsSoldCount:48, thirdGoodsSoldCount:2, settlementOrderCount:136, totalSettlementAmount:'21512.74' },
  { statDate:'2026-06-07', channel:'ALL', pageUv:75, activeUsers:36, newRegUsers:90, totalListedGoods:17203, newUserListedGoods:67, totalOrders:111, newUserOrders:19, paidUsers:48, newUserPaid:5, soldGoods:51, newUserSoldGoods:17, avgGoodsTurnover:'0d9h', platformSettlement:'1306.1', avgRentalDuration:'4d9h', userRepurchaseRate:1.05, selfGoodsCount:122, payedOrderCount:74, deliverySuccessRate:0.61, selfGoodsSoldCount:48, thirdGoodsSoldCount:3, settlementOrderCount:0, totalSettlementAmount:'20044.4' },
  { statDate:'2026-06-06', channel:'ALL', pageUv:91, activeUsers:43, newRegUsers:65, totalListedGoods:14711, newUserListedGoods:42, totalOrders:140, newUserOrders:33, paidUsers:52, newUserPaid:6, soldGoods:53, newUserSoldGoods:16, avgGoodsTurnover:'0d10h', platformSettlement:'1085.94', avgRentalDuration:'4d17h', userRepurchaseRate:1.02, selfGoodsCount:92, payedOrderCount:95, deliverySuccessRate:0.55, selfGoodsSoldCount:47, thirdGoodsSoldCount:6, settlementOrderCount:29, totalSettlementAmount:'21393.57' },
  { statDate:'2026-06-05', channel:'ALL', pageUv:94, activeUsers:44, newRegUsers:97, totalListedGoods:18276, newUserListedGoods:73, totalOrders:152, newUserOrders:61, paidUsers:59, newUserPaid:16, soldGoods:61, newUserSoldGoods:25, avgGoodsTurnover:'0d18h', platformSettlement:'1147.84', avgRentalDuration:'3d23h', userRepurchaseRate:0.94, selfGoodsCount:123, payedOrderCount:99, deliverySuccessRate:0.49, selfGoodsSoldCount:56, thirdGoodsSoldCount:5, settlementOrderCount:48, totalSettlementAmount:'25475.65' },
  { statDate:'2026-06-04', channel:'ALL', pageUv:83, activeUsers:41, newRegUsers:66, totalListedGoods:15918, newUserListedGoods:59, totalOrders:124, newUserOrders:26, paidUsers:42, newUserPaid:7, soldGoods:44, newUserSoldGoods:15, avgGoodsTurnover:'0d13h', platformSettlement:'820.12', avgRentalDuration:'3d20h', userRepurchaseRate:1.11, selfGoodsCount:109, payedOrderCount:91, deliverySuccessRate:0.46, selfGoodsSoldCount:42, thirdGoodsSoldCount:2, settlementOrderCount:45, totalSettlementAmount:'17100.73' },
  { statDate:'2026-06-03', channel:'ALL', pageUv:89, activeUsers:39, newRegUsers:78, totalListedGoods:14661, newUserListedGoods:60, totalOrders:149, newUserOrders:31, paidUsers:65, newUserPaid:13, soldGoods:69, newUserSoldGoods:17, avgGoodsTurnover:'0d10h', platformSettlement:'1008.33', avgRentalDuration:'3d14h', userRepurchaseRate:1.04, selfGoodsCount:130, payedOrderCount:110, deliverySuccessRate:0.52, selfGoodsSoldCount:64, thirdGoodsSoldCount:5, settlementOrderCount:65, totalSettlementAmount:'33774.15' },
  { statDate:'2026-06-02', channel:'ALL', pageUv:91, activeUsers:45, newRegUsers:75, totalListedGoods:16302, newUserListedGoods:49, totalOrders:152, newUserOrders:25, paidUsers:46, newUserPaid:5, soldGoods:47, newUserSoldGoods:13, avgGoodsTurnover:'0d9h', platformSettlement:'1205.67', avgRentalDuration:'3d12h', userRepurchaseRate:1.12, selfGoodsCount:111, payedOrderCount:108, deliverySuccessRate:0.42, selfGoodsSoldCount:40, thirdGoodsSoldCount:7, settlementOrderCount:43, totalSettlementAmount:'20841.74' },
  { statDate:'2026-06-01', channel:'ALL', pageUv:78, activeUsers:37, newRegUsers:93, totalListedGoods:18913, newUserListedGoods:70, totalOrders:94, newUserOrders:10, paidUsers:37, newUserPaid:6, soldGoods:41, newUserSoldGoods:16, avgGoodsTurnover:'0d7h', platformSettlement:'1006.4', avgRentalDuration:'4d13h', userRepurchaseRate:0.96, selfGoodsCount:126, payedOrderCount:68, deliverySuccessRate:0.59, selfGoodsSoldCount:37, thirdGoodsSoldCount:4, settlementOrderCount:122, totalSettlementAmount:'17685.91' },
];

// 游戏配置 mock（三角洲一个游戏数据全，外加其他游戏列表）
const MOCK_GAMES = [
  { id:1, name:'三角洲', sort:1, type:'端游', icon:'🎯', recycle:'否', enable:'是', hot:'是', creator:'17688930790', createTime:'2025-09-30 14:39:25' },
  { id:2, name:'球球大作战', sort:80, type:'手游', icon:'🟢', recycle:'是', enable:'是', hot:'否', creator:'admin', createTime:'2023-03-06 15:05:51' },
  { id:3, name:'逆战', sort:79, type:'端游', icon:'🔫', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:4, name:'天涯明月刀', sort:80, type:'端游', icon:'⚔️', recycle:'是', enable:'是', hot:'否', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:5, name:'LOL手游', sort:120, type:'手游', icon:'🏆', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:6, name:'金铲铲之战', sort:101, type:'手游', icon:'👑', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:7, name:'蛋仔派对', sort:83, type:'手游', icon:'🥚', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:8, name:'香肠派对', sort:84, type:'手游', icon:'🌭', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:9, name:'QQ飞车手游', sort:85, type:'手游', icon:'🏎️', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
  { id:10, name:'第五人格', sort:86, type:'手游', icon:'🎭', recycle:'是', enable:'是', hot:'是', creator:'ADMIN', createTime:'2023-02-28 17:54:43' },
];

// 商品属性配置 mock（三角洲游戏33条属性，页1展示10条）
const MOCK_GAME_ATTRS = [
  { id:1, groupId:1, game:'三角洲', name:'巴雷特(自行协商)', type:'基础属性', inputType:'输入类型', multi:'否', required:'否', sort:1, creator:'18942914433', createTime:'2026-06-02 11:21:50' },
  { id:2, groupId:1, game:'三角洲', name:'3*3体验卡(建议赠送)', type:'基础属性', inputType:'输入类型', multi:'否', required:'否', sort:2, creator:'18942914433', createTime:'2026-06-02 11:21:32' },
  { id:3, groupId:1, game:'三角洲', name:'红弹', type:'基础属性', inputType:'输入类型', multi:'否', required:'否', sort:3, creator:'18942914433', createTime:'2026-06-02 11:21:17' },
  { id:4, groupId:1, game:'三角洲', name:'六甲', type:'基础属性', inputType:'输入类型', multi:'否', required:'否', sort:4, creator:'18942914433', createTime:'2026-06-02 11:21:00' },
  { id:5, groupId:1, game:'三角洲', name:'六头', type:'基础属性', inputType:'输入类型', multi:'否', required:'否', sort:5, creator:'18942914433', createTime:'2026-06-02 11:20:45' },
  { id:6, groupId:2, game:'三角洲', name:'额外道具付费设置', type:'非游戏属性', inputType:'选择类型', multi:'否', required:'否', sort:1, creator:'18942914433', createTime:'2026-06-02 11:20:21' },
  { id:7, groupId:3, game:'三角洲', name:'绝密KD', type:'高级属性', inputType:'输入类型', multi:'否', required:'否', sort:1, creator:'18942914433', createTime:'2026-06-02 11:19:44' },
  { id:8, groupId:3, game:'三角洲', name:'持有枪皮(多选)', type:'高级属性', inputType:'选择类型', multi:'是', required:'否', sort:2, creator:'18942914433', createTime:'2026-06-02 11:19:17' },
  { id:9, groupId:2, game:'三角洲', name:'号主赠送', type:'非游戏属性', inputType:'输入类型', multi:'否', required:'否', sort:2, creator:'18942914433', createTime:'2026-06-02 11:17:41' },
  { id:10, groupId:2, game:'三角洲', name:'押金(元)', type:'非游戏属性', inputType:'输入类型', multi:'否', required:'否', sort:3, creator:'18942914433', createTime:'2026-04-14 10:20:56' },
];

// 属性分组 mock
const MOCK_ATTR_GROUPS = [
  { id:1, name:'基础属性', sort:1, creator:'18942914433', createTime:'2026-04-14 10:19:53' },
  { id:2, name:'非游戏属性', sort:2, creator:'18942914433', createTime:'2026-04-14 10:20:02' },
  { id:3, name:'高级属性', sort:3, creator:'18942914433', createTime:'2026-04-14 10:20:34' },
];

// 游戏区服配置 mock（仅三角洲PC区服1条）
const MOCK_GAME_SERVERS = [
  { id:1, name:'PC', sort:1, creator:'admin', createTime:'2023-04-10 13:35:58' },
];

// 游戏标题配置 mock（三角洲12条标题项）
const MOCK_GAME_TITLES = [
  '总资产：# M', '纯币资产：# M', '角色：#', '区服：#', '账密：#', '段位：#',
  '安全箱：#', 'awm子弹：#', '靶场等级：#', '账号等级：#', '训练中心：#', '刀皮：#',
];

// 订单列表 mock
const MOCK_ORDERS = [
  { orderNo:'2026070262214', thirdPayNo:'', productId:'183733072231', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:QQ  总资产：519 M 纯币资产：200 M  角色：不破誓约 荒原猎手 电锯惊魂 金牌射手 黑/天际线 未结卷宗 无题密令 账密：扫码登录 段位：铂金 安全箱：2x3 靶场等级：7级 账号等级：60 训练中心：7级 刀皮：信条 处刑者 怜悯', phone:'15523913292', upChannel:'official', reportChannel:'ljtg', belongChannel:'ljtg', server:'扫码登录|QQ', status:'待支付', settleMode:'租期内打完', cost:465.12, rent:511.64, deposit:800, pay:1311.64, fee:46.52, buyerPay:1311.64, payMethod:'支付宝H5支付', payChannel:'(206)茄子代售-原生支付宝2-app和H5', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:58:10', updateTime:'2026-07-02 13:58:10', operator:'王永祁' },
  { orderNo:'2026070264076', thirdPayNo:'', productId:'720783071624', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:QQ  总资产：371 M 纯币资产：201 M  角色：不破誓约 荒原猎手 电锯惊魂 黑/天际线 未结卷宗 无题密令 账密：账密登录 段位：钻石 安全箱：2x2 靶场等级：7级 账号等级：60 训练中心：7级 刀皮：坠星者 处刑者', phone:'15523409232', upChannel:'xhsa', reportChannel:'xytg', belongChannel:'xytg', server:'账密登录|QQ', status:'待支付', settleMode:'租期内打完', cost:427.66, rent:470.43, deposit:500, pay:970.43, fee:42.77, buyerPay:970.43, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:57:08', updateTime:'2026-07-02 13:57:08', operator:'顾修鸣' },
  { orderNo:'2026070264075', thirdPayNo:'4200003200202607024858227768', productId:'935973072228', thirdProductId:'', shipTime:'2026-07-02 15:45:00', type:'自建商品', title:'登录区服:QQ  总资产：292.4 M 纯币资产：125.1 M  账密：账密登录 段位：青铜 安全箱：2x2 靶场等级：6级 账号等级：60 训练中心：7级 刀皮：坠星者', phone:'13480628391', upChannel:'xhsa', reportChannel:'xytg', belongChannel:'xytg', server:'账密登录|QQ', status:'待发货', settleMode:'租期内打完', cost:260.63, rent:286.7, deposit:200, pay:486.7, fee:26.07, buyerPay:486.7, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:49:26', updateTime:'2026-07-02 13:49:40', operator:'system' },
  { orderNo:'2026070262210', thirdPayNo:'4200003194202607022100585865', productId:'706383071632', thirdProductId:'', shipTime:'2026-07-02 14:05:00', type:'自建商品', title:'登录区服:QQ  总资产：73 M 纯币资产：50 M  账密：扫码登录 段位：无段位 安全箱：2x2 靶场等级：5级 账号等级：60 训练中心：6级', phone:'13322246730', upChannel:'official', reportChannel:'xytg', belongChannel:'xytg', server:'扫码登录|QQ', status:'租用中', settleMode:'租期内打完', cost:100, rent:110, deposit:100, pay:210, fee:10, buyerPay:210, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:22:34', updateTime:'2026-07-02 13:23:02', operator:'system' },
  { orderNo:'2026070264074', thirdPayNo:'4200003126202607025516179990', productId:'969663071617', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:QQ  总资产：20 M 纯币资产：20 M  角色：不破誓约 电锯惊魂 金牌射手 无题密令 未结卷宗 账密：扫码登录 段位：铂金 安全箱：2x2 靶场等级：4级 账号等级：60 训练中心：6级', phone:'13306730187', upChannel:'official', reportChannel:'official', belongChannel:'official', server:'扫码登录|QQ', status:'已取消', settleMode:'租期内打完', cost:41.67, rent:45.84, deposit:100, pay:145.84, fee:4.17, buyerPay:145.84, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:11:42', updateTime:'2026-07-02 13:19:13', operator:'system' },
  { orderNo:'2026070264073', thirdPayNo:'', productId:'922603072224', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:QQ  总资产：265 M 纯币资产：141 M  角色：黑/天际线 账密：账密登录 段位：铂金 安全箱：3x3 靶场等级：7级 账号等级：60 训练中心：7级 刀皮：信条', phone:'19583680107', upChannel:'xhsa', reportChannel:'xytg', belongChannel:'xytg', server:'账密登录|QQ', status:'已超时', settleMode:'租期内打完', cost:352.5, rent:387.75, deposit:400, pay:787.75, fee:35.25, buyerPay:787.75, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:11:10', updateTime:'2026-07-02 13:45:00', operator:'system' },
  { orderNo:'2026070262204', thirdPayNo:'4200003205202607020925909697', productId:'903833072232', thirdProductId:'', shipTime:'2026-07-02 15:20:00', type:'自建商品', title:'登录区服:QQ  总资产：50 M 纯币资产：45 M  账密：扫码登录 段位：铂金 安全箱：2x2 靶场等级：4级 账号等级：60 训练中心：4级 刀皮：龙牙', phone:'13874237458', upChannel:'xhsa', reportChannel:'xytg', belongChannel:'xytg', server:'扫码登录|QQ', status:'租用中', settleMode:'租期内打完', cost:91.84, rent:101.03, deposit:200, pay:301.03, fee:9.19, buyerPay:301.03, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:08:44', updateTime:'2026-07-02 13:10:05', operator:'system' },
  { orderNo:'2026070262202', thirdPayNo:'4200003194202607029546792620', productId:'829223071627', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:微信  总资产：74.5 M 纯币资产：68.1 M  角色：电锯惊魂 账密：扫码登录 段位：钻石 安全箱：2x2 靶场等级：4级 账号等级：60 训练中心：4级 刀皮：处刑者', phone:'13874237458', upChannel:'ksa', reportChannel:'xytg', belongChannel:'xytg', server:'扫码登录|微信', status:'已取消', settleMode:'租期内打完', cost:138.98, rent:152.88, deposit:200, pay:352.88, fee:13.9, buyerPay:352.88, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 13:02:36', updateTime:'2026-07-02 13:09:53', operator:'system' },
  { orderNo:'2026070262201', thirdPayNo:'4200003132202607023068973998', productId:'238563071631', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:微信  总资产：59 M 纯币资产：21 M  角色：未结卷宗 账密：扫码登录 段位：黄金 安全箱：2x2 靶场等级：6级 账号等级：60 训练中心：7级 刀皮：坠星者', phone:'13874237458', upChannel:'official', reportChannel:'xytg', belongChannel:'xytg', server:'扫码登录|微信', status:'已取消', settleMode:'租期内打完', cost:46.67, rent:51.34, deposit:200, pay:251.34, fee:4.67, buyerPay:251.34, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 12:51:21', updateTime:'2026-07-02 12:59:56', operator:'system' },
  { orderNo:'2026070262200', thirdPayNo:'4200003127202607025799922307', productId:'969663071617', thirdProductId:'', shipTime:'', type:'自建商品', title:'登录区服:QQ  总资产：20 M 纯币资产：20 M  角色：不破誓约 电锯惊魂 金牌射手 无题密令 未结卷宗 账密：扫码登录 段位：铂金 安全箱：2x2 靶场等级：4级 账号等级：60 训练中心：6级', phone:'13874237458', upChannel:'official', reportChannel:'xytg', belongChannel:'xytg', server:'扫码登录|QQ', status:'已取消', settleMode:'租期内打完', cost:41.67, rent:45.84, deposit:100, pay:145.84, fee:4.17, buyerPay:145.84, payMethod:'微信JSAPI支付', payChannel:'(207)茄子代售-微信原生支付-公众号模式', buyerRefund:'', sellerSettle:'', createTime:'2026-07-02 12:48:10', updateTime:'2026-07-02 12:51:06', operator:'system' },
];

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeMenu, setActiveMenu] = useState('goods-manage');
  const [expandedMenu, setExpandedMenu] = useState('goods');
  const [activeTab, setActiveTab] = useState('商品管理');
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState({ list: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // 渠道配置 state
  const [channels, setChannels] = useState(MOCK_CHANNELS);
  const [channelFilters, setChannelFilters] = useState({ name: '', code: '' });
  const [selectedChannels, setSelectedChannels] = useState(new Set());
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [channelForm, setChannelForm] = useState({ name: '', code: '', status: '1' });

  // 游戏管理 state
  const [gameFilters, setGameFilters] = useState({ name: '', type: '', enable: '', hot: '', recycle: '' });
  const [games, setGames] = useState(MOCK_GAMES);
  const [showGameMore, setShowGameMore] = useState(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameForm, setGameForm] = useState({ name: '', sort: '', type: '端游', enable: '是', hot: '否', recycle: '否' });
  const [editingGameId, setEditingGameId] = useState(null);
  const [gameAttrFilters, setGameAttrFilters] = useState({ keyword: '' });
  const [gameServerFilters, setGameServerFilters] = useState({ name: '' });
  // 游戏标题配置弹窗
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [gameTitles, setGameTitles] = useState([...MOCK_GAME_TITLES]);
  const [titleForm, setTitleForm] = useState({ template: '', attribute: '' });
  // 区服弹窗
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverForm, setServerForm] = useState({ name: '', sort: '' });
  const [editingServerId, setEditingServerId] = useState(null);
  const [servers, setServers] = useState(MOCK_GAME_SERVERS);
  // 属性弹窗
  const [showAttrModal, setShowAttrModal] = useState(false);
  const [attrForm, setAttrForm] = useState({ name: '', sort: '1', type: '基础属性', inputType: '勾选类型', inputControl: '单选', inputStyle: '下拉菜单', required: '否', filterControl: '单选', recycle: '是', dict: '', remark: '' });
  const [editingAttrId, setEditingAttrId] = useState(null);
  const [attrs, setAttrs] = useState(MOCK_GAME_ATTRS);
  // 排序弹窗
  const [showSortModal, setShowSortModal] = useState(false);
  // 排序规则（完整数据结构，含分组和属性）
  const [sortRules, setSortRules] = useState([
    { id:1, name:'出哈夫币页', code:'hfb_release', status:'启用', createTime:'2026-06-02 10:35:32', updateTime:'2026-06-04 15:34:49',
      groups: [
        { id:1, name:'账号信息', sort:1, attrs:[
          { name:'登录方式', required:'是' }, { name:'账号等级', required:'是' }, { name:'段位', required:'否' },
          { name:'绝密KD', required:'否' }, { name:'封禁记录', required:'是' }, { name:'常用登录地', required:'否' },
          { name:'人脸是否本人', required:'是' },
        ]},
        { id:2, name:'账号资产', sort:2, attrs:[
          { name:'仓库总资产(M)', required:'是' },
        ]},
      ]
    },
  ]);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [showSortRuleModal, setShowSortRuleModal] = useState(false);
  const [sortRuleForm, setSortRuleForm] = useState({ name:'', code:'', status:'启用' });
  // 订单筛选
  const [orderFilters, setOrderFilters] = useState({ timeRange:'', payStatus:'', payPlatform:'', orderNo:'', buyerId:'', buyerPhone:'', sellerId:'', sellerPhone:'', title:'', productId:'', channelCode:'', thirdPayNo:'', thirdProductId:'', productType:'', shipTime:'', shipTimeEnd:'' });
  const [userFilters, setUserFilters] = useState({ keyword:'', status:'', regStart:'', regEnd:'' });
  const [orderTab, setOrderTab] = useState('全部');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  // 分组
  const [attrGroups, setAttrGroups] = useState(MOCK_ATTR_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [groupForm, setGroupForm] = useState({ name: '', sort: '' });
  const [showRuleFormModal, setShowRuleFormModal] = useState(false);
  const [ruleFormMode, setRuleFormMode] = useState('add');

  // 筛选
  const [filters, setFilters] = useState({
    productType: '全部商品', status: '全部商品', userId: '', phone: '', title: '', productNo: '', thirdId: '',
    onlineStart: '', onlineEnd: '', offlineStart: '', offlineEnd: ''
  });

  // 测试账号管理
  const [testAccounts, setTestAccounts] = useState([
    { id:100001, phone:'13704332181', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test1', realName:'已实名', alipay:'已验证', status:'启用', regTime:'2026-06-01 10:30:00', expireStart:'2026-06-01 10:30:00', expireEnd:'2026-06-08 10:30:00', cancelTime:'', cancelProof:'未上传' },
    { id:100002, phone:'18960013389', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test2', realName:'未实名', alipay:'未验证', status:'启用', regTime:'2026-06-15 14:20:00', expireStart:'2026-06-15 14:20:00', expireEnd:'2026-09-20 14:20:00', cancelTime:'', cancelProof:'未上传' },
    { id:100003, phone:'13183863794', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test3', realName:'已实名', alipay:'已验证', status:'禁用', regTime:'2026-05-20 09:00:00', expireStart:'2026-05-20 09:00:00', expireEnd:'2026-06-25 09:00:00', cancelTime:'', cancelProof:'未上传' },
    { id:100004, phone:'13026542351', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test4', realName:'已实名', alipay:'已验证', status:'启用', regTime:'2026-07-01 16:45:00', expireStart:'2026-07-01 16:45:00', expireEnd:'', cancelTime:'', cancelProof:'未上传' },
    { id:100005, phone:'13561559407', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test5', realName:'未实名', alipay:'已验证', status:'已注销', regTime:'2026-04-10 11:30:00', expireStart:'2026-04-10 11:30:00', expireEnd:'2026-04-20 11:30:00', cancelTime:'2026-07-05 08:00:00', cancelProof:'已上传' },
    { id:100006, phone:'18616184959', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test6', realName:'已实名', alipay:'未验证', status:'启用', regTime:'2026-07-08 09:15:00', expireStart:'2026-07-08 09:15:00', expireEnd:'2026-09-10 09:15:00', cancelTime:'', cancelProof:'未上传' },
    { id:100007, phone:'15210341316', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test7', realName:'已实名', alipay:'已验证', status:'禁用', regTime:'2026-07-12 14:30:00', expireStart:'2026-07-12 14:30:00', expireEnd:'2026-07-01 14:30:00', cancelTime:'', cancelProof:'未上传' },
    { id:100008, phone:'15875255341', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=test8', realName:'未实名', alipay:'未验证', status:'启用', regTime:'2026-07-13 09:00:00', expireStart:'2026-07-13 09:00:00', expireEnd:'', cancelTime:'', cancelProof:'未上传' },
  ]);
  const [testAccFilters, setTestAccFilters] = useState({ userId: '', phone: '', status: '', timeStart: '', timeEnd: '' });
  const [showTestAccModal, setShowTestAccModal] = useState(false);
  const [testAccForm, setTestAccForm] = useState({ validDays: '7', status: '禁用' });
  const testAccIdCounter = useRef(100008);
  const getRandomAvatar = () => `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).slice(2)}`;
  const genUserId = () => { testAccIdCounter.current += 1; return testAccIdCounter.current; };
  // 生成不重复的随机手机号
  const genPhone = () => {
    const prefixes = ['130','131','132','133','134','135','136','137','138','139','150','151','152','153','155','156','157','158','159','170','171','176','177','178','180','181','182','183','184','185','186','187','188','189'];
    const used = testAccounts.map(a => a.phone);
    let p;
    do { p = prefixes[Math.floor(Math.random()*prefixes.length)] + String(Math.floor(Math.random()*100000000)).padStart(8,'0'); } while (used.includes(p));
    return p;
  };

  const handleTestAccAdd = () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const regTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const expireEnd = testAccForm.validDays === '永久' ? null : new Date(now.getTime() + parseInt(testAccForm.validDays) * 86400000);
    const expireEndStr = expireEnd ? `${expireEnd.getFullYear()}-${pad(expireEnd.getMonth()+1)}-${pad(expireEnd.getDate())} ${pad(expireEnd.getHours())}:${pad(expireEnd.getMinutes())}:${pad(expireEnd.getSeconds())}` : '';
    const newAcc = {
      id: genUserId(),
      phone: genPhone(),
      avatar: getRandomAvatar(),
      realName: Math.random() > 0.5 ? '已实名' : '未实名',
      alipay: Math.random() > 0.5 ? '已验证' : '未验证',
      status: testAccForm.status,
      regTime,
      expireStart: regTime,
      expireEnd: expireEndStr,
      cancelTime: '',
      cancelProof: '未上传'
    };
    setTestAccounts([newAcc, ...testAccounts]);
    setShowTestAccModal(false);
  };

  const handleTestAccDisable = (id) => {
    setTestAccounts(testAccounts.map(a => a.id === id ? {...a, status: a.status === '启用' ? '禁用' : '启用'} : a));
  };
  const handleTestAccCancel = (id) => {
    const account = testAccounts.find(a => a.id === id);
    if (account?.status === '已注销') return;
    if (!confirm('确认注销该测试账号？')) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const cancelTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setTestAccounts(testAccounts.map(a => a.id === id ? {...a, status: '已注销', cancelTime, cancelProof: `注销凭证-${id}`} : a));
  };

  const filteredTestAccounts = testAccounts.filter(a => {
    if (testAccFilters.userId && !String(a.id).includes(testAccFilters.userId)) return false;
    if (testAccFilters.phone && !a.phone.includes(testAccFilters.phone)) return false;
    if (testAccFilters.status && a.status !== testAccFilters.status) return false;
    if (testAccFilters.timeStart && a.regTime < testAccFilters.timeStart) return false;
    if (testAccFilters.timeEnd && a.regTime > testAccFilters.timeEnd + ' 23:59:59') return false;
    return true;
  });
  // 系统开关
  const [switchTab, setSwitchTab] = useState(null);
  const [switches, setSwitches] = useState([
    { key:'realname', name:'实名认证', desc:'控制各业务场景是否需要实名认证', type:'group', children: [
      { key:'realname-register', label:'注册', status:true },
      { key:'realname-publish', label:'发布商品', status:true },
      { key:'realname-order', label:'生成订单', status:true },
      { key:'realname-withdraw', label:'提现', status:true },
    ]},
    { key:'login', name:'登录验证', desc:'控制各登录方式', type:'group', children: [
      { key:'login-sms', label:'短信验证码登录', status:true },
      { key:'login-wechat', label:'微信授权登录', status:true },
      { key:'login-face', label:'人脸识别登录', status:false },
    ]},
    { key:'autoCancel', name:'自动取消订单', desc:'未支付订单超时后自动取消', type:'simple', status:true, updatedAt:'2026-06-28 11:20', updatedBy:'邓辉' },
    { key:'withdraw', name:'提现功能', desc:'用户可申请提现账户余额', type:'simple', status:true, updatedAt:'2026-07-06 16:45', updatedBy:'邓辉' },
    { key:'nightMode', name:'夜间限租', desc:'凌晨0-6点暂停租号服务', type:'simple', status:false, updatedAt:'2026-07-03 22:00', updatedBy:'系统' },
  ]);
  const toggleSwitch = (ckey) => {
    const now = new Date().toISOString().replace('T',' ').slice(0,16);
    setSwitches(prev => prev.map(s => {
      if (s.key === ckey) return {...s, status: !s.status, updatedAt:now, updatedBy:'邓辉'};
      if (s.children) return {...s, children: s.children.map(c => c.key === ckey ? {...c, status: !c.status} : c)};
      return s;
    }));
  };
  const targetGroup = switchTab ? switches.find(s => s.key === switchTab) : null;
  const [adminPhone, setAdminPhone] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setShowWelcome(true);
    localStorage.setItem('admin_token', 'test-token');
  };

  const fetchData = async () => {
    setLoading(true);
    const p = new URLSearchParams({ page });
    if (filters.productNo) p.set('keyword', filters.productNo);
    if (filters.status && filters.status !== '全部商品') p.set('status', filters.status);
    try {
      const r = await fetch(`/mock-api/admin/products?${p}`, { headers: h() });
      if (!r.ok) throw new Error();
      setData(await r.json());
    } catch(e) {
      // GitHub Pages 无后端，使用 mock 数据
      setData({ list: MOCK_GOODS, total: MOCK_GOODS.length });
    }
    setLoading(false);
  };

  useEffect(() => { if (loggedIn) fetchData(); }, [page, filters.status, loggedIn]);

  const act = async (url) => { await fetch(url, { method: 'POST', headers: h() }); fetchData(); };

  // 渠道筛选
  const filteredChannels = channels.filter(c =>
    (!channelFilters.name || c.name.includes(channelFilters.name)) &&
    (!channelFilters.code || c.code.includes(channelFilters.code))
  );

  const handleChannelAdd = () => {
    if (!channelForm.name || !channelForm.code) return alert('请填写渠道名称和渠道代码');
    const newId = Math.max(0, ...channels.map(c => c.id)) + 1;
    setChannels([{ id: newId, name: channelForm.name, code: channelForm.code, status: channelForm.status === '1' ? '启用' : '禁用' }, ...channels]);
    setChannelForm({ name: '', code: '', status: '1' });
    setShowChannelModal(false);
  };

  const handleChannelDelete = (id) => {
    if (!confirm('确认删除该渠道？')) return;
    setChannels(channels.filter(c => c.id !== id));
    setSelectedChannels(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBatchDelete = () => {
    if (selectedChannels.size === 0) return alert('请先选中要删除的记录');
    if (!confirm(`确认删除选中的 ${selectedChannels.size} 条记录？`)) return;
    setChannels(channels.filter(c => !selectedChannels.has(c.id)));
    setSelectedChannels(new Set());
  };

  const toggleAll = () => {
    if (selectedChannels.size === filteredChannels.length) setSelectedChannels(new Set());
    else setSelectedChannels(new Set(filteredChannels.map(c => c.id)));
  };

  const toggleOne = (id) => {
    setSelectedChannels(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🛡️</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1d2129', margin: '0 0 8px' }}>茄子运营后台</h1>
          <p style={{ fontSize: 14, color: '#86909c', margin: 0 }}>三角洲行动账号租赁交易平台</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: '32px 28px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1d2129', textAlign: 'center', margin: '0 0 24px' }}>管理员登录</h2>
          {adminError && <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', color: '#ff4d4f', fontSize: 13, padding: '8px 12px', borderRadius: 4, marginBottom: 16 }}>{adminError}</div>}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input value={adminPhone} onChange={e => { setAdminPhone(e.target.value); setAdminError(''); }} placeholder="手机号码" maxLength={11}
              style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 15, color: '#1d2129', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={adminCode} onChange={e => { setAdminCode(e.target.value); setAdminError(''); }} placeholder="短信验证码" maxLength={6}
                style={{ flex: 1, height: 44, padding: '0 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 15, color: '#1d2129', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => alert('验证码：123123')}
                style={{ height: 44, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff', color: '#1890ff', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>获取验证码</button>
            </div>
            <button type="submit" disabled={adminLoading}
              style={{ width: '100%', height: 44, border: 'none', borderRadius: 4, background: adminLoading ? '#93c5fd' : '#1890ff', color: '#fff', fontSize: 16, fontWeight: 600, cursor: adminLoading ? 'not-allowed' : 'pointer' }}>
              {adminLoading ? '登录中...' : '登 录'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#c9cdd4', margin: '20px 0 0' }}>测试账号 15971444761 · 验证码 123123</p>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#d9d9d9', margin: '8px 0 0' }}>v1.0.0 · 2026.07.13</p>
        </div>
      </div>
    </div>
  );

  if (showWelcome) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: 220, background: '#001529', color: '#fff', flexShrink: 0 }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>🍆 茄子运营后台</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {menuItems.map(item => (
            <div key={item.key}>
              <div
                onClick={() => {
                  if (item.children) { setExpandedMenu(expandedMenu === item.key ? '' : item.key); }
                  else {
                    const firstChild = item.children?.[0];
                    if (firstChild) { setActiveMenu(firstChild.key); setActiveTab(firstChild.label); setShowWelcome(false); }
                    else { setActiveMenu(item.key); setActiveTab(item.label); setShowWelcome(false); }
                  }
                }}
                style={{ padding: '10px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
                  background: expandedMenu === item.key ? '#1890ff' : 'transparent',
                  color: expandedMenu === item.key ? '#fff' : 'rgba(255,255,255,.65)', margin: '2px 8px', borderRadius: 6 }}>
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.children && <span style={{ fontSize: 10 }}>{expandedMenu === item.key ? '▼' : '▶'}</span>}
              </div>
              {item.children && expandedMenu === item.key && (
                <div style={{ paddingLeft: 56 }}>
                  {item.children.map(child => (
                    <div key={child.key} onClick={() => { setActiveMenu(child.key); setActiveTab(child.label); setShowWelcome(false); }}
                      style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 13, borderRadius: 4, margin: '2px 8px',
                        color: 'rgba(255,255,255,.55)', background: 'transparent' }}>
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🍆</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1d2129', margin: '0 0 8px' }}>欢迎进入茄子运营后台</h1>
          <p style={{ fontSize: 15, color: '#86909c', margin: '0 0 24px' }}>三角洲行动账号租赁交易平台 · 数据管理中心</p>
          <p style={{ fontSize: 13, color: '#c9cdd4' }}>请点击左侧菜单进入管理页面</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 侧边栏 */}
      <div style={{ width: collapsed ? 80 : 220, background: '#001529', color: '#fff', transition: 'width .2s', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          {!collapsed && <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>🍆 茄子运营后台</span>}
          {collapsed && <span style={{ fontSize: 24 }}>🍆</span>}
        </div>
        <div style={{ padding: '8px 0' }}>
          {menuItems.map(item => (
            <div key={item.key}>
              <div
                onClick={() => {
                  if (item.children) { setExpandedMenu(expandedMenu === item.key ? '' : item.key); }
                  else { setActiveMenu(item.key); setActiveTab(item.label); }
                }}
                style={{
                  padding: '10px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
                  background: activeMenu === item.key ? '#1890ff' : 'transparent',
                  color: activeMenu === item.key || expandedMenu === item.key ? '#fff' : 'rgba(255,255,255,.65)',
                  margin: '2px 8px', borderRadius: 6,
                }}>
                <span>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && item.children && <span style={{ fontSize: 10 }}>{expandedMenu === item.key ? '▼' : '▶'}</span>}
              </div>
              {!collapsed && item.children && expandedMenu === item.key && (
                <div style={{ paddingLeft: 56 }}>
                  {item.children.map(child => (
                    <div key={child.key} onClick={() => { setActiveMenu(child.key); setActiveTab(child.label); }}
                      style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 13, borderRadius: 4, margin: '2px 8px',
                        color: activeMenu === child.key ? '#fff' : 'rgba(255,255,255,.55)', background: activeMenu === child.key ? '#1890ff' : 'transparent' }}>
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 顶部栏 */}
        <header style={{ height: 48, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #f0f0f0', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#333', padding: 4 }}>☰</button>
          <span style={{ fontSize: 13, color: '#666', flex: 1 }}>欢迎进入 茄子运营后台</span>
          <span style={{ fontSize: 13, color: '#333' }}>👤 邓辉（超级管理员）</span>
        </header>

        {/* Tab 页签 */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 16px', display: 'flex', gap: 2, height: 40, alignItems: 'flex-end' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => { setActiveTab(t); if (t === '提现管理') setActiveMenu('finance-withdraw'); if (t === '订单列表') setActiveMenu('order-list'); if (t === '商品管理') setActiveMenu('goods-manage'); if (t === '商品审核') setActiveMenu('goods-audit'); if (t === '用户列表') setActiveMenu('user-list'); if (t === '渠道配置') setActiveMenu('channel-config'); if (t === '新数据总览') setActiveMenu('dashboard-new'); if (t === '游戏配置') setActiveMenu('game-config'); if (t === '商品属性配置') setActiveMenu('game-attribute'); if (t === '游戏区服配置') setActiveMenu('game-server'); if (t === '测试账号管理') setActiveMenu('user-test-account'); if (t === '系统开关') setActiveMenu('sys-switch'); }}
              style={{ padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: 13,
                background: activeTab === t ? '#fff' : '#fafafa', color: activeTab === t ? '#1890ff' : '#666',
                borderBottom: activeTab === t ? '2px solid #1890ff' : '2px solid transparent', fontWeight: activeTab === t ? 600 : 400 }}>
              {t}
            </button>
          ))}
        </div>

        {/* 筛选区 */}
        {activeTab === '商品管理' && (
          <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input value={filters.onlineStart} onChange={e => setFilters({...filters, onlineStart: e.target.value})} placeholder="上架时间(开始)" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <span style={{ color: '#999' }}>~</span>
              <input value={filters.onlineEnd} onChange={e => setFilters({...filters, onlineEnd: e.target.value})} placeholder="上架时间(结束)" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <input value={filters.offlineStart} onChange={e => setFilters({...filters, offlineStart: e.target.value})} placeholder="下架时间(开始)" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <span style={{ color: '#999' }}>~</span>
              <input value={filters.offlineEnd} onChange={e => setFilters({...filters, offlineEnd: e.target.value})} placeholder="下架时间(结束)" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <select value={filters.productType} onChange={e => setFilters({...filters, productType: e.target.value})} style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                <option>全部商品</option><option>三方商品</option><option>自家商品</option>
              </select>
              <input value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} placeholder="商品状态" style={{ width: 120, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <input value={filters.userId} onChange={e => setFilters({...filters, userId: e.target.value})} placeholder="请输入用户ID" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <input value={filters.phone} onChange={e => setFilters({...filters, phone: e.target.value})} placeholder="请输入手机号" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <input value={filters.title} onChange={e => setFilters({...filters, title: e.target.value})} placeholder="请输入商品标题" style={{ width: 160, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <input value={filters.productNo} onChange={e => setFilters({...filters, productNo: e.target.value})} placeholder="请输入商品编号" style={{ width: 160, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <input value={filters.thirdId} onChange={e => setFilters({...filters, thirdId: e.target.value})} placeholder="三方商品ID" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <button onClick={fetchData} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>查 询</button>
              <button onClick={async () => { setFilters({ productType: '全部商品', status: '全部商品', userId: '', phone: '', title: '', productNo: '', thirdId: '', onlineStart: '', onlineEnd: '', offlineStart: '', offlineEnd: '' }); }} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
              <button style={{ height: 32, padding: '0 12px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>导 出</button>
              <button disabled style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#f5f5f5', color: '#ccc', fontSize: 13, cursor: 'not-allowed' }}>批量下架</button>
            </div>
          </div>
        )}

        {/* 渠道配置筛选区 */}
        {activeTab === '渠道配置' && (
          <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowChannelModal(true)} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>新 增</button>
            <button onClick={handleBatchDelete} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>删 除</button>
            <input value={channelFilters.name} onChange={e => setChannelFilters({...channelFilters, name: e.target.value})} placeholder="渠道名称" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            <input value={channelFilters.code} onChange={e => setChannelFilters({...channelFilters, code: e.target.value})} placeholder="渠道代码" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            <button style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>搜 索</button>
          </div>
        )}

        {/* 游戏配置筛选区 */}
        {activeTab === '游戏配置' && (
          <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input value={gameFilters.name} onChange={e => setGameFilters({...gameFilters, name: e.target.value})} placeholder="游戏名称" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            <select value={gameFilters.type} onChange={e => setGameFilters({...gameFilters, type: e.target.value})} style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 100 }}>
              <option value="">游戏类型</option><option>端游</option><option>手游</option>
            </select>
            <select value={gameFilters.enable} onChange={e => setGameFilters({...gameFilters, enable: e.target.value})} style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 100 }}>
              <option value="">启用状态</option><option>是</option><option>否</option>
            </select>
            <select value={gameFilters.hot} onChange={e => setGameFilters({...gameFilters, hot: e.target.value})} style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 100 }}>
              <option value="">热门状态</option><option>是</option><option>否</option>
            </select>
            <select value={gameFilters.recycle} onChange={e => setGameFilters({...gameFilters, recycle: e.target.value})} style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 100 }}>
              <option value="">回收状态</option><option>是</option><option>否</option>
            </select>
            <button onClick={() => setGameFilters({ name: '', type: '', enable: '', hot: '', recycle: '' })} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
            <button onClick={() => { setEditingGameId(null); setGameForm({ name: '', sort: '', type: '端游', enable: '是', hot: '否', recycle: '否' }); setShowGameModal(true); }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>添 加</button>
          </div>
        )}

        {/* 商品属性配置筛选区 */}
        {activeTab === '商品属性配置' && (
          <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 100 }}>
              <option>属性名称</option>
            </select>
            <input value={gameAttrFilters.keyword} onChange={e => setGameAttrFilters({...gameAttrFilters, keyword: e.target.value})} placeholder="请输入搜索内容" style={{ width: 245, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            <button onClick={() => setGameAttrFilters({ keyword: '' })} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
          </div>
        )}

        {/* 游戏区服配置筛选区 */}
        {activeTab === '游戏区服配置' && (
          <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input value={gameServerFilters.name} onChange={e => setGameServerFilters({...gameServerFilters, name: e.target.value})} placeholder="系统名称" style={{ width: 180, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            <button onClick={() => setGameServerFilters({ name: '' })} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
            <button style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>查 询</button>
            <button onClick={() => { setEditingServerId(null); setServerForm({ name: '', sort: '' }); setShowServerModal(true); }} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>创 建</button>
          </div>
        )}
        {activeTab === '新数据总览' && (
          <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>日期范围选项</span>
            <select defaultValue="近一个月" style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 120 }}>
              <option>近一个月</option><option>近一周</option><option>近三个月</option><option>全部</option>
            </select>
            <span style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>渠道</span>
            <select defaultValue="ALL" style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px', minWidth: 200 }}>
              <option>ALL</option>
              {MOCK_CHANNELS.filter(c => c.status === '启用').map(c => <option key={c.id} value={c.code}>{c.name}</option>)}
            </select>
            <button style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>搜 索</button>
            <button style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
            <button style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>导 出</button>
          </div>
        )}

        {/* 订单列表筛选区 */}
        {activeTab === '订单列表' && <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          {/* 状态快捷筛选 Tab */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px 0', gap: 0 }}>
            {['全部','已超时','待支付','已支付','待发货','租用中','待结算','已完成','已取消'].map(s => (
              <div key={s} onClick={() => setOrderTab(s)}
                style={{
                  padding: '6px 16px', fontSize: 13, cursor: 'pointer',
                  color: orderTab === s ? '#1890ff' : '#666',
                  borderBottom: orderTab === s ? '2px solid #1890ff' : '2px solid transparent',
                  transition: 'all .2s', marginBottom: -1
                }}>{s}{s === '待发货' && <span style={{ marginLeft: 4, background: '#ff4d4f', color: '#fff', borderRadius: 10, padding: '0 6px', fontSize: 11 }}>{orders.filter(o => o.status === '待发货').length}</span>}</div>
            ))}
          </div>
          <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 24px', rowGap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>创建时间</span>
              <input value={orderFilters.timeRange} onChange={e => setOrderFilters({...orderFilters, timeRange: e.target.value})} placeholder="开始日期" style={{ width: 130, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <span style={{ color: '#999' }}>~</span>
              <input placeholder="结束日期" style={{ width: 130, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>发货时间</span>
              <input value={orderFilters.shipTime} onChange={e => setOrderFilters({...orderFilters, shipTime: e.target.value})} placeholder="开始日期" style={{ width: 130, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <span style={{ color: '#999' }}>~</span>
              <input placeholder="结束日期" value={orderFilters.shipTimeEnd} onChange={e => setOrderFilters({...orderFilters, shipTimeEnd: e.target.value})} style={{ width: 130, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>支付状态</span>
              <select value={orderFilters.payStatus} onChange={e => setOrderFilters({...orderFilters, payStatus: e.target.value})} style={{ width: 150, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                <option value="">请选择支付状态</option><option value="待支付">待支付</option><option value="已支付">已支付</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>支付平台</span>
              <select value={orderFilters.payPlatform} onChange={e => setOrderFilters({...orderFilters, payPlatform: e.target.value})} style={{ width: 150, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                <option value="">请选择支付平台</option><option value="微信JSAPI支付">微信JSAPI支付</option><option value="支付宝H5支付">支付宝H5支付</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>订单号</span>
              <input value={orderFilters.orderNo} onChange={e => setOrderFilters({...orderFilters, orderNo: e.target.value})} placeholder="订单号" style={{ width: 160, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 70, textAlign: 'right' }}>买家用户ID</span>
              <input value={orderFilters.buyerId} onChange={e => setOrderFilters({...orderFilters, buyerId: e.target.value})} placeholder="买家用户ID" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 70, textAlign: 'right' }}>买家手机号</span>
              <input value={orderFilters.buyerPhone} onChange={e => setOrderFilters({...orderFilters, buyerPhone: e.target.value})} placeholder="买家手机号" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 70, textAlign: 'right' }}>卖家用户ID</span>
              <input value={orderFilters.sellerId} onChange={e => setOrderFilters({...orderFilters, sellerId: e.target.value})} placeholder="卖家用户ID" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 70, textAlign: 'right' }}>卖家手机号</span>
              <input value={orderFilters.sellerPhone} onChange={e => setOrderFilters({...orderFilters, sellerPhone: e.target.value})} placeholder="卖家手机号" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>商品标题</span>
              <input value={orderFilters.title} onChange={e => setOrderFilters({...orderFilters, title: e.target.value})} placeholder="商品标题" style={{ width: 200, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>商品ID</span>
              <input value={orderFilters.productId} onChange={e => setOrderFilters({...orderFilters, productId: e.target.value})} placeholder="商品ID" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>渠道标识</span>
              <input value={orderFilters.channelCode} onChange={e => setOrderFilters({...orderFilters, channelCode: e.target.value})} placeholder="渠道标识" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 112, textAlign: 'right' }}>三方支付流水单号</span>
              <input value={orderFilters.thirdPayNo} onChange={e => setOrderFilters({...orderFilters, thirdPayNo: e.target.value})} placeholder="三方支付流水订单号" style={{ width: 180, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 70, textAlign: 'right' }}>三方商品ID</span>
              <input value={orderFilters.thirdProductId} onChange={e => setOrderFilters({...orderFilters, thirdProductId: e.target.value})} placeholder="三方商品ID" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>商品类型</span>
              <select value={orderFilters.productType} onChange={e => setOrderFilters({...orderFilters, productType: e.target.value})} style={{ width: 150, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                <option value="">请选择</option><option value="自建商品">自建商品</option><option value="代练商品">代练商品</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <button style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>搜 索</button>
            <button onClick={() => setOrderFilters({ timeRange:'', payStatus:'', payPlatform:'', orderNo:'', buyerId:'', buyerPhone:'', sellerId:'', sellerPhone:'', title:'', productId:'', channelCode:'', thirdPayNo:'', thirdProductId:'', productType:'', shipTime:'', shipTimeEnd:'' })} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
            <button style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>导 出</button>
          </div>
          </div>
        </div>}

        {activeTab === '提现管理' && <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="用户ID" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
          <input placeholder="手机号" style={{ width: 140, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
          <select style={{ height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
            <option>全部状态</option><option>审核中</option><option>已打款</option><option>已拒绝</option>
          </select>
          <button style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>查 询</button>
          <button style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
        </div>}

        {activeTab === '用户列表' && <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 24px', rowGap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>搜索内容</span>
              <input value={userFilters.keyword} onChange={e => setUserFilters({...userFilters, keyword: e.target.value})} placeholder="请输入搜索内容" style={{ width: 180, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>状态</span>
              <select value={userFilters.status} onChange={e => setUserFilters({...userFilters, status: e.target.value})} style={{ width: 130, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                <option value="">请选择状态</option><option value="正常">正常</option><option value="已注销">已注销</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>注册时间</span>
              <input value={userFilters.regStart} onChange={e => setUserFilters({...userFilters, regStart: e.target.value})} placeholder="起始时间(注册)" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <span style={{ color: '#999' }}>~</span>
              <input value={userFilters.regEnd} onChange={e => setUserFilters({...userFilters, regEnd: e.target.value})} placeholder="结束时间(注册)" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <button style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>查 询</button>
            <button onClick={() => setUserFilters({ keyword:'', status:'', regStart:'', regEnd:'' })} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
          </div>
        </div>}

        {/* 测试账号管理筛选区 */}
        {activeTab === '测试账号管理' && <div style={{ background: '#fff', padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 24px', rowGap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>用户ID</span>
              <input value={testAccFilters.userId} onChange={e => setTestAccFilters({...testAccFilters, userId: e.target.value})} placeholder="用户ID" style={{ width: 150, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>状态</span>
              <select value={testAccFilters.status} onChange={e => setTestAccFilters({...testAccFilters, status: e.target.value})} style={{ width: 150, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                <option value="">请选择状态</option><option value="启用">启用</option><option value="禁用">禁用</option><option value="已过期">已过期</option><option value="已注销">已注销</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#666', minWidth: 56, textAlign: 'right' }}>注册时间</span>
              <input value={testAccFilters.timeStart} onChange={e => setTestAccFilters({...testAccFilters, timeStart: e.target.value})} placeholder="开始日期" style={{ width: 130, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              <span style={{ color: '#999' }}>~</span>
              <input value={testAccFilters.timeEnd} onChange={e => setTestAccFilters({...testAccFilters, timeEnd: e.target.value})} placeholder="结束日期" style={{ width: 130, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <button style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>搜 索</button>
            <button onClick={() => setTestAccFilters({ userId: '', phone: '', status: '', timeStart: '', timeEnd: '' })} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>重 置</button>
            <button onClick={() => setShowTestAccModal(true)} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#52c41a', color: '#fff', fontSize: 13, cursor: 'pointer' }}>申请测试账号</button>
          </div>
        </div>}

        {/* 内容表格 */}
        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          {activeTab === '商品管理' && (
            <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
              {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>加载中...</div> :
              !data.list?.length ? <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      {['','商品编号','三方商品ID','商品类型','渠道','商品标题','商品图片','区服','用户ID','手机号','成本金额','出租金额','押金金额','租期','状态','上架时间','下架时间','最后操作时间','操作'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.list.map((item, i) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                        <td style={{ padding: '10px 12px' }}><input type="checkbox" /></td>
                        <td style={{ padding: '10px 12px', color: '#1890ff' }}>{item.productNo}</td>
                        <td style={{ padding: '10px 12px' }}>-</td>
                        <td style={{ padding: '10px 12px' }}>{item.productNo && parseInt(item.productNo)%2===0 ? '三方商品':'自家商品'}</td>
                        <td style={{ padding: '10px 12px' }}>official</td>
                        <td style={{ padding: '10px 12px' }}><div style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title||'-'}</div></td>
                        <td style={{ padding: '10px 12px' }}><span style={{ color: '#1890ff', cursor: 'pointer' }}>1张</span></td>
                        <td style={{ padding: '10px 12px' }}>{item.server||'-'}</td>
                        <td style={{ padding: '10px 12px', color: '#1890ff' }}>{item.sellerId}</td>
                        <td style={{ padding: '10px 12px' }}>-</td>
                        <td style={{ padding: '10px 12px' }}>{(item.price/100 * 0.82).toFixed(1)}</td>
                        <td style={{ padding: '10px 12px' }}>{(item.price/100).toFixed(1)}</td>
                        <td style={{ padding: '10px 12px' }}>{(item.deposit/100).toFixed(0)}</td>
                        <td style={{ padding: '10px 12px' }}>{item.rentDays||'-'}</td>
                        <td style={{ padding: '10px 12px' }}><span style={{ color: item.status==='selling'?'#52c41a':'#999' }}>{item.status==='selling'?'上架中':item.status==='offline'?'已下架':'待审核'}</span></td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#666' }}>{item.publishTime}</td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#666' }}>-</td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#666' }}>{item.updateTime||item.publishTime}</td>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                          <button style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>查看详情</button>
                          <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                          <button onClick={() => act(`/mock-api/admin/products/${item.id}/offline`)} style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 13 }}>下架</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 渠道配置表格 */}
          {activeTab === '渠道配置' && (
            <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ borderBottom: '1px solid #f0f0f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0', width: 50 }}>
                        <input type="checkbox" checked={selectedChannels.size === filteredChannels.length && filteredChannels.length > 0} onChange={toggleAll} />
                      </th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0', width: 150 }}>操作</th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>Id</th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>渠道名称</th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>渠道代码</th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChannels.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', background: selectedChannels.has(item.id) ? '#e6f7ff' : '#fff' }}>
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                          <input type="checkbox" checked={selectedChannels.has(item.id)} onChange={() => toggleOne(item.id)} />
                        </td>
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                          <button onClick={() => { setChannelForm({ name: item.name, code: item.code, status: item.status === '启用' ? '1' : '0' }); setShowChannelModal(true); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>编辑</button>
                          <span style={{ color: '#ddd', margin: '0 8px' }}>|</span>
                          <button onClick={() => handleChannelDelete(item.id)} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>删除</button>
                        </td>
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>{item.id}</td>
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>{item.name}</td>
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>{item.code}</td>
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                          <span style={{ color: item.status === '启用' ? '#52c41a' : '#999' }}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#666' }}>
                共 {filteredChannels.length} 条数据
                {selectedChannels.size > 0 && <span> · 已选中 {selectedChannels.size} 条</span>}
              </div>
            </div>
          )}

          {activeTab === '订单列表' && !showOrderDetail && <OrderTable orders={orders} orderTab={orderTab} filters={orderFilters} onDetail={o => { setOrderDetail(o); setShowOrderDetail(true); }} />}
          {activeTab === '订单列表' && showOrderDetail && orderDetail && <OrderDetailPage order={orderDetail} onBack={() => setShowOrderDetail(false)} />}
          {activeTab === '商品审核' && <Placeholder text="商品审核" />}
          {activeTab === '用户列表' && <UserTable filters={userFilters} />}
          {activeTab === '测试账号管理' && <TestAccountTable
            accounts={filteredTestAccounts}
            onDisable={handleTestAccDisable}
            onCancel={handleTestAccCancel}
          />}
          {activeTab === '提现管理' && <WithdrawalTable act={act} />}
          {activeTab === '系统开关' && !switchTab && <SystemSwitchList switches={switches} onToggle={toggleSwitch} onEnter={key => setSwitchTab(key)} />}
          {activeTab === '系统开关' && switchTab && targetGroup && <SystemSwitchDetail group={targetGroup} onToggle={toggleSwitch} onBack={() => setSwitchTab(null)} />}

          {/* 游戏配置表格 */}
          {activeTab === '游戏配置' && (
            <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['序号','操作','游戏名称','排序','游戏类型','游戏图标','是否回收','是否启用','是否热门','创建人','创建时间'].map(h => (
                      <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {games.filter(g => (!gameFilters.name || g.name.includes(gameFilters.name)) && (!gameFilters.type || g.type === gameFilters.type) && (!gameFilters.enable || g.enable === gameFilters.enable) && (!gameFilters.hot || g.hot === gameFilters.hot) && (!gameFilters.recycle || g.recycle === gameFilters.recycle)).map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{i+1}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0', whiteSpace: 'nowrap', position: 'relative' }}>
                        <button onClick={() => { setEditingGameId(item.id); setGameForm({ name: item.name, sort: String(item.sort), type: item.type, enable: item.enable, hot: item.hot, recycle: item.recycle }); setShowGameModal(true); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>编辑</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>删除</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <span style={{ position: 'relative' }}>
                          <button onClick={() => setShowGameMore(showGameMore === item.id ? null : item.id)} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>更多 ▾</button>
                          {showGameMore === item.id && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,.15)', minWidth: 120, textAlign: 'left' }}>
                              <div onClick={() => { setActiveTab('游戏区服配置'); setActiveMenu('game-server'); setShowGameMore(null); }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }} onMouseEnter={e => e.target.style.background='#f5f5f5'} onMouseLeave={e => e.target.style.background='#fff'}>区服配置</div>
                              <div onClick={() => { setActiveTab('商品属性配置'); setActiveMenu('game-attribute'); setShowGameMore(null); }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }} onMouseEnter={e => e.target.style.background='#f5f5f5'} onMouseLeave={e => e.target.style.background='#fff'}>属性配置</div>
                              <div onClick={() => { setShowTitleModal(true); setShowGameMore(null); }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }} onMouseEnter={e => e.target.style.background='#f5f5f5'} onMouseLeave={e => e.target.style.background='#fff'}>标题配置</div>
                            </div>
                          )}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.name}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.sort}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.type}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0', fontSize: 20 }}>{item.icon}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.recycle}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.enable}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.hot}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.creator}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.createTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '8px 16px', fontSize: 13, color: '#666', textAlign: 'right' }}>共 {games.length} 条数据</div>
              {showGameMore && <div onClick={() => setShowGameMore(null)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
            </div>
          )}

          {/* 商品属性配置表格 */}
          {activeTab === '商品属性配置' && (
            <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ borderBottom: '1px solid #f0f0f0', padding: '8px 16px', display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditingAttrId(null); setAttrForm({ ...attrForm, name: '', sort: '' }); setShowAttrModal(true); }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>添 加</button>
                <button onClick={() => setShowSortModal(true)} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>排序管理</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['序号','操作','游戏名称','属性名称','属性类型','输入类型','是否多选','是否必填','创建人','创建时间'].map(h => (
                      <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attrs.filter(a => !gameAttrFilters.keyword || a.name.includes(gameAttrFilters.keyword)).map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{i+1}</td>
                      <td style={{ textAlign: 'center', padding: '8px', whiteSpace: 'nowrap' }}>
                        <button onClick={() => { setEditingAttrId(item.id); setAttrForm({ name: item.name, type: item.type, inputType: item.inputType, multi: item.multi, required: item.required, sort: String(item.sort) }); setShowAttrModal(true); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>编辑</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button onClick={() => setAttrs(attrs.filter(a => a.id !== item.id))} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>删除</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>查看下级</button>
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.game}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.name}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.type}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.inputType}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.multi}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.required}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.creator}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.createTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '8px 16px', fontSize: 13, color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                <span>共 {attrs.length} 条数据</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button disabled style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#f5f5f5', color: '#ccc', fontSize: 12 }}>&lt;</button>
                  <span style={{ color: '#1890ff', fontWeight: 600 }}>1</span>
                  <button style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 12, cursor: 'pointer' }}>2</button>
                  <button style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 12, cursor: 'pointer' }}>3</button>
                  <button style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 12, cursor: 'pointer' }}>4</button>
                  <button style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 12, cursor: 'pointer' }}>&gt;</button>
                  <span style={{ fontSize: 12, color: '#666' }}>10 条/页</span>
                </span>
              </div>
            </div>
          )}

          {/* 游戏区服配置表格 */}
          {activeTab === '游戏区服配置' && (
            <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['序号','操作','系统名称','排序','创建人','创建时间'].map(h => (
                      <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {servers.filter(s => !gameServerFilters.name || s.name.includes(gameServerFilters.name)).map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{i+1}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
                        <button style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>查看下级服务</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button onClick={() => { setEditingServerId(item.id); setServerForm({ name: item.name, sort: String(item.sort) }); setShowServerModal(true); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>编辑</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>删除</button>
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.name}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.sort}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.creator}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{item.createTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '8px 16px', fontSize: 13, color: '#666', textAlign: 'right' }}>共 {servers.length} 条数据</div>
            </div>
          )}

          {/* 其他菜单页签 */}
          {activeTab === '渠道管理' && <Placeholder text="渠道管理" />}
          {/* 新数据总览表格 */}
          {activeTab === '新数据总览' && (
            <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 3000 }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['统计日期','渠道','页面访问UV','活跃用户数','新增注册用户数','上架商品总数','新用户上架商品数','订单总量','新用户下单量','付费用户数','新用户付费数','成功售出商品数','新用户售出商品数','平均账号周转时长','平台结算流水','平均账号租用时长','用户复购率','自建商品上架总数','支付成功订单数','购买后发货成功率','自建商品售出数','三方商品售出数','结单数','总流水'].map(h => (
                        <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', minWidth: 110 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DASHBOARD.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.statDate}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.channel}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.pageUv}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.activeUsers}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.newRegUsers}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.totalListedGoods}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.newUserListedGoods}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.totalOrders}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.newUserOrders}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.paidUsers}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.newUserPaid}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.soldGoods}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.newUserSoldGoods}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.avgGoodsTurnover}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.platformSettlement}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.avgRentalDuration}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.userRepurchaseRate}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.selfGoodsCount}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.payedOrderCount}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.deliverySuccessRate}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.selfGoodsSoldCount}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.thirdGoodsSoldCount}</td>
                        <td style={{ textAlign: 'center', padding: '8px', borderRight: '1px solid #f0f0f0' }}>{item.settlementOrderCount}</td>
                        <td style={{ textAlign: 'center', padding: '8px' }}>{item.totalSettlementAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                {/* 右侧滚动提示渐变 */}
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, background: 'linear-gradient(to right, transparent, rgba(0,0,0,.06))', pointerEvents: 'none' }} />
              </div>
              <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#bbb' }}>
                <span>← 左右滑动查看更多列 →</span>
                <span>共 {MOCK_DASHBOARD.length} 条数据</span>
              </div>
            </div>
          )}

          {activeTab === '数据看板' && <Placeholder text="数据看板" />}
          {activeTab === '客服工作台' && <Placeholder text="客服工作台 - 会话记录" />}
          {activeTab === '游戏管理' && <Placeholder text="游戏管理 - 游戏配置" />}
          {activeTab === '运营管理' && <Placeholder text="运营管理" />}
          {activeTab === '供货商菜单' && <Placeholder text="供货商菜单" />}
          {activeTab === '版本发布' && <Placeholder text="版本发布" />}
          {activeTab === '系统管理' && <Placeholder text="系统管理 - 用户/角色/菜单/字典" />}
          {activeTab === '租金规则' && <Placeholder text="租金规则" />}
          {activeTab === '账户管理' && <Placeholder text="财务管理 - 账户管理" />}
        </div>

        {/* 底部分页 */}
        {activeTab === '商品管理' && data.total > 10 && (
          <div style={{ textAlign: 'center', padding: '12px 0', background: '#fff' }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{ margin: '0 4px', padding: '4px 10px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', cursor: 'pointer', color: page===1?'#ccc':'#333' }}>{'<'}</button>
            <span style={{ margin: '0 8px', color: '#666', fontSize: 13 }}>{page} / {Math.ceil(data.total/10)}</span>
            <button onClick={() => setPage(p => p+1)} disabled={page>=Math.ceil(data.total/10)} style={{ margin: '0 4px', padding: '4px 10px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', cursor: 'pointer' }}>{'>'}</button>
          </div>
        )}
      </div>

      {/* 新增渠道弹窗 */}
      {showChannelModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowChannelModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>新增渠道</span>
              <button onClick={() => setShowChannelModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}><span style={{ color: '#ff4d4f' }}>*</span> 渠道名称</span>
                <input value={channelForm.name} onChange={e => setChannelForm({...channelForm, name: e.target.value})} placeholder="渠道名称" style={{ flex: 1, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}><span style={{ color: '#ff4d4f' }}>*</span> 渠道代码</span>
                <input value={channelForm.code} onChange={e => setChannelForm({...channelForm, code: e.target.value})} placeholder="渠道代码" style={{ flex: 1, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}><span style={{ color: '#ff4d4f' }}>*</span> 启用状态</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
                    <input type="radio" name="channelStatus" value="1" checked={channelForm.status === '1'} onChange={e => setChannelForm({...channelForm, status: e.target.value})} /> 启用
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
                    <input type="radio" name="channelStatus" value="0" checked={channelForm.status === '0'} onChange={e => setChannelForm({...channelForm, status: e.target.value})} /> 禁用
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowChannelModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={handleChannelAdd} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 测试账号新增弹窗 */}
      {showTestAccModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowTestAccModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>申请测试账号</span>
              <button onClick={() => setShowTestAccModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>系统将自动生成用户ID与手机号</div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}>有效期</span>
                <select value={testAccForm.validDays} onChange={e => setTestAccForm({...testAccForm, validDays: e.target.value})} style={{ flex: 1, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                  {['1','3','7','14','30','永久'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}>状态</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['启用','禁用'].map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
                      <input type="radio" name="testAccStatus" value={s} checked={testAccForm.status === s} onChange={e => setTestAccForm({...testAccForm, status: e.target.value})} /> {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowTestAccModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={handleTestAccAdd} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 区服创建/编辑弹窗 */}
      {showServerModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowServerModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 460, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{editingServerId ? '编辑区服' : '创建区服'}</span>
              <button onClick={() => setShowServerModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <Field label="系统名称" required>
                <input value={serverForm.name} onChange={e => setServerForm({...serverForm, name: e.target.value})} placeholder="请输入系统名称" style={inputS} />
              </Field>
              <Field label="排序">
                <input value={serverForm.sort} onChange={e => setServerForm({...serverForm, sort: e.target.value})} placeholder="排序值" style={inputS} />
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowServerModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => {
                if (!serverForm.name) return alert('请输入系统名称');
                if (editingServerId) {
                  setServers(servers.map(s => s.id === editingServerId ? { ...s, name: serverForm.name, sort: parseInt(serverForm.sort)||s.sort } : s));
                } else {
                  const newId = Math.max(0, ...servers.map(s => s.id)) + 1;
                  setServers([...servers, { id: newId, name: serverForm.name, sort: parseInt(serverForm.sort)||99, creator: 'admin', createTime: new Date().toISOString().slice(0,19).replace('T',' ') }]);
                }
                setShowServerModal(false);
              }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 新增属性分组弹窗 */}
      {showGroupModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowGroupModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 460, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{editingGroupId ? '编辑分组' : '新增属性分组'}</span>
              <button onClick={() => setShowGroupModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <Field label="分组名称" required>
                <input value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} placeholder="请输入分组名称" style={inputS} />
              </Field>
              <Field label="排序">
                <input value={groupForm.sort} onChange={e => setGroupForm({...groupForm, sort: e.target.value})} placeholder="排序值" style={inputS} />
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowGroupModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => {
                if (!groupForm.name) return alert('请输入分组名称');
                if (editingGroupId) {
                  setAttrGroups(attrGroups.map(g => g.id === editingGroupId ? { ...g, name: groupForm.name, sort: parseInt(groupForm.sort)||g.sort } : g));
                } else {
                  const newId = Math.max(0, ...attrGroups.map(g => g.id)) + 1;
                  setAttrGroups([...attrGroups, { id: newId, name: groupForm.name, sort: parseInt(groupForm.sort)||99, creator: 'admin', createTime: new Date().toISOString().slice(0,19).replace('T',' ') }]);
                }
                setShowGroupModal(false);
              }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 属性添加/编辑弹窗 */}
      {showAttrModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowAttrModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 460, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{editingAttrId ? '编辑属性' : '添加属性'}</span>
              <button onClick={() => setShowAttrModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <Field label="游戏名称">
                <div style={{ color: '#333', fontSize: 13, paddingTop: 6 }}>三角洲</div>
              </Field>
              <Field label="属性名称" required>
                <input value={attrForm.name} onChange={e => setAttrForm({...attrForm, name: e.target.value})} placeholder="请输入游戏属性名称" style={inputS} />
              </Field>
              <Field label="排序" required>
                <input value={attrForm.sort||''} onChange={e => setAttrForm({...attrForm, sort: e.target.value})} placeholder="排序值" style={inputS} />
              </Field>
              <Field label="属性类型">
                <div style={radioGroup}>
                  {['基础属性','高级属性','非游戏属性'].map(v => <label key={v} style={radioL}><input type="radio" name="type" value={v} checked={attrForm.type===v} onChange={e=>setAttrForm({...attrForm,type:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              <Field label="输入类型">
                <div style={radioGroup}>
                  {['勾选类型','输入类型'].map(v => <label key={v} style={radioL}><input type="radio" name="inputType" value={v} checked={attrForm.inputType===v} onChange={e=>setAttrForm({...attrForm,inputType:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              {attrForm.inputType === '勾选类型' && (<>
              <Field label="输入控制">
                <div style={radioGroup}>
                  {['多选','单选'].map(v => <label key={v} style={radioL}><input type="radio" name="inputControl" value={v} checked={attrForm.inputControl===v} onChange={e=>setAttrForm({...attrForm,inputControl:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              <Field label="输入样式">
                <div style={radioGroup}>
                  {['下拉菜单','选择控件','单选+输入类型'].map(v => <label key={v} style={radioL}><input type="radio" name="inputStyle" value={v} checked={attrForm.inputStyle===v} onChange={e=>setAttrForm({...attrForm,inputStyle:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              </>)}
              <Field label="输入是否必填">
                <div style={radioGroup}>
                  {['否','是'].map(v => <label key={v} style={radioL}><input type="radio" name="required" value={v} checked={attrForm.required===v} onChange={e=>setAttrForm({...attrForm,required:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              {attrForm.inputType === '勾选类型' && (
              <Field label="筛选控制">
                <div style={radioGroup}>
                  {['单选','多选'].map(v => <label key={v} style={radioL}><input type="radio" name="filterControl" value={v} checked={attrForm.filterControl===v} onChange={e=>setAttrForm({...attrForm,filterControl:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              )}
              <Field label="是否回收属性">
                <div style={radioGroup}>
                  {['是','否'].map(v => <label key={v} style={radioL}><input type="radio" name="recycle" value={v} checked={attrForm.recycle===v} onChange={e=>setAttrForm({...attrForm,recycle:e.target.value})}/> {v}</label>)}
                </div>
              </Field>
              <Field label="规则字典">
                <input value={attrForm.dict||''} onChange={e => setAttrForm({...attrForm, dict: e.target.value})} placeholder="请输入规则字典" style={inputS} />
              </Field>
              <Field label="备注说明">
                <textarea value={attrForm.remark||''} onChange={e => setAttrForm({...attrForm, remark: e.target.value})} placeholder="请输入备注说明" style={{ ...inputS, height: 80, resize: 'vertical', padding: '8px' }} />
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowAttrModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => {
                if (!attrForm.name) return alert('请输入属性名称');
                if (editingAttrId) {
                  setAttrs(attrs.map(a => a.id === editingAttrId ? { ...a, name: attrForm.name, type: attrForm.type, inputType: attrForm.inputType, required: attrForm.required, sort: parseInt(attrForm.sort)||0 } : a));
                } else {
                  const newId = Math.max(0, ...attrs.map(a => a.id)) + 1;
                  setAttrs([...attrs, { id: newId, game: '三角洲', name: attrForm.name, type: attrForm.type, inputType: attrForm.inputType, multi: attrForm.inputControl==='多选'?'是':'否', required: attrForm.required, sort: parseInt(attrForm.sort)||99, creator: 'admin', createTime: new Date().toISOString().slice(0,19).replace('T',' ') }]);
                }
                setShowAttrModal(false);
              }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 排序规则管理弹窗 */}
      {showSortModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowSortModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 780, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>排序管理</span>
              <button onClick={() => setShowSortModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <div style={{ marginBottom: 12 }}>
                <button onClick={() => { setRuleFormMode('add'); setSortRuleForm({ name:'', code:'', status:'启用' }); setShowRuleFormModal(true); }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>新增规则</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['操作','规则名称','规则代码','状态','创建时间','更新时间'].map(h => (
                      <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortRules.map(rule => (
                    <tr key={rule.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ textAlign: 'center', padding: '8px', whiteSpace: 'nowrap' }}>
                        <button onClick={() => { setSortRules(sortRules.map(r => r.id===rule.id ? {...r, status: r.status==='启用'?'禁用':'启用'} : r)); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>{rule.status==='启用'?'禁用':'启用'}</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button onClick={() => { setRuleFormMode('edit'); setSortRuleForm({ name:rule.name, code:rule.code, status:rule.status }); setEditingRuleId(rule.id); setShowRuleFormModal(true); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>编辑</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button onClick={() => { setEditingRuleId(rule.id); setSortRuleForm({ name:rule.name, code:rule.code, status:rule.status }); setShowSortRuleModal(true); }} style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', fontSize: 13 }}>排序规则</button>
                        <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
                        <button onClick={() => { if(confirm('确认删除该规则？')) setSortRules(sortRules.filter(r => r.id!==rule.id)); }} style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 13 }}>删除</button>
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{rule.name}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{rule.code}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}><span style={{ color: rule.status==='启用'?'#52c41a':'#999' }}>{rule.status==='启用'?'启用(生效)':'禁用'}</span></td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{rule.createTime}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{rule.updateTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowSortModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => setShowSortModal(false)} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 新增/编辑规则表单弹窗 */}
      {showRuleFormModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }}>
          <div onClick={() => setShowRuleFormModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 460, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{ruleFormMode === 'add' ? '新增规则' : '编辑规则'}</span>
              <button onClick={() => setShowRuleFormModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <Field label="规则名称" required>
                <input value={sortRuleForm.name} onChange={e => setSortRuleForm({...sortRuleForm, name: e.target.value})} placeholder="请输入规则名称" style={inputS} />
              </Field>
              <Field label="规则代码" required>
                <input value={sortRuleForm.code} onChange={e => setSortRuleForm({...sortRuleForm, code: e.target.value})} placeholder="请输入规则代码" style={inputS} />
              </Field>
              <Field label="状态" required>
                <div style={radioGroup}>
                  <label style={radioL}><input type="radio" name="ruleStatus" value="启用" checked={sortRuleForm.status==='启用'} onChange={e=>setSortRuleForm({...sortRuleForm,status:e.target.value})} /> 启用</label>
                  <label style={radioL}><input type="radio" name="ruleStatus" value="禁用" checked={sortRuleForm.status==='禁用'} onChange={e=>setSortRuleForm({...sortRuleForm,status:e.target.value})} /> 禁用</label>
                </div>
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowRuleFormModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => {
                if (!sortRuleForm.name || !sortRuleForm.code) return alert('请填写规则名称和规则代码');
                if (ruleFormMode === 'add') {
                  const newId = Math.max(0, ...sortRules.map(r => r.id)) + 1;
                  const now = new Date().toISOString().slice(0,19).replace('T',' ');
                  setSortRules([...sortRules, { id: newId, name: sortRuleForm.name, code: sortRuleForm.code, status: sortRuleForm.status, createTime: now, updateTime: now, groups: [] }]);
                } else {
                  setSortRules(sortRules.map(r => r.id === editingRuleId ? { ...r, name: sortRuleForm.name, code: sortRuleForm.code, status: sortRuleForm.status, updateTime: new Date().toISOString().slice(0,19).replace('T',' ') } : r));
                }
                setShowRuleFormModal(false);
              }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>提 交</button>
            </div>
          </div>
        </div>
      )}

      {/* 排序规则设置弹窗 */}
      {showSortRuleModal && (() => {
        const currentRule = sortRules.find(r => r.id === editingRuleId);
        const groups = currentRule?.groups || [];
        return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }}>
          <div onClick={() => setShowSortRuleModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>排序规则设置</span>
              <button onClick={() => setShowSortRuleModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '12px 24px', background: '#e6f7ff', borderBottom: '1px solid #91d5ff', fontSize: 13, color: '#1890ff', flexShrink: 0 }}>
              ℹ 当前规则: {sortRuleForm.name || '未知'}
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              {groups.map((group, gi) => (
                <div key={group.id} style={{ background: '#fafafa', borderRadius: 4, border: '1px solid #f0f0f0', padding: '16px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>分组名称: {group.name}</span>
                  </div>
                  {/* 分组名称和排序输入 */}
                  <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#333' }}><span style={{ color: '#ff4d4f' }}>*</span> 组名称</span>
                      <input
                        value={group.name}
                        onChange={e => {
                          const rules = [...sortRules];
                          const ri = rules.findIndex(r => r.id === editingRuleId);
                          rules[ri].groups[gi].name = e.target.value;
                          setSortRules(rules);
                        }}
                        style={{ width: 140, height: 30, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#333' }}>组排序</span>
                      <input
                        value={group.sort}
                        onChange={e => {
                          const rules = [...sortRules];
                          const ri = rules.findIndex(r => r.id === editingRuleId);
                          rules[ri].groups[gi].sort = parseInt(e.target.value) || 0;
                          setSortRules(rules);
                        }}
                        style={{ width: 80, height: 30, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={() => {
                        if (!confirm('确认删除该分组及其所有属性？')) return;
                        const rules = [...sortRules];
                        const ri = rules.findIndex(r => r.id === editingRuleId);
                        rules[ri].groups = rules[ri].groups.filter((_, idx) => idx !== gi);
                        setSortRules(rules);
                      }}
                      style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 12 }}
                    >删除分组</button>
                  </div>
                  {/* 属性列表 */}
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#333', marginBottom: 8 }}>设置属性</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 8 }}>
                    <thead>
                      <tr style={{ background: '#fff' }}>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>属性名称</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>是否必填</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.attrs.map((attr, ai) => (
                        <tr key={ai}>
                          <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{attr.name}</td>
                          <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{attr.required}</td>
                          <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
                            <button
                              disabled={ai === 0}
                              onClick={() => {
                                const rules = [...sortRules];
                                const ri = rules.findIndex(r => r.id === editingRuleId);
                                const attrs = [...rules[ri].groups[gi].attrs];
                                [attrs[ai], attrs[ai - 1]] = [attrs[ai - 1], attrs[ai]];
                                rules[ri].groups[gi].attrs = attrs;
                                setSortRules(rules);
                              }}
                              style={{ border: 'none', background: 'none', color: ai === 0 ? '#ccc' : '#1890ff', cursor: ai === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}
                            >上移</button>
                            <span style={{ color: '#ddd', margin: '0 6px' }}>|</span>
                            <button
                              disabled={ai === group.attrs.length - 1}
                              onClick={() => {
                                const rules = [...sortRules];
                                const ri = rules.findIndex(r => r.id === editingRuleId);
                                const attrs = [...rules[ri].groups[gi].attrs];
                                [attrs[ai], attrs[ai + 1]] = [attrs[ai + 1], attrs[ai]];
                                rules[ri].groups[gi].attrs = attrs;
                                setSortRules(rules);
                              }}
                              style={{ border: 'none', background: 'none', color: ai === group.attrs.length - 1 ? '#ccc' : '#1890ff', cursor: ai === group.attrs.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}
                            >下移</button>
                            <span style={{ color: '#ddd', margin: '0 6px' }}>|</span>
                            <button
                              onClick={() => {
                                const rules = [...sortRules];
                                const ri = rules.findIndex(r => r.id === editingRuleId);
                                rules[ri].groups[gi].attrs = rules[ri].groups[gi].attrs.filter((_, idx) => idx !== ai);
                                setSortRules(rules);
                              }}
                              style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 13 }}
                            >删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => {
                      const rules = [...sortRules];
                      const ri = rules.findIndex(r => r.id === editingRuleId);
                      rules[ri].groups[gi].attrs.push({ name: '新属性', required: '否' });
                      setSortRules(rules);
                    }}
                    style={{ height: 30, padding: '0 14px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                  >新增属性</button>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <button
                  onClick={() => {
                    const rules = [...sortRules];
                    const ri = rules.findIndex(r => r.id === editingRuleId);
                    const maxId = Math.max(0, ...rules[ri].groups.map(g => g.id)) + 1;
                    const maxSort = Math.max(0, ...rules[ri].groups.map(g => g.sort)) + 1;
                    rules[ri].groups.push({ id: maxId, name: '新分组', sort: maxSort, attrs: [] });
                    setSortRules(rules);
                  }}
                  style={{ height: 32, padding: '0 24px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                >新增组</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa', flexShrink: 0 }}>
              <button onClick={() => setShowSortRuleModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => setShowSortRuleModal(false)} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>提 交</button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* 添加/编辑游戏弹窗 */}
      {showGameModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowGameModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{editingGameId ? '编辑游戏' : '添加游戏'}</span>
              <button onClick={() => setShowGameModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <Field label="游戏名称" required>
                <input value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} placeholder="请输入游戏名称" style={inputS} />
              </Field>
              <Field label="游戏图标" required>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 80, height: 80, border: '1px dashed #d9d9d9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', cursor: 'pointer', fontSize: 28 }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = () => alert('图标上传功能（演示）');
                      input.click();
                    }}>
                    {gameForm.icon ? <span style={{ fontSize: 40 }}>{gameForm.icon}</span> : <span style={{ color: '#bbb' }}>+</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    <div>支持 JPG/PNG 格式</div>
                    <div>建议尺寸 80×80</div>
                    <div style={{ marginTop: 4 }}>或输入 emoji：</div>
                    <input value={gameForm.icon || ''} onChange={e => setGameForm({...gameForm, icon: e.target.value})} placeholder="如 🎯" style={{ width: 60, height: 28, padding: '0 4px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
                  </div>
                </div>
              </Field>
              <Field label="游戏类型" required>
                <select value={gameForm.type} onChange={e => setGameForm({...gameForm, type: e.target.value})} style={{...inputS, width: '100%' }}>
                  <option>端游</option><option>手游</option>
                </select>
              </Field>
              <Field label="排序">
                <input value={gameForm.sort} onChange={e => setGameForm({...gameForm, sort: e.target.value})} placeholder="排序值" style={inputS} />
              </Field>
              <Field label="是否启用">
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={radioL}><input type="radio" name="enable" value="是" checked={gameForm.enable === '是'} onChange={e => setGameForm({...gameForm, enable: e.target.value})} /> 是</label>
                  <label style={radioL}><input type="radio" name="enable" value="否" checked={gameForm.enable === '否'} onChange={e => setGameForm({...gameForm, enable: e.target.value})} /> 否</label>
                </div>
              </Field>
              <Field label="是否热门">
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={radioL}><input type="radio" name="hot" value="是" checked={gameForm.hot === '是'} onChange={e => setGameForm({...gameForm, hot: e.target.value})} /> 是</label>
                  <label style={radioL}><input type="radio" name="hot" value="否" checked={gameForm.hot === '否'} onChange={e => setGameForm({...gameForm, hot: e.target.value})} /> 否</label>
                </div>
              </Field>
              <Field label="是否回收">
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={radioL}><input type="radio" name="recycle" value="是" checked={gameForm.recycle === '是'} onChange={e => setGameForm({...gameForm, recycle: e.target.value})} /> 是</label>
                  <label style={radioL}><input type="radio" name="recycle" value="否" checked={gameForm.recycle === '否'} onChange={e => setGameForm({...gameForm, recycle: e.target.value})} /> 否</label>
                </div>
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowGameModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => {
                if (!gameForm.name) return alert('请输入游戏名称');
                if (editingGameId) {
                  setGames(games.map(g => g.id === editingGameId ? { ...g, name: gameForm.name, sort: parseInt(gameForm.sort)||g.sort, type: gameForm.type, enable: gameForm.enable, hot: gameForm.hot, recycle: gameForm.recycle, icon: gameForm.icon || g.icon } : g));
                } else {
                  const newId = Math.max(0, ...games.map(g => g.id)) + 1;
                  setGames([...games, { id: newId, name: gameForm.name, sort: parseInt(gameForm.sort)||99, type: gameForm.type, icon: gameForm.icon || '🎮', recycle: gameForm.recycle, enable: gameForm.enable, hot: gameForm.hot, creator: 'admin', createTime: new Date().toISOString().slice(0,19).replace('T',' ') }]);
                }
                setShowGameModal(false);
              }} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}

      {/* 游戏标题配置弹窗 */}
      {showTitleModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowTitleModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>游戏标题配置</span>
              <button onClick={() => setShowTitleModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* 左侧标题列表 */}
              <div style={{ width: 360, borderRight: '1px solid #f0f0f0', overflow: 'auto', padding: '12px', maxHeight: 500 }}>
                {gameTitles.map((title, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', height: 36, cursor: 'pointer', marginBottom: 4, borderRadius: 4, padding: '0 8px' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafafa'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <div style={{ flex: 1, fontSize: 13, color: '#333' }}>{title}</div>
                    <button onClick={() => setGameTitles(gameTitles.filter((_, idx) => idx !== i))}
                      style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 16 }}>✕</button>
                  </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <button onClick={() => setGameTitles([...gameTitles, '新标题项：#'])} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>新增其他标题项</button>
                </div>
              </div>
              {/* 右侧表单 */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}><span style={{ color: '#ff4d4f' }}>*</span> 标题模板</span>
                  <input value={titleForm.template} onChange={e => setTitleForm({...titleForm, template: e.target.value})} placeholder="请输入标题模板" style={{ flex: 1, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0 }}><span style={{ color: '#ff4d4f' }}>*</span> 配置属性</span>
                  <select value={titleForm.attribute} onChange={e => setTitleForm({...titleForm, attribute: e.target.value})} style={{ flex: 1, height: 32, border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, padding: '0 8px' }}>
                    <option value="">请选择</option>
                    {MOCK_GAME_ATTRS.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <button onClick={() => { setShowTitleModal(false); }} style={{ width: 120, height: 32, border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>保 存</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => setShowTitleModal(false)} style={{ height: 32, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer' }}>取 消</button>
              <button onClick={() => setShowTitleModal(false)} style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 2, background: '#1890ff', color: '#fff', fontSize: 13, cursor: 'pointer' }}>确 认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderDetailPage({ order, onBack }) {
  const sections = [
    { title: '租用信息', rows: [
      ['订单号', order.orderNo], ['订单状态', order.status],
      ['创建时间', order.createTime], ['发货时间', order.shipTime||'-'],
      ['商品标题', order.title], ['手机号', order.phone],
      ['结算模式', order.settleMode], ['游戏区服', order.server],
    ]},
    { title: '渠道信息', rows: [
      ['商品上架渠道', order.upChannel], ['上报渠道', order.reportChannel],
      ['归属渠道', order.belongChannel], ['商品类型', order.type],
    ]},
    { title: '支付信息', rows: [
      ['成本金额(元)', order.cost], ['出租金额(元)', order.rent],
      ['押金金额(元)', order.deposit], ['支付金额(元)', order.pay],
      ['平台抽成(元)', order.fee], ['买家实付(元)', order.buyerPay],
      ['买家实退(元)', order.buyerRefund||'-'], ['卖家结算(元)', order.sellerSettle||'-'],
      ['支付方式', order.payMethod], ['支付渠道名称', order.payChannel],
    ]},
    { title: '关联信息', rows: [
      ['商品ID', order.productId], ['三方商品ID', order.thirdProductId||'-'],
      ['三方支付流水订单号', order.thirdPayNo||'-'], ['最后操作人', order.operator],
    ]},
  ];
  const statusColor = { '待发货':'#1890ff','已取消':'#999','已超时':'#ff4d4f','待支付':'#faad14','租用中':'#52c41a' };
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100%' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',background:'#fff',marginBottom:12,borderRadius:2 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <span style={{ fontSize:16,fontWeight:600,color:'#333' }}>{order.orderNo}</span>
          <span style={{ padding:'2px 10px',borderRadius:3,fontSize:12,color:statusColor[order.status]||'#333',background:(statusColor[order.status]||'#f0f0f0')+'20',border:`1px solid ${statusColor[order.status]||'#d9d9d9'}` }}>{order.status}</span>
        </div>
        <button onClick={onBack} style={{ height:32,padding:'0 16px',border:'1px solid #d9d9d9',borderRadius:2,background:'#fff',color:'#333',fontSize:13,cursor:'pointer' }}>返 回</button>
      </div>
      {sections.map((sec, i) => (
        <div key={i} style={{ background:'#fff',borderRadius:2,padding:'16px 20px',marginBottom:12 }}>
          <div style={{ fontSize:14,fontWeight:600,color:'#333',marginBottom:12 }}>{sec.title}</div>
          <table style={{ width:'100%',fontSize:13,borderCollapse:'collapse' }}>
            <tbody>
              {sec.rows.reduce((acc, row, j) => {
                if (j % 3 === 0) acc.push([]);
                acc[acc.length-1].push(row);
                return acc;
              }, []).map((triple, ri) => (
                <tr key={ri} style={{ borderBottom:'1px solid #f0f0f0' }}>
                  {triple.map(([label, value], ci) => (
                    <td key={ci} style={{ padding:'10px 12px',width:'33.3%' }}>
                      <span style={{ color:'#999',marginRight:8 }}>{label}</span>
                      <span style={{ color:'#333' }}>{value}</span>
                    </td>
                  ))}
                  {triple.length < 3 && <td style={{ padding:'10px 12px',width:'33.3%' }} />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ text }) {
  return <div style={{ background: '#fff', borderRadius: 2, textAlign: 'center', padding: 60, color: '#999', fontSize: 15 }}>{text}<br /><span style={{ fontSize: 13, marginTop: 8, display: 'block' }}>功能开发中...</span></div>;
}

const inputS = { height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2, fontSize: 13, boxSizing: 'border-box', width: '100%' };
const radioL = { display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' };
const radioGroup = { display: 'flex', gap: 16 };
function Field({ label, required, children }) {
  return <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
    <span style={{ width: 80, fontSize: 14, color: '#333', flexShrink: 0, paddingTop: 6 }}>{required && <span style={{ color: '#ff4d4f' }}>* </span>}{label}</span>
    <div style={{ flex: 1 }}>{children}</div>
  </div>;
}

function OrderTable({ orders, orderTab, filters, onDetail }) {
  const filtered = (orderTab === '全部' ? orders : orders.filter(o => o.status === orderTab)).filter(o => {
    if (filters.shipTime && !o.shipTime) return false;
    if (filters.shipTime && !o.shipTime.includes(filters.shipTime)) return false;
    return true;
  });
  const cols = ['订单号','三方支付流水订单号','商品ID','三方商品ID','商品类型','商品标题','商家图片','手机号','商品上架渠道','上报渠道','归属渠道','游戏区服','订单状态','结算模式','成本金额(元)','出租金额(元)','押金金额(元)','支付金额(元)','平台抽成(元)','买家实付(元)','支付方式','支付渠道名称','买家实退(元)','卖家结算(元)','创建时间','发货时间','最后操作时间','最后操作人','操作'];
  const stickyTh = { position:'sticky',right:0,zIndex:2,background:'#fafafa' };
  const stickyTd = (bg) => ({ position:'sticky',right:0,zIndex:1,background:bg });
  const titleStyle = { display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden',textOverflow:'ellipsis',lineHeight:1.5,maxWidth:220,wordBreak:'break-all' };
  return (
    <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 4240 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {cols.map(h => (
                  <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', minWidth: 120, ...(h==='操作' ? stickyTh : {}) }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => { const bg = i%2===0?'#fff':'#fafafa';
                return (
                <tr key={item.orderNo} style={{ borderBottom: '1px solid #f0f0f0', background: bg }}>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.orderNo}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.thirdPayNo||'-'}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.productId}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.thirdProductId||'-'}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.type}</td>
                  <td style={{ padding:'8px',borderRight:'1px solid #f0f0f0' }}><div style={titleStyle} title={item.title}>{item.title}</div></td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0',color:'#1890ff',cursor:'pointer' }}>🖼️</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.phone}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.upChannel}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.reportChannel}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.belongChannel}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.server}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}><span style={{ color: item.status==='待发货'?'#1890ff':item.status==='已取消'?'#999':item.status==='已超时'?'#ff4d4f':'#333' }}>{item.status}</span></td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.settleMode}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.cost}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.rent}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.deposit}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.pay}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.fee}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.buyerPay}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.payMethod}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.payChannel}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.buyerRefund||'-'}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.sellerSettle||'-'}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0',fontSize:12 }}>{item.createTime}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0',fontSize:12,color: item.shipTime ? '#333' : '#ccc' }}>{item.shipTime||'-'}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0',fontSize:12 }}>{item.updateTime}</td>
                  <td style={{ textAlign:'center',padding:'8px',borderRight:'1px solid #f0f0f0' }}>{item.operator}</td>
                  <td style={{ padding:'6px 8px',whiteSpace:'nowrap',...stickyTd(bg) }}>
                    <div style={{ display:'flex',flexDirection:'column',gap:4,alignItems:'center' }}>
                      <button onClick={() => onDetail(item)} style={{ border:'none',background:'none',color:'#1890ff',cursor:'pointer',fontSize:13,padding:0 }}>查看详情</button>
                      {item.status === '待发货' && <button style={{ border:'none',background:'none',color:'#1890ff',cursor:'pointer',fontSize:13,padding:0 }}>发货</button>}
                      {(item.status === '待发货' || item.status === '待支付') && <button style={{ border:'none',background:'none',color:'#ff4d4f',cursor:'pointer',fontSize:13,padding:0 }}>取消订单</button>}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, background: 'linear-gradient(to right, transparent, rgba(0,0,0,.06))', pointerEvents: 'none' }} />
      </div>
      <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#bbb' }}>
        <span>← 左右滑动查看更多列 →</span>
        <span>共 {filtered.length} 条数据</span>
      </div>
    </div>
  );
}

function UserTable({ filters }) {
  const users = [
    { id:'101718', phone:'13108922810', avatar:'头像664.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 09:57:16', cancelTime:'', cancelProof:'未上传' },
    { id:'103704', phone:'15792863052', avatar:'头像368.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 09:45:42', cancelTime:'', cancelProof:'未上传' },
    { id:'101717', phone:'18608180042', avatar:'头像434.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 09:08:27', cancelTime:'', cancelProof:'未上传' },
    { id:'101715', phone:'18989171747', avatar:'头像425.webp', nickname:'小蛇', gender:'女', qq:'341900392', status:'启用', regTime:'2026-07-07 17:20:51', cancelTime:'', cancelProof:'未上传' },
    { id:'100802', phone:'17570799092', avatar:'头像937.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-07 11:16:47', cancelTime:'', cancelProof:'未上传' },
    { id:'100803', phone:'13800138001', avatar:'头像118.webp', nickname:'测试用户', gender:'男', qq:'123456789', status:'正常', regTime:'2026-06-15 10:30:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100804', phone:'13800138002', avatar:'头像274.webp', nickname:'', gender:'', qq:'', status:'已注销', regTime:'2026-05-20 14:22:00', cancelTime:'2026-07-01 08:00:00', cancelProof:'已上传' },
    { id:'100805', phone:'13800138003', avatar:'头像356.webp', nickname:'玩家A', gender:'男', qq:'987654321', status:'正常', regTime:'2026-04-10 09:15:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100806', phone:'13800138004', avatar:'头像491.webp', nickname:'', gender:'女', qq:'', status:'正常', regTime:'2026-03-25 16:45:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100807', phone:'13800138005', avatar:'头像533.webp', nickname:'老玩家', gender:'男', qq:'111222333', status:'已注销', regTime:'2026-02-18 11:00:00', cancelTime:'2026-06-15 12:00:00', cancelProof:'已上传' },
    { id:'103703', phone:'15931026883', avatar:'头像440.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 08:59:44', cancelTime:'', cancelProof:'未上传' },
    { id:'101716', phone:'15964025057', avatar:'头像722.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 08:55:38', cancelTime:'', cancelProof:'未上传' },
    { id:'103702', phone:'13038259867', avatar:'头像1080.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 08:31:50', cancelTime:'', cancelProof:'未上传' },
    { id:'101714', phone:'18696126496', avatar:'头像1024.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 07:22:44', cancelTime:'', cancelProof:'未上传' },
    { id:'101713', phone:'19277001568', avatar:'头像357.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 07:22:28', cancelTime:'', cancelProof:'未上传' },
    { id:'103701', phone:'13596501300', avatar:'头像220.webp', nickname:'', gender:'', qq:'', status:'启用', regTime:'2026-07-08 05:22:49', cancelTime:'', cancelProof:'未上传' },
    { id:'100808', phone:'13987654321', avatar:'头像612.webp', nickname:'小明', gender:'男', qq:'222333444', status:'正常', regTime:'2026-01-15 13:00:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100809', phone:'15812340001', avatar:'头像899.webp', nickname:'', gender:'女', qq:'', status:'正常', regTime:'2025-12-01 09:30:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100810', phone:'17711223344', avatar:'头像145.webp', nickname:'游戏达人', gender:'男', qq:'555666777', status:'已注销', regTime:'2025-10-20 16:00:00', cancelTime:'2026-03-01 10:00:00', cancelProof:'已上传' },
    { id:'100811', phone:'13655443322', avatar:'头像763.webp', nickname:'', gender:'', qq:'', status:'正常', regTime:'2025-08-05 11:45:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100812', phone:'18566778899', avatar:'头像328.webp', nickname:'开心果', gender:'女', qq:'888999000', status:'正常', regTime:'2025-06-12 08:15:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100813', phone:'13299887766', avatar:'头像501.webp', nickname:'', gender:'男', qq:'', status:'正常', regTime:'2025-03-28 14:30:00', cancelTime:'', cancelProof:'未上传' },
    { id:'100814', phone:'15634567890', avatar:'头像444.webp', nickname:'狙击手', gender:'男', qq:'123123123', status:'已注销', regTime:'2025-01-10 10:00:00', cancelTime:'2025-11-20 09:00:00', cancelProof:'已上传' },
    { id:'100815', phone:'18799880011', avatar:'头像777.webp', nickname:'', gender:'', qq:'', status:'正常', regTime:'2024-10-05 17:20:00', cancelTime:'', cancelProof:'未上传' },
  ];
  const filtered = users.filter(u => {
    if (filters.keyword && !u.phone.includes(filters.keyword) && !u.nickname.includes(filters.keyword) && !(u.id||'').includes(filters.keyword)) return false;
    if (filters.status && u.status !== filters.status) return false;
    if (filters.regStart && u.regTime < filters.regStart) return false;
    if (filters.regEnd && u.regTime > filters.regEnd) return false;
    return true;
  });
  const getAvatar = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  return (
    <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            {['序号','操作','用户ID','手机号','头像','昵称','性别','联系QQ','用户状态','注册时间','注销时间','注销凭证'].map(h => (
              <th key={h} style={{ textAlign:'center',padding:'10px 12px',fontWeight:600,color:'#333',borderBottom:'1px solid #f0f0f0',whiteSpace:'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((u, i) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>{i+1}</td>
              <td style={{ textAlign:'center',padding:'10px 12px',whiteSpace:'nowrap' }}>
                <button style={{ border:'none',background:'none',color:'#faad14',cursor:'pointer',fontSize:13 }}>禁用</button>
                <span style={{ color:'#ddd',margin:'0 4px' }}>|</span>
                <button style={{ border:'none',background:'none',color:'#1890ff',cursor:'pointer',fontSize:13 }}>绑定用户</button>
                <span style={{ color:'#ddd',margin:'0 4px' }}>|</span>
                <button style={{ border:'none',background:'none',color:'#ff4d4f',cursor:'pointer',fontSize:13 }}>注销</button>
              </td>
              <td style={{ textAlign:'center',padding:'10px 12px',color:'#1890ff' }}>{u.id}</td>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>{u.phone}</td>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>
                <div style={{ display:'flex',justifyContent:'center',alignItems:'center' }}>
                  <img src={getAvatar(u.phone)} alt="" style={{ width:32,height:32,borderRadius:'50%',background:'#f0f0f0' }} />
                </div>
              </td>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>{u.nickname||'-'}</td>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>{u.gender||'-'}</td>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>{u.qq||'-'}</td>
              <td style={{ textAlign:'center',padding:'10px 12px' }}>
                <span style={{ color:'#52c41a',background:'#f6ffed',padding:'2px 8px',borderRadius:3,fontSize:12 }}>{u.status}</span>
              </td>
              <td style={{ textAlign:'center',padding:'10px 12px',fontSize:12,color:'#666' }}>{u.regTime}</td>
              <td style={{ textAlign:'center',padding:'10px 12px',fontSize:12,color:'#666' }}>{u.cancelTime||'-'}</td>
              <td style={{ textAlign:'center',padding:'10px 12px',fontSize:12 }}>{u.cancelProof}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding:'12px 16px',textAlign:'right',fontSize:13,color:'#666',borderTop:'1px solid #f0f0f0' }}>
        共 {filtered.length} 条数据
      </div>
    </div>
  );
}

function WithdrawalTable({ act }) {
  return (
    <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead><tr style={{ background: '#fafafa' }}>
          {['','用户','金额','打款账户','状态','申请时间','操作'].map(h => <th key={h} style={{ textAlign:'left',padding:'10px 12px',fontWeight:600,color:'#333',borderBottom:'1px solid #f0f0f0' }}>{h}</th>)}
        </tr></thead>
        <tbody><tr><td colSpan={7} style={{ textAlign:'center',padding:40,color:'#999' }}>点击查询加载提现数据</td></tr></tbody>
      </table>
    </div>
  );
}

function TestAccountTable({ accounts, onDisable, onCancel }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = accounts.length;
  const totalPages = Math.ceil(total / pageSize);
  const paged = accounts.slice((page - 1) * pageSize, page * pageSize);
  const now = new Date().toISOString();
  const effStatus = (a) => {
    if (a.status === '已注销') return '已注销';
    if (a.expireEnd && a.expireEnd < now) return '已过期';
    return a.status;
  };
  return (
    <div style={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
      {accounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14 }}>暂无测试账号数据</div>
          <div style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>点击"申请测试账号"按钮创建</div>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {['序号','操作','用户ID','手机号','头像','是否实名','是否支付宝验证','用户状态','有效期','注销时间','注销凭证'].map(h => (
                <th key={h} style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? (effStatus(item) === '已过期' ? '#fafafa' : '#fff') : (effStatus(item) === '已过期' ? '#f5f5f5' : '#fafafa'), opacity: effStatus(item) === '已过期' ? 0.7 : 1 }}>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>{i + 1}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                  {effStatus(item) !== '已注销' && effStatus(item) !== '已过期' && (
                    <button onClick={() => onDisable(item.id)} style={{ border: 'none', background: 'none', color: item.status === '禁用' ? '#52c41a' : '#faad14', cursor: 'pointer', fontSize: 13 }}>
                      {item.status === '禁用' ? '启用' : '禁用'}
                    </button>
                  )}
                  {effStatus(item) !== '已注销' && effStatus(item) !== '已过期' ? (
                    <button onClick={() => onCancel(item.id)} style={{ border: 'none', background: 'none', color: item.status === '已注销' ? '#bbb' : '#ff4d4f', cursor: 'pointer', fontSize: 13 }}>
                      {item.status === '已注销' ? '已注销' : '注销'}
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#bbb' }}>-</span>
                  )}
                  </div>
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#1890ff' }}>{item.id}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>{item.phone}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={item.avatar} alt="头像" style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0' }} />
                  </div>
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <span style={{ color: item.realName === '已实名' ? '#52c41a' : '#999' }}>{item.realName}</span>
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <span style={{ color: item.alipay === '已验证' ? '#52c41a' : '#999' }}>{item.alipay}</span>
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <span style={{
                    color: effStatus(item) === '启用' ? '#52c41a' : effStatus(item) === '禁用' ? '#faad14' : '#999',
                    background: effStatus(item) === '启用' ? '#f6ffed' : effStatus(item) === '禁用' ? '#fffbe6' : '#f5f5f5',
                    padding: '2px 8px', borderRadius: 3, fontSize: 12
                  }}>{effStatus(item)}</span>
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px', fontSize: 11, color: item.expireEnd ? '#666' : '#1890ff' }}>{item.expireEnd ? `${item.expireStart?.slice(0,10)} ~ ${item.expireEnd?.slice(0,10)}` : '永久'}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', fontSize: 12, color: '#666' }}>{item.cancelTime || '-'}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', fontSize: 12 }}>{item.cancelProof}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f0f0f0', fontSize: 13, color: '#666' }}>
        <span>共 {total} 条</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => setPage(1)} disabled={page === 1} style={{ border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', padding: '4px 8px', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : '#333', fontSize: 12 }}>&lt;&lt;</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', padding: '4px 8px', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : '#333', fontSize: 12 }}>&lt;</button>
          {Array.from({length: totalPages}, (_, i) => i + 1).filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2).map((n, idx, arr) => (
            <span key={n}>
              {idx > 0 && arr[idx-1] !== n - 1 && <span style={{ color: '#ccc' }}>...</span>}
              <button onClick={() => setPage(n)} style={{ border: '1px solid ' + (n === page ? '#1890ff' : '#d9d9d9'), borderRadius: 2, background: n === page ? '#1890ff' : '#fff', color: n === page ? '#fff' : '#333', padding: '4px 8px', minWidth: 28, cursor: 'pointer', fontSize: 12 }}>{n}</button>
            </span>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', padding: '4px 8px', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : '#333', fontSize: 12 }}>&gt;</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff', padding: '4px 8px', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : '#333', fontSize: 12 }}>&gt;&gt;</button>
        </div>
      </div>
    </div>
  );
}


function SystemSwitchList({ switches, onToggle, onEnter }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>系统开关</span>
        <span style={{ fontSize: 12, color: "#999", marginLeft: 12 }}>管理平台各项功能的开启与关闭</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
        {switches.map(s => (
          <div key={s.key} onClick={() => s.type === "group" && onEnter(s.key)}
            style={{ background: "#fff", borderRadius: 2, padding: "20px 24px", border: "1px solid #f0f0f0", cursor: s.type === "group" ? "pointer" : "default" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{s.name}</span>
              {s.type === "simple" ? (
                <button onClick={(e) => { e.stopPropagation(); onToggle(s.key); }}
                  style={{ minWidth: 56, height: 28, borderRadius: 14, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: s.status ? "#52c41a" : "#d9d9d9", color: "#fff" }}>
                  {s.status ? "开" : "关"}
                </button>
              ) : (
                <span style={{ fontSize: 13, color: "#1890ff", fontWeight: 500 }}>{"配置 ›"}</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 8, lineHeight: 1.5 }}>{s.desc}</div>
            {s.type === "group" ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {s.children.map(c => (
                  <span key={c.key} style={{ fontSize: 11, padding: "1px 8px", borderRadius: 2, background: c.status ? "#f6ffed" : "#f5f5f5", color: c.status ? "#52c41a" : "#999", border: `1px solid ${c.status ? "#b7eb8f" : "#d9d9d9"}` }}>{c.label}</span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#bbb" }}>{s.updatedAt} {"·"} {s.updatedBy}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemSwitchDetail({ group, onToggle, onBack }) {
  const [saving, setSaving] = useState(false);
  const toggleAll = (val) => group.children.forEach(c => { if (c.status !== val) onToggle(c.key); });
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#fff", marginBottom: 12, borderRadius: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{group.name} {"—"} 场景配置</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => toggleAll(false)} style={{ height: 28, padding: "0 14px", border: "1px solid #ff4d4f", borderRadius: 2, background: "#fff", color: "#ff4d4f", fontSize: 12, cursor: "pointer" }}>关闭全部</button>
          <button onClick={() => toggleAll(true)} style={{ height: 28, padding: "0 14px", border: "1px solid #52c41a", borderRadius: 2, background: "#fff", color: "#52c41a", fontSize: 12, cursor: "pointer" }}>开启全部</button>
          <button onClick={onBack} style={{ height: 32, padding: "0 16px", border: "1px solid #d9d9d9", borderRadius: 2, background: "#fff", cursor: "pointer", fontSize: 13 }}>返 回</button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 2, margin: "0 20px", padding: "16px 20px" }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>{group.desc}</div>
        {group.children.map(c => (
          <div key={c.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ fontSize: 14, color: "#333" }}>{c.label}</span>
            <button onClick={() => onToggle(c.key)}
              style={{ minWidth: 56, height: 28, borderRadius: 14, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: c.status ? "#52c41a" : "#d9d9d9", color: "#fff" }}>
              {c.status ? "开" : "关"}
            </button>
          </div>
        ))}
      </div>
      <div style={{ margin: "20px 20px 0", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setSaving(true)} style={{ height: 32, padding: "0 20px", border: "none", borderRadius: 2, background: "#1890ff", color: "#fff", fontSize: 13, cursor: "pointer" }}>保存配置</button>
      </div>
      {saving && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setSaving(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} />
          <div style={{ position: "relative", width: 420, background: "#fff", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,.15)", padding: "32px 32px 24px" }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 22, lineHeight: 1 }}>
                <span style={{ color: "#faad14" }}>{"⚠"}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(0,0,0,.85)", marginBottom: 4 }}>保存{group.name}配置</div>
                <div style={{ fontSize: 13, color: "rgba(0,0,0,.45)", marginBottom: 8 }}>保存后{group.name}配置如下：</div>
                <div style={{ fontSize: 14, color: "rgba(0,0,0,.65)", lineHeight: 1.8 }}>
                  {group.children.map(c => (
                    <div key={c.key}>{c.label}：{c.status
                      ? <span style={{ color: "#52c41a" }}>{group.key === "realname" ? "需要实名" : "已开启"}</span>
                      : <span style={{ color: "#999" }}>{group.key === "realname" ? "不需要实名" : "已关闭"}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setSaving(false)} style={{ height: 32, padding: "0 16px", border: "1px solid #d9d9d9", borderRadius: 2, background: "#fff", color: "rgba(0,0,0,.65)", fontSize: 14, cursor: "pointer" }}>取 消</button>
              <button onClick={() => setSaving(false)} style={{ height: 32, padding: "0 16px", border: "none", borderRadius: 2, background: "#1890ff", color: "#fff", fontSize: 14, cursor: "pointer" }}>确 定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
