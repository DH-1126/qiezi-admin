import { useMemo, useState } from 'react';
import './AdminSupplierUserPages.css';

const BUTTON = 'supplier-button';

function Button({ children, primary = false, disabled = false, onClick, type = 'button' }) {
  return <button type={type} disabled={disabled} className={`${BUTTON}${primary ? ' primary' : ''}`} onClick={onClick}>{children}</button>;
}

function Modal({ title, children, footer, onClose, className = '' }) {
  return <div className="supplier-modal-mask" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={`supplier-modal ${className}`}>
      <header><strong>{title}</strong><button aria-label="关闭" onClick={onClose}>×</button></header>
      <div className="supplier-modal-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </div>
  </div>;
}

function Field({ label, required = false, children, className = '' }) {
  return <label className={`supplier-field ${className}`}><span>{required && <i>*</i>}{label}：</span>{children}</label>;
}

function Input({ value, onChange, placeholder = '', type = 'text', disabled = false }) {
  return <input className="supplier-input" type={type} value={value} disabled={disabled} placeholder={placeholder}
    onInput={type === 'date' ? event => onChange(event.currentTarget.value) : undefined}
    onChange={event => onChange(event.target.value)} />;
}

function Select({ value, onChange, children, disabled = false }) {
  return <select className="supplier-input" value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>{children}</select>;
}

function PageTools() {
  return <div className="supplier-table-tools"><span>↻</span><span>↕</span><span>⚙</span></div>;
}

function Pagination({ total, pages = 1, page = 1, onPage = () => {}, showJump = false }) {
  return <div className="supplier-pagination"><span>共 {total} 条数据</span>{pages > 1 && <button disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>}
    {Array.from({ length: Math.min(pages, 5) }, (_, index) => index + 1).map(item => <button className={item === page ? 'active' : ''} key={item} onClick={() => onPage(item)}>{item}</button>)}
    {pages > 6 && <><span>•••</span><button onClick={() => onPage(pages)}>{pages}</button></>}
    {pages > 1 && <button disabled={page === pages} onClick={() => onPage(page + 1)}>›</button>}
    <select defaultValue="10"><option value="10">10 条/页</option><option value="20">20 条/页</option></select>
    {showJump && <><span>跳至</span><input aria-label="跳至页码"/><span>页</span></>}
  </div>;
}

function Table({ columns, rows, minWidth = 1000, selectable = false, selected = new Set(), onSelect = () => {}, emptyText = '暂无数据' }) {
  const allSelected = rows.length > 0 && rows.every(row => selected.has(row.id));
  return <div className="supplier-table-wrap"><table className="supplier-table" style={{ minWidth }}><thead><tr>
    {selectable && <th className="supplier-check"><input aria-label="全选" type="checkbox" checked={allSelected} onChange={event => onSelect(event.target.checked ? new Set(rows.map(row => row.id)) : new Set())}/></th>}
    {columns.map(column => <th key={column.key} style={{ width: column.width }}>{column.label}</th>)}
  </tr></thead><tbody>{rows.length ? rows.map(row => <tr key={row.id}>
    {selectable && <td className="supplier-check"><input aria-label={`选择${row.id}`} type="checkbox" checked={selected.has(row.id)} onChange={event => { const next = new Set(selected); if (event.target.checked) next.add(row.id); else next.delete(row.id); onSelect(next); }}/></td>}
    {columns.map(column => <td key={column.key} className={column.align === 'left' ? 'left' : ''} title={typeof row[column.key] === 'string' ? row[column.key] : undefined}>{column.render ? column.render(row) : (row[column.key] ?? '-')}</td>)}
  </tr>) : <tr><td className="supplier-empty" colSpan={columns.length + (selectable ? 1 : 0)}>{emptyText}</td></tr>}</tbody></table></div>;
}

