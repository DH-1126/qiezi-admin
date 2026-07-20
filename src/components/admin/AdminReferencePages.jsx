import { useMemo, useRef, useState } from 'react';
import './AdminReferencePages.css';

const paymentSeed = [
  ['2026071724628','2077933670555029577','104119','17779281115','1.25','微信扫码支付','支付成功','2026-07-17 09:49:27','2026-07-17 09:50:07'],
  ['2026071624626','2077582847086006327','104134','19900000015','505.44','微信扫码支付','已超时','2026-07-16 10:35:25',''],
  ['2026071524624','2077362431356669962','154420049','18942914435','365.04','余额支付','支付成功','2026-07-15 19:59:33','2026-07-15 19:59:34'],
  ['2026071524623','2077362422959673345','154420049','18942914435','365.04','微信扫码支付','已超时','2026-07-15 19:59:31',''],
  ['2026071524621','2077360548521021452','104123','19900000013','85.63','微信JSAPI支付','已超时','2026-07-15 19:52:04',''],
  ['2026071524620','2077360542237954051','104123','19900000013','85.63','支付宝H5支付','已超时','2026-07-15 19:52:03',''],
  ['2026071524618','2077360514916257888','104123','19900000013','60.47','微信扫码支付','已超时','2026-07-15 19:51:56',''],
  ['2026071524616','2077358081347522628','104123','19900000013','169.01','支付宝H5支付','已超时','2026-07-15 19:42:16',''],
  ['2026071524613','2077314204779515968','154420049','18942914435','103.85','余额支付','支付成功','2026-07-15 16:47:55','2026-07-15 16:47:56'],
  ['2026071524612','2077314197674364961','154420049','18942914435','103.85','微信扫码支付','已超时','2026-07-15 16:47:54',''],
].map((row, index) => ({ id: index + 1, orderNo: row[0], thirdNo: row[1], userId: row[2], phone: row[3], amount: row[4], method: row[5], status: row[6], createTime: row[7], payTime: row[8] }));

const refundSeed = [
  ['2026071524624','2077362431356669962','2077362620423311409','154420049','18942914435','-','365.04','余额支付','成功','2026-07-15 20:00:18','2026-07-15 20:00:18'],
  ['2026071524613','2077314204779515968','2077362263420932175','154420049','18942914435','-','103.85','余额支付','成功','2026-07-15 19:58:53','2026-07-15 19:58:53'],
  ['2026070824548','2074684543939481684','2074730182652039199','104092','18986617726','-','3.2','微信','成功','2026-07-08 13:39:56','2026-07-08 13:39:56'],
  ['2026070824554','2074685835378266204','2074730167502213167','154419284','13006360951','-','7.22','支付宝','成功','2026-07-08 13:39:53','2026-07-08 13:39:53'],
  ['2026070824560','2074686540977639453','2074730155682664539','154420049','18942914435','-','3.2','余额支付','成功','2026-07-08 13:39:50','2026-07-08 13:39:50'],
  ['2026070824544','2074684102694506564','2074730141438808153','154460680','18321859027','-','4.3','微信','成功','2026-07-08 13:39:47','2026-07-08 13:39:47'],
  ['2026061324396','2065676682307670090','2074038092045586437','154420049','18942914435','-','97.12','余额支付','成功','2026-07-06 15:49:49','2026-07-06 15:49:49'],
  ['2026061324401','2065677252187754573','2074037941818200064','154420049','18942914435','-','156.42','余额支付','成功','2026-07-06 15:49:13','2026-07-06 15:49:13'],
  ['2026063024494','2071866726450040926','2071867354563842083','154420045','18942914433','-','4.3','支付宝H5','成功','2026-06-30 16:04:05','2026-06-30 16:04:05'],
  ['2026063024492','2071866571155935322','2071867342773653563','154420045','18942914433','-','38.2','-','成功','2026-06-30 16:04:02','2026-06-30 16:04:02'],
].map((row, index) => ({ id: index + 1, orderNo: row[0], payNo: row[1], refundNo: row[2], userId: row[3], phone: row[4], account: row[5], amount: row[6], method: row[7], status: row[8], createTime: row[9], refundTime: row[10] }));

const accountSeed = [
  ['104123','19900000013','否','',20,20,0,0],['154419373','17779287745','否','',7335162,7335162,0,664838],['39483','','是','',100000,100000,0,0],
  ['154400002','17777777777','否','',11.44,11.44,0,0],['156770582','18963615801','否','',1,1,0,0],['104055','18745931234','否','',10,10,0,0],
  ['104045','18942910012','否','',20,20,0,0],['104044','18942910011','是','',10,10,0,0],['154390051','17688930790','否','',1000,1000,0,0],
  ['154422630','19900000010','否','',5900,5900,0,100],
].map((row, index) => ({ id: index + 1, userId: row[0], phone: row[1], recharge: row[2], account: row[3], total: row[4], available: row[5], transit: row[6], withdrawing: row[7] }));

const withdrawalAmounts = [23432, 53455, 23444, 34343, 55533, 55555, 55555, 55555, 55555];
const withdrawalSeed = [
  { id: 1, userId:'154420045', name:'胡泰康', phone:'18942914433', amount:10, tax:0, channelFee:0, beforeTax:'', month:'', monthTotal:'', taxDue:'', taxPaid:'', taxSupplement:'', received:10, account:'157011905@qq.com', accountName:'詹志威', accountPhone:'', cardNo:'420117199312133552', status:'审核中', operator:'詹志威', operationTime:'2026-07-16 11:40:03', submitTime:'2026-07-16 11:40:03' },
  ...withdrawalAmounts.map((amount, index) => { const tax = Number((amount * .16 + (amount > 50000 ? 244.4 : 0)).toFixed(2)); return { id:index+2, userId:'154419373', name:'许宏杰', phone:'17779287745', amount, tax:0, channelFee:0, beforeTax:amount, month:'202607', monthTotal:amount, taxDue:tax, taxPaid:0, taxSupplement:tax, received:Number((amount-tax).toFixed(2)), account:'17779287745', accountName:'许宏杰', accountPhone:'', cardNo:'362428199806236518', status:'待打款', operator:'18942914433', operationTime:'2026-07-16 09:37:16', submitTime:`2026-07-14 14:48:${String(53-index*3).padStart(2,'0')}` }; }),
];