const merchantSeed = [{ id: 'merchant-1', seq: 1, userId: '154420045', sheetUrl: 'https://www.kdocs.cn/l/ce294580WBeT', concession: '6', costRatio: '90', interval: '1', status: '开启', createdAt: '2025-12-08 14:50:31', updatedAt: '2026-03-30 10:28:42', modifier: '18942914433' }];
const fieldNames = ['编号', '哈夫币（M）', '租金（只含纯币）', '押金', '比例', '保险', '体力', '负重', 'AWM', '特殊皮肤（备注如体验卡等物资默认收费）', '6头', '绝密KD', '上号方式', '租期(天)', '等级+段位', '6甲'];

export function MerchantConfigPage() {
  const [rows, setRows] = useState(merchantSeed);
  const [editing, setEditing] = useState(null);
  const [fieldModal, setFieldModal] = useState(false);
  const [fieldValues, setFieldValues] = useState(fieldNames);
  const [toast, setToast] = useState('');
  const saveEdit = () => {
    setRows(current => current.map(row => row.id === editing.id ? { ...row, ...editing, concession: editing.profit, updatedAt: '2026-07-17 16:20:18', modifier: '18942914433' } : row));
    setEditing(null); setToast('配置保存成功'); setTimeout(() => setToast(''), 1600);
  };
  const columns = [
    { key: 'seq', label: '序号', width: 70 }, { key: 'userId', label: '号商用户ID', width: 140 },
    { key: 'sheetUrl', label: '商品表信息', width: 260 }, { key: 'concession', label: '商户让利比例', width: 135 },
    { key: 'costRatio', label: '成本金额比例(%)', width: 150 }, { key: 'interval', label: '定时同步间隔(分钟)', width: 170 },
    { key: 'status', label: '开启状态', width: 100 }, { key: 'createdAt', label: '创建时间', width: 175 },
    { key: 'updatedAt', label: '最后修改时间', width: 175 }, { key: 'modifier', label: '修改人', width: 135 },
    { key: 'actions', label: '操作', width: 190, render: row => <div className="supplier-row-actions"><button onClick={() => setEditing({ ...row, profit: row.concession })}>编辑</button><button onClick={() => setRows(current => current.map(item => item.id === row.id ? { ...item, status: item.status === '开启' ? '关闭' : '开启' } : item))}>{row.status === '开启' ? '关闭' : '开启'}</button><button onClick={() => setFieldModal(true)}>字段管理</button></div> },
  ];
  return <div className="supplier-page">{toast && <div className="supplier-toast">✓ {toast}</div>}<div className="supplier-card"><PageTools/><Table columns={columns} rows={rows} minWidth={1500}/><Pagination total={rows.length}/></div>
    {editing && <Modal title="编辑" className="merchant-edit-modal" onClose={() => setEditing(null)} footer={<><Button onClick={() => setEditing(null)}>取 消</Button><Button primary onClick={saveEdit}>确 定</Button></>}>
      <Field label="号商用户ID"><Input value={editing.userId} onChange={value => setEditing({ ...editing, userId: value })}/></Field>
      <Field label="商品表信息"><Input value={editing.sheetUrl} onChange={value => setEditing({ ...editing, sheetUrl: value })}/></Field>
      <Field label="成本金额比例(%)"><div className="supplier-suffix-input"><Input value={editing.costRatio} onChange={value => setEditing({ ...editing, costRatio: value })}/><span>%</span></div></Field>
      <Field label="平台利润率(%)"><div className="supplier-suffix-input"><Input value={editing.profit} onChange={value => setEditing({ ...editing, profit: value })}/><span>%</span></div></Field>
      <Field label="定时同步间隔(分钟)"><div className="supplier-suffix-input"><Input value={editing.interval} onChange={value => setEditing({ ...editing, interval: value })}/><span>分钟</span></div></Field>
      <Field label="开启状态"><div className="supplier-radio"><label><input type="radio" checked={editing.status === '关闭'} onChange={() => setEditing({ ...editing, status: '关闭' })}/> 关闭</label><label><input type="radio" checked={editing.status === '开启'} onChange={() => setEditing({ ...editing, status: '开启' })}/> 开启</label></div></Field>
    </Modal>}
    {fieldModal && <Modal title="字段管理" className="merchant-field-modal" onClose={() => setFieldModal(false)} footer={<><Button onClick={() => setFieldModal(false)}>取 消</Button><Button primary onClick={() => { setFieldModal(false); setToast('字段配置保存成功'); setTimeout(() => setToast(''), 1600); }}>确 定</Button></>}>
      <div className="field-section-title">管理方案</div><Field label="处理逻辑" required><Select value="星锐EZC" onChange={() => {}}><option>星锐EZC</option></Select></Field><div className="document-type">文档类型：金山云文档</div>
      <div className="field-section-title">字段关联表</div><div className="field-map-head"><span>字段ID</span><span>平台字段名称</span><span>文档字段名称</span></div>
      <div className="field-map-list">{fieldNames.map((name, index) => <div className="field-map-row" key={index}><span>{index + 1}</span><span title={name}>{name}</span><Input value={fieldValues[index]} onChange={value => setFieldValues(current => current.map((item, itemIndex) => itemIndex === index ? value : item))}/></div>)}</div>
    </Modal>}
  </div>;
}

const compareSeed = ['712061','712060','712065','712064','712063','712062','812065','812064','812063','812062'].map((productCode, index) => ({ id: `compare-${index}`, productCode, supplierId: '1', batchNo: '2077371831880175617', validTo: '最新', action: index < 6 ? '删除' : '新增', importedAt: '2026-07-15 20:36:55', operation: '3' }));

export function SupplierComparePage() {
  const empty = { productCode: '', supplierId: '', batchNo: '', action: '' };
  const [draft, setDraft] = useState(empty); const [filters, setFilters] = useState(empty); const [selected, setSelected] = useState(new Set()); const [toast, setToast] = useState('');
  const visible = useMemo(() => compareSeed.filter(row => (!filters.productCode || row.productCode.includes(filters.productCode)) && (!filters.supplierId || row.supplierId.includes(filters.supplierId)) && (!filters.batchNo || row.batchNo.includes(filters.batchNo)) && (!filters.action || row.action === filters.action)), [filters]);
  const counts = [...selected].map(id => compareSeed.find(row => row.id === id)).filter(Boolean).reduce((result, row) => ({ ...result, [row.action]: result[row.action] + 1 }), { 新增: 0, 更新: 0, 删除: 0 });
  const columns = [{key:'productCode',label:'商品编号',width:150},{key:'supplierId',label:'号商配置ID',width:140},{key:'batchNo',label:'版本号',width:220},{key:'validTo',label:'有效版本至',width:130},{key:'action',label:'操作类型',width:120},{key:'importedAt',label:'导入时间',width:190},{key:'operation',label:'操作',width:90}];
  return <div className="supplier-page"><div className="supplier-filter-grid compare-filter"><Field label="商品编号"><Input value={draft.productCode} onChange={value=>setDraft({...draft,productCode:value})} placeholder="请输入商品编号"/></Field><Field label="号商配置ID"><Input value={draft.supplierId} onChange={value=>setDraft({...draft,supplierId:value})} placeholder="请输入号商配置ID"/></Field><Field label="生效批次号"><Input value={draft.batchNo} onChange={value=>setDraft({...draft,batchNo:value})} placeholder="请输入生效批次号"/></Field><Field label="操作类型"><Select value={draft.action} onChange={value=>setDraft({...draft,action:value})}><option value="">请选择操作类型</option><option>新增</option><option>更新</option><option>删除</option></Select></Field><div className="supplier-filter-actions"><Button primary onClick={()=>setFilters(draft)}>查询</Button><Button onClick={()=>{setDraft(empty);setFilters(empty);}}>重置</Button></div></div>
    <div className="supplier-compare-bar"><strong>供应商商品版本管理</strong><span>新增: {counts.新增}</span><span>更新: {counts.更新}</span><span>删除: {counts.删除}</span><Button onClick={()=>{setToast(selected.size < 2 ? '请至少选择两条数据进行版本对比' : `已选择 ${selected.size} 条数据进行版本对比`);setTimeout(()=>setToast(''),1800);}}>版本对比</Button></div>{toast&&<div className="supplier-toast">{toast}</div>}
    <div className="supplier-selection">{selected.size ? `已选择 ${selected.size} 项` : '未选中任何数据'}</div><div className="supplier-card"><Table columns={columns} rows={visible} minWidth={1100} selectable selected={selected} onSelect={setSelected}/><Pagination total={filters.productCode||filters.supplierId||filters.batchNo||filters.action?visible.length:3803} pages={filters.productCode||filters.supplierId||filters.batchNo||filters.action?1:381} showJump/></div></div>;
}