const auditSeed = [
  { id:1, productNo:'3135924332', title:'登录区服:微信 总资产：50 M 纯币资产：45 M 角色：不破誓约 水墨云图 账密：扫码登录 段位：白银 安全箱：3x3 靶场等级：5级 账号等级：50 训练中心：6级 刀皮：暗星 处刑者', server:'微信', userId:'104134', phone:'19900000015', cost:136.37, rent:150.01, deposit:7, days:5, status:'待审核', auditor:'', auditTime:'', submitTime:'2026-07-16 10:13:19' },
  { id:2, productNo:'3135924335', title:'登录区服:QQ 总资产：128 M 纯币资产：76 M 账密：扫码登录 段位：黄金 安全箱：2x3 训练中心：7级', server:'QQ', userId:'104092', phone:'18986617726', cost:220, rent:242, deposit:200, days:3, status:'待审核', auditor:'', auditTime:'', submitTime:'2026-07-16 09:42:17' },
  { id:3, productNo:'3135924298', title:'登录区服:微信 总资产：310 M 纯币资产：180 M 段位：铂金 刀皮：信条', server:'微信', userId:'154420045', phone:'18942914433', cost:420, rent:462, deposit:500, days:7, status:'已通过', auditor:'邓辉', auditTime:'2026-07-15 18:06:12', submitTime:'2026-07-15 17:58:09' },
  { id:4, productNo:'3135924284', title:'登录区服:QQ 总资产：62 M 纯币资产：38 M 账号等级：60 训练中心：5级', server:'QQ', userId:'104123', phone:'19900000013', cost:88, rent:96.8, deposit:100, days:2, status:'已拒绝', auditor:'邓辉', auditTime:'2026-07-15 15:20:43', submitTime:'2026-07-15 15:12:02' },
];

const conversationSeed = [
  ['CS202607170018','2026-07-17 10:06:21','2026-07-17 10:21:08','已结束','邓辉','154420049','咨询租用时长及押金退回'],
  ['CS202607170017','2026-07-17 09:42:35','2026-07-17 09:55:12','已结束','顾修鸣','104134','支付后未进入待发货'],
  ['CS202607170016','2026-07-17 09:18:44','','进行中','王永祁','154420045','需要协助联系号主'],
  ['CS202607160083','2026-07-16 20:11:09','2026-07-16 20:30:17','已结束','邓辉','104123','扫码登录问题'],
  ['CS202607160079','2026-07-16 18:35:26','2026-07-16 18:48:03','已结束','顾修鸣','104092','退款到账时间'],
  ['CS202607160071','2026-07-16 16:22:10','2026-07-16 16:31:46','已结束','王永祁','154419373','提现审核进度'],
  ['CS202607160066','2026-07-16 15:08:51','','排队中','','154419284','商品审核咨询'],
  ['CS202607160052','2026-07-16 13:47:18','2026-07-16 14:03:27','已结束','邓辉','154460680','租用中账号异常'],
].map((row, index) => ({ id:index+1, sessionId:row[0], start:row[1], end:row[2], status:row[3], agent:row[4], userId:row[5], remark:row[6], type:index % 3 === 0 ? '履约咨询' : '用户进线咨询' }));

function matches(row, filters, fields) {
  return Object.entries(filters).every(([key, value]) => {
    if (!value) return true;
    if (key === 'start' || key === 'end') return true;
    const field = fields[key] || key;
    return String(row[field] ?? '').toLowerCase().includes(String(value).trim().toLowerCase());
  });
}

function inDateRange(value, start, end) {
  if (!start && !end) return true;
  const date = String(value || '').slice(0, 10);
  if (!date) return false;
  return (!start || date >= start) && (!end || date <= end);
}

function hasActiveFilters(filters) {
  return Object.values(filters).some(value => String(value || '').trim() !== '');
}