const syncSeed = [
  ['1003','2077673696870191105','https://test1-dfs01.nn.com/v2/123/1784190984/6337/example.xlsx','5.85 KB','2026-07-16 16:36:25'],
  ['1002','2077371831880175617','https://test1-dfs01.nn.com/v2/leaseFile/1784119014/7578/example.xlsx','5.83 KB','2026-07-15 20:36:55'],
  ['1001','2077370917375102977','https://test1-dfs01.nn.com/v2/leaseFile/1784118796/7634/example.xlsx','5.84 KB','2026-07-15 20:33:17'],
  ['1000','2077370359650111489','https://test1-dfs01.nn.com/v2/leaseFile/1784118663/8815/example.xlsx','5.83 KB','2026-07-15 20:31:04'],
  ['999','2077369709650432001','https://test1-dfs01.nn.com/v2/leaseFile/1784118507/4937/example.xlsx','5.84 KB','2026-07-15 20:28:29'],
  ['998','2077355511403716610','https://test1-dfs01.nn.com/v2/leaseFile/1784115122/5738/example.xlsx','5.83 KB','2026-07-15 19:32:04'],
  ['997','2077311460301651969','https://test1-dfs01.nn.com/v2/leaseFile/1784104620/2897/example.xlsx','5.83 KB','2026-07-15 16:37:01'],
  ['996','2077309605572034561','https://test1-dfs01.nn.com/v2/leaseFile/1784104177/8254/example.xlsx','5.83 KB','2026-07-15 16:29:39'],
  ['995','2076947000478203905','https://test1-dfs01.nn.com/v2/leaseFile/1784017728/312/example.xlsx','5.83 KB','2026-07-14 16:28:49'],
  ['994','2076924723205971970','https://test1-dfs01.nn.com/v2/leaseFile/1784012415/8009/example.xlsx','5.83 KB','2026-07-14 15:00:16'],
].map(([seq,batchNo,file,size,createdAt], index) => ({ id:`sync-${index}`,seq,supplierId:'1',batchNo,file,size,status:'处理成功',createdAt }));

export function SupplierSyncRecordsPage() {
  const empty={supplierId:'',batchNo:'',start:'',end:'',status:''}; const [draft,setDraft]=useState(empty); const [filters,setFilters]=useState(empty);
  const visible=useMemo(()=>syncSeed.filter(row=>(!filters.supplierId||row.supplierId.includes(filters.supplierId))&&(!filters.batchNo||row.batchNo.includes(filters.batchNo))&&(!filters.status||row.status===filters.status)&&(!filters.start||row.createdAt.slice(0,10)>=filters.start)&&(!filters.end||row.createdAt.slice(0,10)<=filters.end)),[filters]);
  const filtered=Object.values(filters).some(Boolean);
  const columns=[{key:'seq',label:'序号',width:80},{key:'supplierId',label:'号商配置ID',width:140},{key:'batchNo',label:'批次号',width:230},{key:'file',label:'文件链接',width:450,align:'left',render:row=><a className="supplier-link" href={row.file} target="_blank" rel="noreferrer">{row.file}</a>},{key:'size',label:'文件大小',width:110},{key:'status',label:'处理状态',width:120},{key:'createdAt',label:'创建时间',width:180}];
  return <div className="supplier-page"><div className="supplier-filter-grid sync-filter"><Field label="供应商配置ID"><Input value={draft.supplierId} onChange={value=>setDraft({...draft,supplierId:value})} placeholder="请输入供应商配置ID"/></Field><Field label="批次号"><Input value={draft.batchNo} onChange={value=>setDraft({...draft,batchNo:value})} placeholder="请输入批次号"/></Field><Field label="创建时间" className="supplier-date-field"><div className="supplier-date-range"><Input type="date" value={draft.start} onChange={value=>setDraft({...draft,start:value})}/><span>→</span><Input type="date" value={draft.end} onChange={value=>setDraft({...draft,end:value})}/></div></Field><Field label="处理状态"><Select value={draft.status} onChange={value=>setDraft({...draft,status:value})}><option value="">请选择处理状态</option><option>处理成功</option><option>处理失败</option><option>处理中</option></Select></Field><div className="supplier-filter-actions"><Button primary onClick={()=>setFilters(draft)}>查询</Button><Button onClick={()=>{setDraft(empty);setFilters(empty);}}>重置</Button></div></div><div className="supplier-section-title">供货商商品同步批次</div><div className="supplier-card"><Table columns={columns} rows={visible} minWidth={1320}/><Pagination total={filtered?visible.length:1003} pages={filtered?1:101} showJump/></div></div>;
}

const walletSeed = [
  ['17','104123','2026-07-15 19:52:38','18942914433','启用'],['16','154419373','2026-07-14 14:40:04','17779287745','启用'],['15','39483','2026-06-08 19:21:15','17779287745','禁用'],['14','104045','2026-05-21 14:53:56','18942914433','启用'],['13','104044','2026-05-21 14:52:15','18942914433','禁用'],['12','154390051','2026-03-27 15:38:31','18942914433','启用'],['11','154420045','2026-03-27 15:13:13','18942914433','启用'],['10','10006993','2026-03-27 14:02:04','18942914433','禁用'],['9','18321859027','2025-12-31 18:14:17','admin','禁用'],['8','154419129','2025-12-31 17:44:31','18942914433','禁用'],
].map(([id,userId,createdAt,creator,status])=>({id,seq:18-Number(id),userId,createdAt,creator,status}));

export function WalletWhitelistPage() {
  const [rows,setRows]=useState(walletSeed); const empty={keyword:'',status:''}; const [draft,setDraft]=useState(empty); const [filters,setFilters]=useState(empty); const [adding,setAdding]=useState(false); const [newUser,setNewUser]=useState(''); const [toast,setToast]=useState('');
  const visible=rows.filter(row=>(!filters.keyword||row.userId.includes(filters.keyword))&&(!filters.status||row.status===filters.status)); const filtered=Object.values(filters).some(Boolean);
  const add=()=>{if(!newUser.trim())return;const now='2026-07-17 16:30:00';setRows(current=>[{id:String(Math.max(...current.map(item=>Number(item.id)))+1),seq:1,userId:newUser.trim(),createdAt:now,creator:'18942914433',status:'启用'},...current.map((item,index)=>({...item,seq:index+2}))]);setAdding(false);setNewUser('');setToast('新增成功');setTimeout(()=>setToast(''),1600);};
  const columns=[{key:'seq',label:'序号',width:75},{key:'operation',label:'操作',width:100,render:row=><button className="supplier-link-button" onClick={()=>setRows(current=>current.map(item=>item.id===row.id?{...item,status:item.status==='启用'?'禁用':'启用'}:item))}>{row.status==='启用'?'启用':'禁用'}</button>},{key:'id',label:'ID',width:100},{key:'userId',label:'用户ID',width:180},{key:'createdAt',label:'创建时间',width:210},{key:'creator',label:'创建人',width:180}];
  return <div className="supplier-page">{toast&&<div className="supplier-toast">✓ {toast}</div>}<div className="wallet-filter"><Select value="用户ID" onChange={()=>{}}><option>用户ID</option></Select><Input value={draft.keyword} onChange={value=>setDraft({...draft,keyword:value})} placeholder="请输入搜索内容"/><Select value={draft.status} onChange={value=>setDraft({...draft,status:value})}><option value="">请选择状态</option><option>启用</option><option>禁用</option></Select><div className="supplier-filter-actions"><Button primary onClick={()=>setFilters(draft)}>查 询</Button><Button onClick={()=>{setDraft(empty);setFilters(empty);}}>重 置</Button><Button onClick={()=>setAdding(true)}>新 增</Button></div></div><div className="supplier-card"><Table columns={columns} rows={visible} minWidth={920}/><Pagination total={filtered?visible.length:rows.length+Math.max(0,16-walletSeed.length)} pages={filtered?1:2} showJump/></div>
    {adding&&<Modal title="新增钱包白名单" className="wallet-add-modal" onClose={()=>setAdding(false)} footer={<><Button onClick={()=>setAdding(false)}>取 消</Button><Button primary disabled={!newUser.trim()} onClick={add}>确 定</Button></>}><Field label="用户ID" required><Input value={newUser} onChange={setNewUser} placeholder="请输入用户ID"/></Field></Modal>}
  </div>;
}