function exportCsv(name, columns, rows) {
  const content = [columns.map(c => c.label), ...rows.map(row => columns.map(c => String(typeof c.value === 'function' ? c.value(row) : row[c.key] ?? '')))]
    .map(line => line.map(value => `"${value.replaceAll('"','""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([`\ufeff${content}`], { type:'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function FilterInput({ value, onChange, placeholder, className = '', type = 'text' }) {
  return <input type={type} className={`reference-input ${className}`} value={value} onInput={type==='date'?e=>onChange(e.currentTarget.value):undefined} onChange={e => onChange(e.target.value)} placeholder={placeholder} />;
}

function DateRangeFilter({ label, start, end, onStart, onEnd }) {
  return <label className="reference-date-range"><span>{label}</span><FilterInput type="date" className="reference-date" value={start} onChange={onStart}/><em>→</em><FilterInput type="date" className="reference-date" value={end} onChange={onEnd}/></label>;
}

function Pagination({ total, pages = 5, totalPages = 1 }) {
  return <div className="reference-pagination"><span>共 {total} 条数据</span>{Array.from({length:Math.min(pages,totalPages)},(_,i)=>i+1).map(page=><button key={page} className={`reference-page-number ${page===1?'active':''}`}>{page}</button>)}{totalPages>pages&&<><span>•••</span><button className="reference-page-number">{totalPages}</button></>}<select className="reference-select" style={{minWidth:90,width:90}} defaultValue="10"><option value="10">10 条/页</option><option value="20">20 条/页</option></select></div>;
}

function DataTable({ columns, rows, minWidth = 1100, selected, onSelect, selectable = false, total, totalPages = 1, stickyLast = false }) {
  const selectableRows = rows.filter(row => row.selectable !== false);
  const allSelected = selectable && selectableRows.length > 0 && selectableRows.every(row => selected?.has(row.id));
  return <div className="reference-card">
    <div className="reference-tools"><span>↻</span><span>↕</span><span>⚙</span></div>
    <div className="reference-table-wrap">
      <table className="reference-table" style={{minWidth}}>
        <thead><tr>{selectable&&<th style={{width:48}}><input type="checkbox" checked={allSelected} onChange={e=>onSelect(e.target.checked ? new Set(selectableRows.map(r=>r.id)) : new Set())}/></th>}{columns.map((col,index)=><th key={col.key} className={stickyLast&&index===columns.length-1?'reference-sticky-last':''} style={{width:col.width}}>{col.label}</th>)}</tr></thead>
        <tbody>{rows.map(row=><tr key={row.id}>{selectable&&<td><input type="checkbox" checked={selected?.has(row.id)||false} disabled={row.selectable===false} onChange={()=>{const next=new Set(selected);if(next.has(row.id))next.delete(row.id);else next.add(row.id);onSelect(next);}}/></td>}{columns.map((col,index)=><td key={col.key} className={`${col.align==='left'?'reference-left':''} ${stickyLast&&index===columns.length-1?'reference-sticky-last':''}`}>{col.render?col.render(row):(row[col.key] === '' || row[col.key] == null ? '-' : row[col.key])}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <Pagination total={total ?? rows.length} totalPages={totalPages}/>
  </div>;
}

function Modal({ title, children, onClose, footer, large = false, className = '' }) {
  return <div className="reference-modal-mask" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className={`reference-modal ${large?'large':''} ${className}`}><div className="reference-modal-header"><span>{title}</span><button className="reference-modal-close" onClick={onClose}>×</button></div><div className="reference-modal-body">{children}</div>{footer&&<div className="reference-modal-footer">{footer}</div>}</div></div>;
}

function useToast() {
  const [toast,setToast]=useState('');
  const show = text => { setToast(text); window.setTimeout(()=>setToast(''),1800); };
  return [toast,show];
}

export function ConversationRecordsPage() {
  const [tab,setTab]=useState('用户进线咨询');
  const [filters,setFilters]=useState({start:'',end:'',status:'',agent:''});
  const rows=useMemo(()=>conversationSeed.filter(row=>row.type===tab&&matches(row,filters,{})&&inDateRange(row.start,filters.start,filters.end)),[tab,filters]);
  const filtered=hasActiveFilters(filters);
  const columns=[
    {key:'sessionId',label:'会话ID',width:170},{key:'start',label:'会话开始时间',width:180},{key:'end',label:'会话结束时间',width:180},
    {key:'status',label:'会话状态',width:110,render:r=><span className={`reference-status ${r.status==='进行中'?'wait':r.status==='排队中'?'error':''}`}>{r.status}</span>},
    {key:'agent',label:'客服姓名',width:110},{key:'userId',label:'用户ID',width:120},{key:'remark',label:'备注',width:240,align:'left'},
    {key:'action',label:'操作',width:100,render:()=> <button className="reference-link" title="参考文件未提供会话详情页">查看</button>},
  ];
  return <div className="reference-page">
    <div className="reference-tabs"><button className={`reference-tab ${tab==='用户进线咨询'?'active':''}`} onClick={()=>setTab('用户进线咨询')}>用户进线咨询</button><button className={`reference-tab ${tab==='履约咨询'?'active':''}`} onClick={()=>setTab('履约咨询')}>履约咨询</button></div>
    <div className="reference-filter"><DateRangeFilter label="会话时间" start={filters.start} end={filters.end} onStart={value=>setFilters({...filters,start:value})} onEnd={value=>setFilters({...filters,end:value})}/><label>会话状态 <select className="reference-select" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">会话状态</option><option>进行中</option><option>已结束</option><option>排队中</option></select></label><label>客服名称 <FilterInput placeholder="客服名称" value={filters.agent} onChange={value=>setFilters({...filters,agent:value})}/></label><button className="reference-button primary">搜 索</button><button className="reference-button" onClick={()=>setFilters({start:'',end:'',status:'',agent:''})}>重 置</button><button className="reference-button" onClick={()=>exportCsv('会话记录',columns,rows)}>导 出</button></div>
    <DataTable columns={columns} rows={rows} total={filtered?rows.length:86} totalPages={filtered?1:9}/>
  </div>;
}

export function PaymentFlowPage() {
  const [rows,setRows]=useState(paymentSeed);
  const [filters,setFilters]=useState({start:'',end:'',status:'',method:'',orderNo:'',phone:'',userId:'',thirdNo:''});
  const [toast,showToast]=useToast();
  const visible=rows.filter(row=>matches(row,filters,{})&&inDateRange(row.payTime,filters.start,filters.end));
  const filtered=hasActiveFilters(filters);
  const retry=row=>{setRows(current=>current.map(item=>item.id===row.id?{...item,status:'重试中'}:item));showToast(`已重新发起订单 ${row.orderNo} 的支付查询`);};
  const columns=[{key:'orderNo',label:'订单号',width:150},{key:'thirdNo',label:'三方支付流水订单号',width:205},{key:'userId',label:'用户ID',width:110},{key:'phone',label:'手机号',width:130},{key:'amount',label:'实付金额（元）',width:120},{key:'method',label:'支付方式',width:130},{key:'status',label:'支付状态',width:110,render:r=><span className={`reference-status ${r.status==='已超时'?'error':r.status==='重试中'?'wait':''}`}>{r.status}</span>},{key:'createTime',label:'创建时间',width:175},{key:'payTime',label:'支付时间',width:175},{key:'action',label:'操作',width:90,render:r=>r.status==='已超时'?<button className="reference-link" onClick={()=>retry(r)}>重试</button>:'-'}];
  return <div className="reference-page">{toast&&<div className="reference-toast">✓ {toast}</div>}<div className="reference-filter"><DateRangeFilter label="支付时间" start={filters.start} end={filters.end} onStart={value=>setFilters({...filters,start:value})} onEnd={value=>setFilters({...filters,end:value})}/><label>支付状态 <select className="reference-select" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">全部</option><option>支付成功</option><option>已超时</option><option>重试中</option></select></label><label>支付方式 <select className="reference-select" value={filters.method} onChange={e=>setFilters({...filters,method:e.target.value})}><option value="">全部</option><option>微信扫码支付</option><option>微信JSAPI支付</option><option>支付宝H5支付</option><option>余额支付</option></select></label><label>订单号 <FilterInput placeholder="订单号" value={filters.orderNo} onChange={value=>setFilters({...filters,orderNo:value})}/></label><label>手机号 <FilterInput placeholder="手机号" value={filters.phone} onChange={value=>setFilters({...filters,phone:value})}/></label><label>用户ID <FilterInput placeholder="用户ID" value={filters.userId} onChange={value=>setFilters({...filters,userId:value})}/></label><label>三方支付流水订单号 <FilterInput className="reference-wide" placeholder="三方支付流水订单号" value={filters.thirdNo} onChange={value=>setFilters({...filters,thirdNo:value})}/></label><button className="reference-button primary">搜 索</button><button className="reference-button" onClick={()=>setFilters({start:'',end:'',status:'',method:'',orderNo:'',phone:'',userId:'',thirdNo:''})}>重 置</button><button className="reference-button" onClick={()=>exportCsv('支付流水',columns,visible)}>导 出</button></div><DataTable columns={columns} rows={visible} minWidth={1510} total={filtered?visible.length:6404} totalPages={filtered?1:641}/></div>;
}

export function RefundFlowPage() {
  const [filters,setFilters]=useState({start:'',end:'',status:'',method:'',orderNo:'',payNo:'',refundNo:'',userId:'',phone:''});
  const visible=refundSeed.filter(row=>matches(row,filters,{})&&inDateRange(row.refundTime,filters.start,filters.end));
  const filtered=hasActiveFilters(filters);
  const columns=[{key:'orderNo',label:'订单号',width:150},{key:'payNo',label:'三方支付流水订单号',width:205},{key:'refundNo',label:'三方退款流水订单号',width:205},{key:'userId',label:'用户ID',width:110},{key:'phone',label:'手机号',width:130},{key:'account',label:'退款账户信息',width:140},{key:'amount',label:'退款金额（元）',width:125},{key:'method',label:'支付方式',width:120},{key:'status',label:'退款状态',width:100,render:r=><span className="reference-status">{r.status}</span>},{key:'createTime',label:'创建时间',width:175},{key:'refundTime',label:'退款时间',width:175},{key:'action',label:'操作',width:80,render:()=>'-'}];
  return <div className="reference-page"><div className="reference-filter"><DateRangeFilter label="退款时间" start={filters.start} end={filters.end} onStart={value=>setFilters({...filters,start:value})} onEnd={value=>setFilters({...filters,end:value})}/><label>退款状态 <select className="reference-select" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">全部</option><option>成功</option><option>处理中</option><option>失败</option></select></label><label>支付方式 <select className="reference-select" value={filters.method} onChange={e=>setFilters({...filters,method:e.target.value})}><option value="">全部</option><option>微信</option><option>支付宝</option><option>余额支付</option></select></label><label>订单号 <FilterInput placeholder="订单号" value={filters.orderNo} onChange={value=>setFilters({...filters,orderNo:value})}/></label><label>三方支付流水订单号 <FilterInput className="reference-wide" placeholder="三方支付流水订单号" value={filters.payNo} onChange={value=>setFilters({...filters,payNo:value})}/></label><label>三方退款流水订单号 <FilterInput className="reference-wide" placeholder="三方退款流水订单号" value={filters.refundNo} onChange={value=>setFilters({...filters,refundNo:value})}/></label><label>用户ID <FilterInput placeholder="用户ID" value={filters.userId} onChange={value=>setFilters({...filters,userId:value})}/></label><label>手机号 <FilterInput placeholder="手机号" value={filters.phone} onChange={value=>setFilters({...filters,phone:value})}/></label><button className="reference-button primary">搜 索</button><button className="reference-button" onClick={()=>setFilters({start:'',end:'',status:'',method:'',orderNo:'',payNo:'',refundNo:'',userId:'',phone:''})}>重 置</button><button className="reference-button" onClick={()=>exportCsv('退款流水',columns,visible)}>导 出</button></div><DataTable columns={columns} rows={visible} minWidth={1720} total={filtered?visible.length:1268} totalPages={filtered?1:127}/></div>;
}

function toAuditDetailProduct(row) {
  const detailPreset={
    1:{safeBox:'3x3',shootingRange:'5级',loginMethod:'扫码登录',accountLevel:'50',rank:'白银',totalAsset:'50',pureCoin:'45',trainingCenter:'6级',knifeSkins:'暗星、处刑者'},
    2:{safeBox:'2x3',shootingRange:'7级',loginMethod:'账密登录',accountLevel:'60',rank:'黄金',totalAsset:'128',pureCoin:'76',trainingCenter:'7级',knifeSkins:'坠星者'},
    3:{safeBox:'3x3',shootingRange:'6级',loginMethod:'扫码登录',accountLevel:'60',rank:'铂金',totalAsset:'310',pureCoin:'180',trainingCenter:'6级',knifeSkins:'信条'},
    4:{safeBox:'2x2',shootingRange:'5级',loginMethod:'账密登录',accountLevel:'60',rank:'黄金',totalAsset:'62',pureCoin:'38',trainingCenter:'5级',knifeSkins:'/'},
  }[row.id]||{};
  return {
    id:`audit-${row.id}`,productNo:row.productNo,thirdProductId:'',productType:'自建商品',channel:'PC',gameServer:row.server,sellerId:row.userId,phone:row.phone,
    title:row.title,cost:row.cost,rent:row.rent,deposit:row.deposit,sellerDeposit:row.deposit,rentDays:row.days,image:`${import.meta.env.BASE_URL}assets/card-placeholder.png`,
    auditResult:row.status==='已通过'?'审核通过':row.status==='已拒绝'?'审核不通过':'待审核',auditTime:row.auditTime,auditor:row.auditor,submitTime:row.submitTime,offlineTime:'',
    faceOwner:'是',remark:'商品审核数据，用于后台详情核验。',accountType:'纯币号',ratioSetting:'租期内打完 买家-36,卖家-35',awmAmmo:'/',ownerGift:'/',gunSkins:'/',operatorSkins:'/',helmet6:'/',armor6:'/',redAmmo:'/',card33:'/',barrett:'/',banRecord:'无封禁记录',commonLoginArea:'/',
    ...detailPreset,
  };
}

export function ProductAuditPage({ onOpenDetail }) {
  const [rows,setRows]=useState(auditSeed);
  const [tab,setTab]=useState('待审核');
  const [selected,setSelected]=useState(new Set());
  const [filters,setFilters]=useState({start:'',end:'',userId:'',phone:'',title:''});
  const [pendingAction,setPendingAction]=useState(null);
  const [rejectReason,setRejectReason]=useState('重复上架');
  const [toast,showToast]=useToast();
  const visible=rows.filter(row=>(tab==='待审核'?row.status==='待审核':row.status!=='待审核')&&matches(row,filters,{})&&inDateRange(row.submitTime,filters.start,filters.end));
  const openAuditAction=(type,ids)=>{setPendingAction({type,ids});if(type==='拒绝')setRejectReason('重复上架');};
  const closeAuditAction=()=>setPendingAction(null);
  const confirmAction=()=>{const {type,ids}=pendingAction;const status=type==='通过'?'已通过':'已拒绝';const time='2026-07-17 14:30:00';setRows(current=>current.map(row=>ids.includes(row.id)?{...row,status,auditor:'邓辉',auditTime:time,rejectReason:type==='拒绝'?rejectReason:''}:row));setSelected(new Set());setPendingAction(null);showToast(`已${type} ${ids.length} 条商品审核记录`);};
  const columns=[{key:'productNo',label:'商品编号',width:140},{key:'title',label:'商品标题',width:260,align:'left',render:r=><div className="reference-title-cell" title={r.title}>{r.title}</div>},{key:'image',label:'商品图片',width:95,render:()=> <div className="audit-thumb"><img src="./assets/card-placeholder.png" alt="商品图片"/><span>1张</span></div>},{key:'server',label:'游戏区服',width:90},{key:'userId',label:'用户ID',width:110},{key:'phone',label:'手机号',width:130},{key:'cost',label:'成本金额(元)',width:120},{key:'rent',label:'出租金额(元)',width:120},{key:'deposit',label:'押金金额(元)',width:120},{key:'days',label:'推荐租期(天)',width:120},{key:'status',label:'审核状态',width:100,render:r=><span className={`reference-status ${r.status==='待审核'?'wait':r.status==='已拒绝'?'error':''}`}>{r.status}</span>},{key:'auditor',label:'审核人',width:100},{key:'auditTime',label:'审核时间',width:175},{key:'submitTime',label:'提交时间',width:175},{key:'action',label:'操作',width:180,render:r=><><button className="reference-link" onClick={()=>onOpenDetail(toAuditDetailProduct(r))}>查看详情</button>{r.status==='待审核'&&<><button className="reference-link" onClick={()=>openAuditAction('通过',[r.id])}>通过</button><button className="reference-link red" onClick={()=>openAuditAction('拒绝',[r.id])}>拒绝</button></>}</>}];
  return <div className="reference-page">{toast&&<div className="reference-toast">{toast}</div>}<div className="reference-tabs"><button className={`reference-tab ${tab==='待审核'?'active':''}`} onClick={()=>{setTab('待审核');setSelected(new Set());}}>待审核 <span className="reference-badge">{rows.filter(r=>r.status==='待审核').length}</span></button><button className={`reference-tab ${tab==='已审核'?'active':''}`} onClick={()=>{setTab('已审核');setSelected(new Set());}}>已审核 <span className="reference-badge">{rows.filter(r=>r.status!=='待审核').length}</span></button></div><div className="reference-filter"><DateRangeFilter label="提交时间" start={filters.start} end={filters.end} onStart={value=>setFilters({...filters,start:value})} onEnd={value=>setFilters({...filters,end:value})}/><FilterInput className="reference-wide" placeholder="请输入用户ID" value={filters.userId} onChange={value=>setFilters({...filters,userId:value})}/><FilterInput className="reference-wide" placeholder="请输入手机号" value={filters.phone} onChange={value=>setFilters({...filters,phone:value})}/><FilterInput className="reference-wide" placeholder="请输入商品标题" value={filters.title} onChange={value=>setFilters({...filters,title:value})}/><button className="reference-button">查 询</button><button className="reference-button" onClick={()=>setFilters({start:'',end:'',userId:'',phone:'',title:''})}>重 置</button><button className="reference-button" onClick={()=>exportCsv('商品审核',columns,visible)}>导 出</button><button className="reference-button" disabled={!selected.size||tab!=='待审核'} onClick={()=>openAuditAction('通过',[...selected])}>批量通过</button><button className="reference-button" disabled={!selected.size||tab!=='待审核'} onClick={()=>openAuditAction('拒绝',[...selected])}>批量拒绝</button></div><div className="reference-alert">{selected.size?`已选择 ${selected.size} 项`:'未选中任何数据'}</div><DataTable columns={columns} rows={visible} minWidth={2050} selected={selected} onSelect={setSelected} selectable total={visible.length}/>{pendingAction?.type==='通过'&&<div className="reference-modal-mask"><div className="withdrawal-prompt-modal"><div className="withdrawal-prompt-content"><span className="withdrawal-warning-icon">!</span><div><h3>提示</h3><p>是否确认审核通过?</p></div></div><div className="withdrawal-prompt-actions"><button className="reference-button" onClick={closeAuditAction}>取 消</button><button className="reference-button primary" onClick={confirmAction}>确 定</button></div></div></div>}{pendingAction?.type==='拒绝'&&<Modal title="审核不通过" className="product-audit-reject-modal" onClose={closeAuditAction} footer={<><button className="reference-button" onClick={closeAuditAction}>取 消</button><button className="reference-button primary" onClick={confirmAction}>确 定</button></>}><div className="product-audit-reject-field"><label>拒绝理由：</label><select className="reference-select" value={rejectReason} onChange={e=>setRejectReason(e.target.value)}><option>重复上架</option><option>商品信息不完整</option><option>商品信息与图片不符</option><option>商品图片不符合规范</option><option>价格设置异常</option></select></div></Modal>}</div>;
}

export function RentRulesPage() {
  const [editing,setEditing]=useState(false);
  const [toast,showToast]=useToast();
  const [safe,setSafe]=useState([['1x2','1'],['2x2','1'],['2x3','2'],['3x3','3']]);
  const [training,setTraining]=useState([['0级','1'],['2级','1'],['1级','1'],['7级','3'],['6级','2'],['5级','2'],['4级','1'],['3级','1']]);
  const [ratios,setRatios]=useState([['6','1000','900'],['5','35','30'],['4','36','31'],['3','37','32'],['2','38','33']]);
  const [commission,setCommission]=useState('10');
  const [deposit,setDeposit]=useState([['基底（元）','1'],['每件刀皮（元）','1'],['每件人皮（元）','2']]);
  const snapshot=useRef(null);
  const editCell=(list,setList,index,col,value)=>setList(list.map((row,i)=>i===index?row.map((cell,j)=>j===col?value:cell):row));
  const clone=list=>list.map(row=>[...row]);
  const startEditing=()=>{
    snapshot.current={safe:clone(safe),training:clone(training),ratios:clone(ratios),commission,deposit:clone(deposit)};
    setEditing(true);
  };
  const cancelEditing=()=>{
    const previous=snapshot.current;
    if(previous){setSafe(previous.safe);setTraining(previous.training);setRatios(previous.ratios);setCommission(previous.commission);setDeposit(previous.deposit);}
    setEditing(false);
  };
  const confirmEditing=()=>{snapshot.current=null;setEditing(false);showToast('租金规则已保存');};
  const addRow=(setList,row)=>setList(current=>[...current,row]);
  const deleteRow=(setList,index)=>setList(current=>current.filter((_,rowIndex)=>rowIndex!==index));
  const dimensionTable=(list,setList,title,options)=><table className="rent-rule-table rent-dimension-table"><thead><tr><th>序号</th><th>{title}</th><th>积分</th>{editing&&<th className="rent-operation-head">操作</th>}</tr></thead><tbody>{list.map((row,i)=><tr key={`${row[0]}-${i}`}><td>{i+1}</td><td><select className="rent-rule-input rent-rule-select" disabled={!editing} value={row[0]} onChange={e=>editCell(list,setList,i,0,e.target.value)}>{options.map(option=><option key={option}>{option}</option>)}</select></td><td><input className="rent-rule-input" disabled={!editing} value={row[1]} onChange={e=>editCell(list,setList,i,1,e.target.value)}/></td>{editing&&<td className="rent-row-actions">{i===0&&<button className="rent-rule-action" onClick={()=>addRow(setList,[options[0],''])}>新增</button>}<button className="rent-rule-action" onClick={()=>deleteRow(setList,i)}>删除</button></td>}</tr>)}</tbody></table>;
  const ratioTable=<table className="rent-rule-table rent-ratio-table"><thead><tr><th>序号</th><th>积分</th><th>卖价比例</th><th>买家比例</th>{editing&&<th className="rent-operation-head">操作</th>}</tr></thead><tbody>{ratios.map((row,i)=><tr key={`${row[0]}-${i}`}><td>{i+1}</td>{row.map((cell,j)=><td key={j}><input className="rent-rule-input" disabled={!editing} value={cell} onChange={e=>editCell(ratios,setRatios,i,j,e.target.value)}/></td>)}{editing&&<td className="rent-row-actions">{i===0&&<button className="rent-rule-action" onClick={()=>addRow(setRatios,['','',''])}>新增</button>}<button className="rent-rule-action" onClick={()=>deleteRow(setRatios,i)}>删除</button></td>}</tr>)}</tbody></table>;
  return <div className={`reference-page rent-page ${editing?'rent-editing':''}`}>{toast&&<div className="reference-toast">✓ {toast}</div>}<div className="rent-title-row"><h2>租金规则</h2>{editing?<div className="rent-edit-actions"><button className="reference-button" onClick={cancelEditing}>取 消</button><button className="reference-button" onClick={confirmEditing}>确 认</button></div>:<button className="reference-button" onClick={startEditing}>编 辑</button>}</div><section className="rent-section"><h3>维度与积分规则</h3><div className="rent-grid">{dimensionTable(safe,setSafe,'安全箱',['1x2','2x2','2x3','3x3'])}{dimensionTable(training,setTraining,'训练中心',['0级','1级','2级','3级','4级','5级','6级','7级'])}</div></section><section className="rent-section"><h3>积分与比例的规则</h3><div className="rent-grid single">{ratioTable}</div></section><section className="rent-section"><h3>抽成比例</h3><div className="rent-compact-row"><span className="rent-row-index">1</span><span className="rent-row-label">对卖家抽成比例</span><input className="rent-rule-input" disabled={!editing} value={commission} onChange={e=>setCommission(e.target.value)}/><span>%</span></div></section><h2 className="rent-deposit-title">押金规则</h2><section className="rent-section rent-deposit-section"><h3>押金规则</h3><div className="rent-deposit-list">{deposit.map((row,i)=><div className="rent-compact-row" key={row[0]}><span className="rent-row-index">{i+1}</span><span className="rent-row-label">{row[0]}</span><input className="rent-rule-input" disabled={!editing} value={row[1]} onChange={e=>editCell(deposit,setDeposit,i,1,e.target.value)}/></div>)}</div></section></div>;
}

export function WithdrawalManagementPage() {
  const [rows,setRows]=useState(withdrawalSeed);
  const [filters,setFilters]=useState({start:'',end:'',userId:'',phone:'',name:'',account:'',status:''});
  const [selected,setSelected]=useState(new Set());
  const [pending,setPending]=useState(null);
  const [reason,setReason]=useState('');
  const [settlementMonth,setSettlementMonth]=useState('');
  const [previewed,setPreviewed]=useState(false);
  const [toast,showToast]=useToast();
  const visible=rows.filter(row=>matches(row,filters,{})&&inDateRange(row.submitTime,filters.start,filters.end));
  const filtered=hasActiveFilters(filters);
  const closePending=()=>{setPending(null);setReason('');setSettlementMonth('');setPreviewed(false);};
  const action=(row,type)=>{setPending({row,type});setReason(type==='完成打款'?'拒绝123':'');setSettlementMonth('');setPreviewed(false);};
  const recalculate=row=>{
    const alreadyPaid=rows.filter(item=>item.userId===row.userId&&item.id!==row.id&&(item.status==='打款中'||item.status==='已完成')).reduce((sum,item)=>sum+Number(item.amount||0),0);
    const monthTotal=alreadyPaid+Number(row.amount||0);
    const taxDue=Number((monthTotal*.16+(monthTotal>50000?244.4:0)).toFixed(2));
    const taxPaid=rows.filter(item=>item.userId===row.userId&&item.status==='已完成').reduce((sum,item)=>sum+Number(item.taxDue||0),0);
    const taxSupplement=Math.max(0,Number((taxDue-taxPaid).toFixed(2)));
    setRows(current=>current.map(item=>item.id===row.id?{...item,needsRecalc:false,monthTotal,taxDue,taxPaid,taxSupplement,received:Number((Number(item.amount)-taxSupplement).toFixed(2))}:item));
    showToast(`用户 ${row.userId} 的提现流水已重新计算`);
  };
  const confirm=()=>{
    if(pending.type==='拒绝'&&!reason.trim())return;
    if(pending.type==='完成打款'&&(!reason.trim()||!settlementMonth))return;
    const target=pending.row;
    const monthValue=settlementMonth.replace('-','');
    setRows(current=>current.map(row=>{
      if(row.id===target.id){
        const status={通过:'待打款',拒绝:'已拒绝',打款:'打款中','完成打款':'已完成'}[pending.type];
        return {...row,status,reason:reason.trim(),month:pending.type==='完成打款'?monthValue:row.month,needsRecalc:false,operator:'邓辉',operationTime:'2026-07-17 14:30:00'};
      }
      if(pending.type==='打款'&&row.userId===target.userId&&row.status==='待打款')return {...row,needsRecalc:true};
      return row;
    }));
    showToast(`${pending.type}操作已完成`);
    closePending();
  };
  const batch=type=>{setRows(current=>current.map(row=>selected.has(row.id)?{...row,status:type==='通过'?'待打款':'已拒绝',operator:'邓辉'}:row));showToast(`已批量${type} ${selected.size} 条记录`);setSelected(new Set());};
  const columns=[{key:'userId',label:'用户ID',width:120},{key:'name',label:'姓名',width:100},{key:'phone',label:'手机号',width:130},{key:'amount',label:'提现金额(元)',width:120},{key:'tax',label:'税费',width:90},{key:'channelFee',label:'支付渠道费',width:110},{key:'beforeTax',label:'税前到账(元)',width:120},{key:'month',label:'结算月份',width:100},{key:'monthTotal',label:'当月税前累计',width:120},{key:'taxDue',label:'应缴税费',width:100},{key:'taxPaid',label:'已缴税费',width:100},{key:'taxSupplement',label:'应补税费',width:100},{key:'received',label:'到账金额(元)',width:120},{key:'account',label:'提现账户',width:150},{key:'accountName',label:'提现账户姓名',width:120},{key:'accountPhone',label:'提现账户手机号',width:140},{key:'cardNo',label:'提现账户身份证号',width:190},{key:'status',label:'状态',width:100,render:r=><span className={`reference-status ${r.status==='审核中'||r.status==='待打款'?'wait':r.status==='已拒绝'?'error':''}`}>{r.status}</span>},{key:'operator',label:'操作人',width:110},{key:'operationTime',label:'操作时间',width:175},{key:'submitTime',label:'提交时间',width:175},{key:'action',label:'操作',width:160,render:r=>r.status==='审核中'?<><button className="reference-link" onClick={()=>action(r,'通过')}>通过</button><button className="reference-link red" onClick={()=>action(r,'拒绝')}>拒绝</button></>:r.status==='待打款'?<>{r.needsRecalc?<button className="reference-link" onClick={()=>recalculate(r)}>重新计算</button>:<button className="reference-link" onClick={()=>action(r,'打款')}>打款</button>}<button className="reference-link red" onClick={()=>action(r,'完成打款')}>完成打款</button></>:r.status==='打款中'?<button className="reference-link red" onClick={()=>action(r,'完成打款')}>完成打款</button>:'-'}];
  const previewColumns=[['userId','用户ID'],['name','姓名'],['phone','手机号'],['submitTime','提交时间'],['account','提现账户'],['accountName','提现账户姓名'],['accountPhone','提现账户手机号'],['cardNo','提现账户身份证号'],['amount','提现金额(元)'],['channelFee','支付渠道费'],['beforeTax','税前到账(元)'],['month','结算月份'],['monthTotal','当月税前累计'],['taxDue','应缴税费']];
  return <div className="reference-page">{toast&&<div className="reference-toast">✓ {toast}</div>}<div className="reference-filter"><DateRangeFilter label="提交时间" start={filters.start} end={filters.end} onStart={value=>setFilters({...filters,start:value})} onEnd={value=>setFilters({...filters,end:value})}/><FilterInput className="reference-wide" placeholder="请输入用户ID" value={filters.userId} onChange={value=>setFilters({...filters,userId:value})}/><FilterInput className="reference-wide" placeholder="请输入手机号" value={filters.phone} onChange={value=>setFilters({...filters,phone:value})}/><FilterInput className="reference-wide" placeholder="请输入姓名" value={filters.name} onChange={value=>setFilters({...filters,name:value})}/><FilterInput className="reference-wide" placeholder="请输入打款账户" value={filters.account} onChange={value=>setFilters({...filters,account:value})}/><select className="reference-select" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">请选择状态</option><option>审核中</option><option>待打款</option><option>打款中</option><option>已完成</option><option>已拒绝</option></select><button className="reference-button">查 询</button><button className="reference-button" onClick={()=>setFilters({start:'',end:'',userId:'',phone:'',name:'',account:'',status:''})}>重 置</button><button className="reference-button" onClick={()=>exportCsv('提现管理',columns,visible)}>导 出</button><button className="reference-button" disabled={!selected.size} onClick={()=>batch('通过')}>批量通过</button><button className="reference-button" disabled={!selected.size} onClick={()=>batch('拒绝')}>批量拒绝</button></div><div className="reference-alert">{selected.size?`已选择 ${selected.size} 项`:'未选中任何数据'}</div><DataTable columns={columns} rows={visible.map(r=>({...r,selectable:r.status==='审核中'}))} minWidth={2920} selected={selected} onSelect={setSelected} selectable stickyLast total={filtered?visible.length:232} totalPages={filtered?1:24}/>{pending&&(pending.type==='通过'||pending.type==='打款')&&<div className="reference-modal-mask"><div className="withdrawal-prompt-modal"><div className="withdrawal-prompt-content"><span className="withdrawal-warning-icon">!</span><div><h3>提示</h3><p>{pending.type==='通过'?'是否同意该提现申请?':'是否打款提现申请?'}</p></div></div><div className="withdrawal-prompt-actions"><button className="reference-button" onClick={closePending}>取 消</button><button className="reference-button primary" onClick={confirm}>确 定</button></div></div></div>}{pending?.type==='拒绝'&&<Modal title="提现申请拒绝" className="withdrawal-reject-modal" onClose={closePending} footer={<><button className="reference-button" onClick={closePending}>取 消</button><button className="reference-button primary" disabled={!reason.trim()} onClick={confirm}>确 定</button></>}><div className="withdrawal-reject-field"><label><span>*</span> 拒绝理由：</label><input className="reference-input" value={reason} onChange={e=>setReason(e.target.value)} placeholder="请输入拒绝理由" autoFocus/></div></Modal>}{pending?.type==='完成打款'&&<Modal title="完成打款" className="withdrawal-complete-modal" onClose={closePending} footer={<><button className="reference-button" onClick={closePending}>取 消</button><button className="reference-button primary" disabled={!reason.trim()||!settlementMonth} onClick={confirm}>确 定</button></>}><div className="withdrawal-complete-form"><label><span>*</span> 原因：</label><input className="reference-input" value={reason} onChange={e=>setReason(e.target.value)}/><label><span>*</span> 月份：</label><input className="reference-input withdrawal-month-input" type="month" value={settlementMonth} onInput={e=>{setSettlementMonth(e.currentTarget.value);setPreviewed(false);}} onChange={e=>{setSettlementMonth(e.target.value);setPreviewed(false);}}/></div><button className="reference-button withdrawal-preview-button" disabled={!settlementMonth} onClick={()=>setPreviewed(true)}>预 览</button><div className="withdrawal-preview-wrap"><table className="withdrawal-preview-table"><thead><tr>{previewColumns.map(([,label])=><th key={label}>{label}</th>)}</tr></thead><tbody>{previewed?<tr>{previewColumns.map(([key])=><td key={key}>{key==='month'?settlementMonth.replace('-',''):(pending.row[key]||'-')}</td>)}</tr>:<tr><td colSpan={previewColumns.length} className="withdrawal-preview-empty">暂无预览数据，请选择月份后点击预览按钮</td></tr>}</tbody></table></div></Modal>}</div>;
}

export function AccountManagementPage({ onOpenLedger }) {
  const [rows,setRows]=useState(accountSeed);
  const [filters,setFilters]=useState({phone:'',userId:''});
  const [modal,setModal]=useState(null);
  const [amount,setAmount]=useState('');
  const [toast,showToast]=useToast();
  const visible=rows.filter(row=>matches(row,filters,{}));
  const filtered=hasActiveFilters(filters);
  const recharge=()=>{const value=Number(amount);if(!value||value<=0)return;setRows(current=>current.map(row=>row.id===modal.row.id?{...row,total:Number((row.total+value).toFixed(2)),available:Number((row.available+value).toFixed(2))}:row));showToast(`已为用户 ${modal.row.userId} 充值 ${value} 元`);setModal(null);setAmount('');};
  const columns=[{key:'userId',label:'用户ID',width:130},{key:'phone',label:'手机号',width:140},{key:'recharge',label:'是否为充值',width:120},{key:'account',label:'提现账户信息',width:180},{key:'total',label:'总资产（元）',width:130},{key:'available',label:'可提现金额（元）',width:140},{key:'transit',label:'在途金额（元）',width:130},{key:'withdrawing',label:'提现中金额（元）',width:140},{key:'action',label:'操作',width:190,render:r=><>{r.recharge==='是'&&<button className="reference-link" onClick={()=>setModal({type:'recharge',row:r})}>充值</button>}<button className="reference-link" onClick={()=>onOpenLedger(r)}>余额操作流水</button></>}];
  return <div className="reference-page">{toast&&<div className="reference-toast">✓ {toast}</div>}<div className="reference-filter"><label>手机号 <FilterInput placeholder="手机号" value={filters.phone} onChange={value=>setFilters({...filters,phone:value})}/></label><label>用户ID <FilterInput placeholder="用户ID" value={filters.userId} onChange={value=>setFilters({...filters,userId:value})}/></label><button className="reference-button primary">搜 索</button><button className="reference-button" onClick={()=>setFilters({phone:'',userId:''})}>重 置</button></div><DataTable columns={columns} rows={visible} minWidth={1350} total={filtered?visible.length:27} totalPages={filtered?1:3}/>{modal?.type==='recharge'&&<Modal title="钱包充值" className="wallet-recharge-modal" onClose={()=>{setModal(null);setAmount('');}}><div className="wallet-recharge-field"><label><span>*</span> 充值金额：</label><input className="reference-input" type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="请输入充值金额"/></div><div className="wallet-recharge-action"><button className="reference-button primary" onClick={recharge}>确认充值</button></div></Modal>}</div>;
}

function createBalanceFlows(account) {
  if (account.userId === '104123') return [{id:1,flowNo:'',balanceType:'可提现余额',type:'充值余额',change:'20.00',before:'0.00',after:'20.00',createTime:'2026-07-15 19:52:49'}];
  const current = Number(account.available || 0);
  const firstAmount = Math.max(1, Math.min(current, 1000));
  return [
    {id:1,flowNo:`YE${account.userId}071701`,balanceType:'可提现余额',type:'订单结算',change:firstAmount.toFixed(2),before:Math.max(0,current-firstAmount).toFixed(2),after:current.toFixed(2),createTime:'2026-07-17 10:18:26'},
    {id:2,flowNo:`YE${account.userId}071602`,balanceType:'可提现余额',type:'充值余额',change:'20.00',before:Math.max(0,current-20).toFixed(2),after:current.toFixed(2),createTime:'2026-07-16 19:52:49'},
    {id:3,flowNo:`YE${account.userId}071503`,balanceType:'可提现余额',type:'提现冻结',change:`-${Number(account.withdrawing || 100).toFixed(2)}`,before:(current+Number(account.withdrawing || 100)).toFixed(2),after:current.toFixed(2),createTime:'2026-07-15 09:37:16'},
    {id:4,flowNo:`YE${account.userId}071204`,balanceType:'可提现余额',type:'退款入账',change:'38.20',before:Math.max(0,current-38.2).toFixed(2),after:current.toFixed(2),createTime:'2026-07-12 16:04:02'},
  ];
}

export function BalanceFlowPage({ account, onBack }) {
  const [filters,setFilters]=useState({balanceType:'可提现余额',flowNo:'',amount:''});
  const rows=createBalanceFlows(account);
  const visible=rows.filter(row=>(!filters.balanceType||row.balanceType===filters.balanceType)&&(!filters.flowNo||row.flowNo.includes(filters.flowNo))&&(!filters.amount||String(row.change).includes(filters.amount)));
  return <div className="reference-page balance-flow-page"><div className="balance-flow-userbar"><span>用户ID： {account.userId}</span><button className="reference-button" onClick={onBack}>返 回</button></div><div className="balance-flow-filter"><label>流水类型：<select className="reference-select" value={filters.balanceType} onChange={e=>setFilters({...filters,balanceType:e.target.value})}><option>可提现余额</option><option>在途金额</option><option>提现中金额</option></select></label><label>流水号：<FilterInput placeholder="流水号" value={filters.flowNo} onChange={value=>setFilters({...filters,flowNo:value})}/></label><label>金额：<FilterInput placeholder="金额" value={filters.amount} onChange={value=>setFilters({...filters,amount:value})}/></label><button className="reference-button primary">搜 索</button><button className="reference-button" onClick={()=>setFilters({balanceType:'可提现余额',flowNo:'',amount:''})}>重 置</button></div><div className="reference-card balance-flow-table-card"><div className="reference-table-wrap"><table className="reference-table balance-flow-table"><thead><tr><th>流水号</th><th>流水类型</th><th>资金变动（元）</th><th>变动前余额（元）</th><th>变动后余额（元）</th><th>创建时间</th></tr></thead><tbody>{visible.map(row=><tr key={row.id}><td>{row.flowNo||''}</td><td>{row.type}</td><td>{row.change}</td><td>{row.before}</td><td>{row.after}</td><td>{row.createTime}</td></tr>)}</tbody></table></div><Pagination total={visible.length} totalPages={1}/></div></div>;
}