const boundUsers=[{id:'bound-1',seq:1,userType:'查看',userId:'154577209',phone:'18936984401',avatar:'A',nickname:'',gender:'',qq:'',status:'启用',registeredAt:'2025-10-30 15:06:34'},{id:'bound-2',seq:2,userType:'查看',userId:'154419373',phone:'17779287745',avatar:'B',nickname:'',gender:'female',qq:'',status:'启用',registeredAt:'2025-10-30 14:55:10'}];

export function BoundUsersPage() {
  const empty={keyword:'',start:'',end:''};const [draft,setDraft]=useState(empty);const [filters,setFilters]=useState(empty);const [binding,setBinding]=useState(null);const [agent,setAgent]=useState('');const [toast,setToast]=useState('');
  const visible=boundUsers.filter(row=>(!filters.keyword||row.phone.includes(filters.keyword))&&(!filters.start||row.registeredAt.slice(0,10)>=filters.start)&&(!filters.end||row.registeredAt.slice(0,10)<=filters.end));
  const columns=[{key:'seq',label:'序号',width:75},{key:'userType',label:'用户类型',width:140,render:row=><button className="supplier-link-button" onClick={()=>{setBinding(row);setAgent('');}}>查看</button>},{key:'userId',label:'用户ID',width:170},{key:'phone',label:'手机号',width:170},{key:'avatar',label:'头像',width:160,render:row=><div className={`bound-avatar avatar-${row.avatar.toLowerCase()}`}>{row.avatar==='A'?'机':'猫'}</div>},{key:'nickname',label:'昵称',width:150},{key:'gender',label:'性别',width:130},{key:'qq',label:'联系QQ',width:150},{key:'status',label:'用户状态',width:130},{key:'registeredAt',label:'注册时间',width:190}];
  return <div className="supplier-page">{toast&&<div className="supplier-toast">✓ {toast}</div>}<div className="bound-filter"><Select value="手机号" onChange={()=>{}}><option>手机号</option></Select><Input value={draft.keyword} onChange={value=>setDraft({...draft,keyword:value})} placeholder="请输入搜索内容"/><div className="supplier-date-range"><Input type="date" value={draft.start} onChange={value=>setDraft({...draft,start:value})}/><span>→</span><Input type="date" value={draft.end} onChange={value=>setDraft({...draft,end:value})}/></div><div className="supplier-filter-actions"><Button primary onClick={()=>setFilters(draft)}>查 询</Button><Button onClick={()=>{setDraft(empty);setFilters(empty);}}>重 置</Button></div></div><div className="supplier-card"><Table columns={columns} rows={visible} minWidth={1500}/><Pagination total={visible.length}/></div>
    {binding&&<Modal title="绑定专属客服" className="bind-agent-modal" onClose={()=>setBinding(null)}><Field label="专属客服" required><Select value={agent} onChange={setAgent}><option value="">请选择专属客服</option><option value="18942914433">邓辉（18942914433）</option><option value="17779287745">客服小茄（17779287745）</option><option value="154420045">客服专员（154420045）</option></Select></Field><div className="bind-agent-action"><Button primary disabled={!agent} onClick={()=>{setBinding(null);setToast(`用户 ${binding.userId} 绑定成功`);setTimeout(()=>setToast(''),1600);}}>绑 定</Button></div></Modal>}
  </div>;
}
