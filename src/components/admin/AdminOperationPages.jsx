import { useMemo, useState } from 'react';
import './AdminOperationPages.css';

const NOW = '2026-07-17 15:30:00';
const IMAGE = `${import.meta.env.BASE_URL}assets/card-placeholder.png`;
const BANNER = `${import.meta.env.BASE_URL}assets/home-banner.png`;

const businessSeed = [
  {id:3,appId:'leigodMallPro_pcb03dfc',name:'雷神商城-推广平台',createdAt:'2023-11-03 14:14:50',updatedAt:'2023-11-03 14:14:54'},
  {id:2,appId:'speedMallWeb_ncb01mef',name:'平台业务-雷神商城',createdAt:'2023-02-08 17:41:49',updatedAt:'2023-02-15 11:44:08'},
  {id:1,appId:'nn_aksjfdasoifnkls_5',name:'平台业务-会员订单',createdAt:'2020-09-22 15:17:30',updatedAt:'2022-05-11 19:06:31'},
];

const noticeText = '1. 进入官方游戏社区后，点击左下角的“游戏加速”即可进入加速页。2. 进入加速页后，可以在右上角查看剩余加速时长，开启/暂停时长，也可以选择合适的线路一键开始加速。';
const noticeSeed = Array.from({length:10},(_,index)=>({
  id:51-index,
  type:index===0?'帮助中心':index===1?'游戏资讯':'关于我们',
  content:noticeText,
  publishedAt:'2025-10-23 10:05:17',
  updatedAt:'2025-10-29 13:51:23',
  operator:index===0?'13997505254':index===1?'admin':'管理员',
}));

const adSeed = [
  [60,'web官方公告banner','官方公告','启用',21,'admin','2023-05-11 09:04:55'],
  [46,'web首页banner','首页顶部','启用',5,'admin','2023-02-09 18:17:32'],
  [50,'web出哈夫币banner','出哈夫币顶部','启用',5,'admin','2023-02-10 09:17:51'],
  [67,'web首页banner','首页banner2','启用',2,'17779287745','2026-06-01 14:44:24'],
  [59,'web哈夫币列表banner','哈夫币列表','启用',1,'admin','2023-04-07 14:01:21'],
  [65,'web二维码','二维码','启用',1,'18942914433','2026-02-12 15:21:02'],
  [70,'H5首页banner','banner','启用',1,'18942914433','2026-06-09 09:10:41'],
  [71,'H5首页banner','banner1','启用',1,'18942914433','2026-06-10 11:26:06'],
].map((row,index)=>({seq:index+1,id:row[0],type:row[1],name:row[2],status:row[3],sort:row[4],creator:row[5],createdAt:row[6],image:BANNER,thumbnail:IMAGE,link:''}));

const channelInfoSeed = [
  [211,'(211)薄荷战争雷霆-鸿文易宝','hwkj','24545040747369','2026-04-24 13:53:49','2026-04-24 13:53:49'],
  [207,'(207)茄子代售-微信原生支付','wx','1730650919','2026-03-04 17:54:34','2026-03-04 17:54:34'],
  [206,'(206)茄子代售-原生支付宝(手机应用)','ali','2021006123656518','2026-01-09 14:27:20','2026-01-09 14:27:20'],
  [205,'(205)茄子代售-原生支付宝(订单码)','ali','2021006121609073','2025-12-23 10:47:49','2025-12-23 13:58:40'],
  [204,'(204)NN-原生支付宝(手机应用)','ali','2019072465953556','2025-12-19 10:00:23','2025-12-23 13:59:07'],
  [202,'(202)茄子代售-原生支付宝(手机应用)','ali','2021006112618285','2025-11-27 11:21:26','2025-12-23 13:59:36'],
  [201,'(201)茄子代售-鸿闻易宝支付238031029','hwkj','23803102924247','2025-11-27 11:11:31','2025-11-27 11:11:31'],
  [200,'(200)茄子代售-原生支付宝(手机网站)','ali','2021006102691541','2025-11-27 11:25:32','2025-12-23 13:59:59'],
  [133,'(133)薄荷商城(大商户)-鸿闻支付211051124078','hwkj','21105112407893','2026-04-24 14:30:15','2026-04-24 14:30:37'],
].map(row=>({
  id:row[0],
  name:row[1],
  englishName:row[2],
  merchantNo:row[3],
  createdAt:row[4],
  updatedAt:row[5],
  params:JSON.stringify({merchant_no:row[3],channel:row[2],notify_url:'https://demo.qiezi.com/pay/notify'},null,2),
}));

const paymentPoolSeed = [
  [206,'(206)茄子代售-原生支付宝(手机应用)','ali','2021006123656518','支付宝扫码支付','PC','启用','2026-01-09 13:55:49','2026-04-30 11:25:27'],
  [133,'(133)薄荷商城(大商户)-鸿闻支付211051124078','hwkj','21105112407893','支付宝APP支付','Android','启用','2026-04-24 14:31:08','2026-04-24 14:31:08'],
  [211,'(211)薄荷战争雷霆-鸿文易宝','hwkj','24545040747369','支付宝APP支付','Android','启用','2026-04-24 13:54:15','2026-04-24 13:54:15'],
  [201,'(201)茄子代售-鸿闻易宝支付238031029','hwkj','23803102924247','支付宝APP支付','Android','启用','2026-01-09 13:55:16','2026-04-21 16:32:27'],
  [207,'(207)茄子代售-微信原生支付','wx','1730650919','微信H5支付','雷神商城H5','启用','2026-03-05 10:34:08','2026-03-30 16:41:15'],
  [201,'(201)茄子代售-鸿闻易宝支付238031029','hwkj','23803102924247','微信H5支付','雷神商城H5','禁用','2025-11-27 13:41:54','2026-03-30 16:39:11'],
  [207,'(207)茄子代售-微信原生支付','wx','1730650919','微信JSAPI支付','雷神商城H5','启用','2026-03-05 10:38:30','2026-03-30 16:24:23'],
  [207,'(207)茄子代售-微信原生支付','wx','1730650919','微信扫码支付','PC','启用','2026-03-04 21:59:56','2026-03-04 21:59:56'],
  [205,'(205)茄子代售-原生支付宝(订单码)','ali','2021006121609073','支付宝扫码支付','PC','启用','2025-12-23 10:48:33','2026-02-06 17:20:51'],
  [200,'(200)茄子代售-原生支付宝(手机网站)','ali','2021006102691541','支付宝扫码支付','PC','启用','2025-11-27 11:30:53','2026-01-12 10:58:43'],
].map((row,index)=>({id:index+1,appId:'speedMallWeb_ncb01mef',businessId:'sp_scd9fo388143',channelId:row[0],channelName:row[1],englishName:row[2],merchantNo:row[3],payType:row[4],client:row[5],status:row[6],createdAt:row[7],updatedAt:row[8]}));

const feeSeed = [
  [206,'(206)茄子代售-原生支付宝(手机应用)','ali','2021006123656518','支付宝扫码支付','PC','启用','2025-11-27 11:34:22','2026-04-30 11:25:52','0'],
  [211,'(211)薄荷战争雷霆-鸿文易宝','hwkj','24545040747369','支付宝APP支付','Android','启用','2025-12-19 09:56:06','2026-04-24 16:29:48','0.65'],
  [207,'(207)茄子代售-微信原生支付','wx','1730650919','微信JSAPI支付','雷神商城H5','启用','2026-03-05 10:38:45','2026-03-30 20:25:15','0.60'],
  [201,'(201)茄子代售-鸿闻易宝支付238031029','hwkj','23803102924247','微信H5支付','雷神商城H5','禁用','2025-11-27 13:42:34','2026-03-30 19:54:59','0.70'],
  [200,'(200)茄子代售-原生支付宝(手机网站)','ali','2021006102691541','支付宝H5支付','雷神商城H5','启用','2025-11-27 11:12:24','2026-03-30 19:54:42','0.60'],
  [207,'(207)茄子代售-微信原生支付','wx','1730650919','微信扫码支付','PC','启用','2025-11-27 11:12:13','2026-03-30 17:38:07','0.60'],
].map((row,index)=>({id:index+1,appId:'speedMallWeb_ncb01mef',businessId:'sp_scd9fo388143',channelId:row[0],channelName:row[1],englishName:row[2],merchantNo:row[3],payType:row[4],client:row[5],status:row[6],createdAt:row[7],updatedAt:row[8],feeRate:row[9]}));

function Button({children,primary=false,danger=false,disabled=false,onClick}) {
  return <button className={`operation-button ${primary?'primary':''} ${danger?'danger':''}`} disabled={disabled} onClick={onClick}>{children}</button>;
}

function Input({value,onChange,placeholder,type='text',className='',disabled=false}) {
  return <input className={`operation-input ${className}`} type={type} value={value} disabled={disabled} onChange={event=>onChange(event.target.value)} placeholder={placeholder}/>;
}

function Select({value,onChange,children,className=''}) {
  return <select className={`operation-input ${className}`} value={value} onChange={event=>onChange(event.target.value)}>{children}</select>;
}

function PageTable({columns,rows,total=rows.length,selectable=false,selected,onSelect,minWidth=1100}) {
  const all=selectable&&rows.length>0&&rows.every(row=>selected.has(row.id));
  return <div className="operation-card"><div className="operation-table-tools"><span>↻</span><span>↕</span><span>⚙</span></div><div className="operation-table-wrap"><table className="operation-table" style={{minWidth}}><thead><tr>{selectable&&<th className="operation-check"><input type="checkbox" checked={all} onChange={event=>onSelect(event.target.checked?new Set(rows.map(row=>row.id)):new Set())}/></th>}{columns.map(column=><th key={column.key} style={{width:column.width}}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={row.id}>{selectable&&<td className="operation-check"><input type="checkbox" checked={selected.has(row.id)} onChange={()=>{const next=new Set(selected);if(next.has(row.id))next.delete(row.id);else next.add(row.id);onSelect(next);}}/></td>}{columns.map(column=><td className={column.align==='left'?'left':''} key={column.key}>{column.render?column.render(row,index):(row[column.key]??'-')}</td>)}</tr>)}</tbody></table></div><div className="operation-pagination"><span>共 {total} 条数据</span><button className="active">1</button>{total>10&&<button>2</button>}{total>20&&<><button>3</button><button>4</button><button>5</button></>}<select defaultValue="10"><option>10 条/页</option><option>20 条/页</option></select>{total>10&&<><span>跳至</span><input/><span>页</span></>}</div></div>;
}

function Modal({title,onClose,onConfirm,children,confirmDisabled=false,width=''}) {
  return <div className="operation-modal-mask" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><div className="operation-modal" style={width?{width}:undefined}><div className="operation-modal-header"><strong>{title}</strong><button onClick={onClose}>×</button></div><div className="operation-modal-body">{children}</div><div className="operation-modal-footer"><Button onClick={onClose}>取 消</Button><Button primary disabled={confirmDisabled} onClick={onConfirm}>确 定</Button></div></div></div>;
}

function Drawer({title,onClose,onConfirm,children,confirmDisabled=false}) {
  return <div className="operation-drawer-mask" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><section className="operation-drawer"><div className="operation-drawer-header"><button onClick={onClose}>×</button><strong>{title}</strong></div><div className="operation-drawer-body">{children}</div><div className="operation-drawer-footer"><Button onClick={onClose}>取 消</Button><Button primary disabled={confirmDisabled} onClick={onConfirm}>确 定</Button></div></section></div>;
}

function ConfirmDialog({message,onClose,onConfirm}) {
  return <div className="operation-modal-mask"><div className="operation-confirm"><div><span>!</span><section><h3>提示</h3><p>{message}</p></section></div><footer><Button onClick={onClose}>取 消</Button><Button primary onClick={onConfirm}>确 定</Button></footer></div></div>;
}

function DeletePopover({position,onClose,onConfirm}) {
  const left=Math.min(window.innerWidth-170,Math.max(16,position.x-76));
  const top=Math.min(window.innerHeight-110,Math.max(16,position.y-106));
  return <div className="operation-popover-layer" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><div className="operation-delete-popover" style={{left,top}}><p><span>!</span>确定删除吗?</p><footer><Button onClick={onClose}>取 消</Button><Button primary onClick={onConfirm}>确 认</Button></footer></div></div>;
}

function RadioStatus({value,onChange}) {
  return <div className="operation-radio-group"><label><input type="radio" name="operation-status" checked={value==='禁用'} onChange={()=>onChange('禁用')}/> 禁用</label><label><input type="radio" name="operation-status" checked={value==='启用'} onChange={()=>onChange('启用')}/> 启用</label></div>;
}

function UploadBox({value,label,onClick}) {
  return <button type="button" className={`operation-upload-box ${value?'has-image':''}`} onClick={onClick}>{value?<img src={value} alt={label}/>:<><b>＋</b><span>{label}</span></>}</button>;
}

function Field({label,required=false,children}) {
  return <label className="operation-field"><span>{required&&<i>*</i>}{label}</span>{children}</label>;
}

function Status({value}) { return <span className={`operation-status ${value==='启用'?'enabled':'disabled'}`}>{value}</span>; }
function RowActions({children}) { return <div className="operation-row-actions">{children}</div>; }

export function BusinessAppsPage() {
  const [rows,setRows]=useState(businessSeed);
  const [draft,setDraft]=useState({appId:'',name:''});
  const [filters,setFilters]=useState(draft);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({appId:'',name:''});
  const [deleting,setDeleting]=useState(null);
  const visible=rows.filter(row=>(!filters.appId||row.appId.includes(filters.appId))&&(!filters.name||row.name.includes(filters.name)));
  const openForm=row=>{setEditing(row||{});setForm(row?{appId:row.appId,name:row.name}:{appId:'',name:''});};
  const save=()=>{if(editing.id)setRows(current=>current.map(row=>row.id===editing.id?{...row,...form,updatedAt:NOW}:row));else setRows(current=>[{id:Math.max(...current.map(row=>row.id))+1,...form,createdAt:NOW,updatedAt:NOW},...current]);setEditing(null);};
  const columns=[{key:'id',label:'子系统ID',width:110},{key:'appId',label:'子系统AppID',width:260},{key:'name',label:'子系统名称',width:220},{key:'createdAt',label:'创建时间',width:180},{key:'updatedAt',label:'更新时间',width:180},{key:'actions',label:'操作',width:130,render:row=><RowActions><button onClick={()=>openForm(row)}>编辑</button><button className="red" onClick={event=>setDeleting({row,x:event.clientX,y:event.clientY})}>删除</button></RowActions>}];
  return <div className="operation-page">
    <div className="operation-query"><Field label="子系统AppID"><Input value={draft.appId} onChange={value=>setDraft({...draft,appId:value})} placeholder="请输入子系统AppID"/></Field><Field label="子系统名称"><Input value={draft.name} onChange={value=>setDraft({...draft,name:value})} placeholder="请输入子系统名称"/></Field><Button primary onClick={()=>setFilters(draft)}>查询</Button><Button onClick={()=>{const empty={appId:'',name:''};setDraft(empty);setFilters(empty);}}>重置</Button></div>
    <div className="operation-toolbar"><Button primary onClick={()=>openForm(null)}>新增</Button></div>
    <PageTable columns={columns} rows={visible} minWidth={1100}/>
    {editing&&<Modal title={editing.id?'编辑子系统':'新增子系统'} onClose={()=>setEditing(null)} onConfirm={save} confirmDisabled={!form.appId.trim()||!form.name.trim()} width="580px"><div className="business-modal-fields"><Field label="子系统AppID" required><Input disabled={Boolean(editing.id)} value={form.appId} onChange={value=>setForm({...form,appId:value})} placeholder="请输入子系统AppID"/></Field><Field label="子系统名称" required><Input value={form.name} onChange={value=>setForm({...form,name:value})} placeholder="请输入子系统名称"/></Field></div></Modal>}
    {deleting&&<DeletePopover position={deleting} onClose={()=>setDeleting(null)} onConfirm={()=>{setRows(current=>current.filter(row=>row.id!==deleting.row.id));setDeleting(null);}}/>}
  </div>;
}

export function SystemNoticesPage() {
  const [rows,setRows]=useState(noticeSeed);
  const [type,setType]=useState('');
  const [filterType,setFilterType]=useState('');
  const [selected,setSelected]=useState(new Set());
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({type:'帮助中心',content:'',publishedAt:'2026-07-17T15:30'});
  const [deleting,setDeleting]=useState(null);
  const visible=rows.filter(row=>!filterType||row.type===filterType);
  const openForm=row=>{setEditing(row||{});setForm(row?{type:row.type,content:row.content,publishedAt:row.publishedAt.replace(' ','T').slice(0,16)}:{type:'帮助中心',content:'',publishedAt:'2026-07-17T15:30'});};
  const save=()=>{const payload={type:form.type,content:form.content,publishedAt:form.publishedAt.replace('T',' ')+':00',updatedAt:NOW,operator:'邓辉'};if(editing.id)setRows(current=>current.map(row=>row.id===editing.id?{...row,...payload}:row));else setRows(current=>[{id:Math.max(...current.map(row=>row.id))+1,...payload},...current]);setEditing(null);};
  const removeIds=ids=>{setRows(current=>current.filter(row=>!ids.has(row.id)));setSelected(new Set());setDeleting(null);};
  const columns=[{key:'actions',label:'操作',width:110,render:row=><RowActions><button onClick={()=>openForm(row)}>编辑</button><button className="red" onClick={()=>setDeleting(new Set([row.id]))}>删除</button></RowActions>},{key:'id',label:'公告ID',width:90},{key:'type',label:'公告类型',width:110},{key:'content',label:'公告信息',width:480,align:'left',render:row=><div className="operation-ellipsis" title={row.content}>{row.content}</div>},{key:'publishedAt',label:'发布时间',width:180},{key:'updatedAt',label:'最后修改时间',width:180},{key:'operator',label:'操作人',width:130}];
  return <div className="operation-page"><div className="operation-query"><Field label="公告类型"><Select value={type} onChange={setType}><option value="">请选择公告类型</option><option>帮助中心</option><option>游戏资讯</option><option>关于我们</option></Select></Field><Button primary onClick={()=>setFilterType(type)}>搜 索</Button><Button onClick={()=>{setType('');setFilterType('');}}>重 置</Button></div><div className="operation-toolbar"><Button primary onClick={()=>openForm(null)}>创建内容</Button><Button danger disabled={!selected.size} onClick={()=>setDeleting(new Set(selected))}>批量删除</Button></div><div className="operation-selection">{selected.size?`已选择 ${selected.size} 项`:'未选中任何数据'}</div><PageTable columns={columns} rows={visible} total={filterType?visible.length:49} selectable selected={selected} onSelect={setSelected} minWidth={1280}/>{editing&&<Modal title={editing.id?'编辑公告':'创建内容'} onClose={()=>setEditing(null)} onConfirm={save} confirmDisabled={!form.content.trim()} width="720px"><Field label="公告类型" required><Select value={form.type} onChange={value=>setForm({...form,type:value})}><option>帮助中心</option><option>游戏资讯</option><option>关于我们</option></Select></Field><Field label="公告信息" required><textarea className="operation-textarea" value={form.content} onChange={event=>setForm({...form,content:event.target.value})} placeholder="请输入公告内容"/></Field><Field label="发布时间" required><Input type="datetime-local" value={form.publishedAt} onChange={value=>setForm({...form,publishedAt:value})}/></Field></Modal>}{deleting&&<ConfirmDialog message={`确认删除选中的 ${deleting.size} 条公告吗？`} onClose={()=>setDeleting(null)} onConfirm={()=>removeIds(deleting)}/>}</div>;
}

export function AdSlotsPage() {
  const [rows,setRows]=useState(adSeed);
  const [draft,setDraft]=useState({type:'',name:'',status:''});
  const [filters,setFilters]=useState(draft);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({type:'web首页banner',name:'',status:'',sort:'',image:'',thumbnail:'',link:''});
  const [deleting,setDeleting]=useState(null);
  const [preview,setPreview]=useState('');
  const visible=rows.filter(row=>(!filters.type||row.type===filters.type)&&(!filters.name||row.name.includes(filters.name.trim()))&&(!filters.status||row.status===filters.status));
  const openForm=row=>{setEditing(row||{});setForm(row?{type:row.type,name:row.name,status:row.status,sort:String(row.sort),image:row.image,thumbnail:row.thumbnail||IMAGE,link:row.link||''}:{type:'web首页banner',name:'',status:'',sort:'',image:'',thumbnail:'',link:''});};
  const save=()=>{const payload={...form,sort:Number(form.sort)||1,creator:'邓辉'};if(editing.id)setRows(current=>current.map(row=>row.id===editing.id?{...row,...payload}:row));else setRows(current=>[...current,{seq:current.length+1,id:Math.max(...current.map(row=>row.id))+1,...payload,createdAt:NOW}]);setEditing(null);};
  const columns=[{key:'seq',label:'序号',width:70},{key:'actions',label:'操作',width:160,render:row=><RowActions><button onClick={()=>openForm(row)}>编辑</button><button onClick={()=>setRows(current=>current.map(item=>item.id===row.id?{...item,status:item.status==='启用'?'禁用':'启用'}:item))}>{row.status==='启用'?'禁用':'启用'}</button><button className="red" onClick={()=>setDeleting(row)}>删除</button></RowActions>},{key:'id',label:'ID',width:80},{key:'type',label:'广告类型',width:180},{key:'name',label:'广告名称',width:140},{key:'status',label:'状态',width:90,render:row=><Status value={row.status}/>},{key:'image',label:'图片',width:80,render:row=><button className="operation-link" onClick={()=>setPreview(row.image)}>查看</button>},{key:'sort',label:'排序',width:80},{key:'creator',label:'创建人',width:130},{key:'createdAt',label:'创建时间',width:180}];
  return <div className="operation-page">
    <div className="operation-query operation-query-stacked"><Field label="广告类型"><Select value={draft.type} onChange={value=>setDraft({...draft,type:value})}><option value="">广告类型选择</option>{[...new Set(rows.map(row=>row.type))].map(type=><option key={type}>{type}</option>)}</Select></Field><Field label="广告名称"><Input value={draft.name} onChange={value=>setDraft({...draft,name:value})} placeholder="请输入广告名称"/></Field><Field label="状态"><Select value={draft.status} onChange={value=>setDraft({...draft,status:value})}><option value="">状态选择</option><option>启用</option><option>禁用</option></Select></Field><div className="operation-query-actions"><Button onClick={()=>{const empty={type:'',name:'',status:''};setDraft(empty);setFilters(empty);}}>重 置</Button><Button primary onClick={()=>setFilters(draft)}>查 询</Button><Button onClick={()=>openForm(null)}>创 建</Button></div></div>
    <PageTable columns={columns} rows={visible} minWidth={1320}/>
    {editing&&<Drawer title={editing.id?'编辑广告位':'新增广告位'} onClose={()=>setEditing(null)} onConfirm={save} confirmDisabled={!form.name.trim()||!form.sort||!form.image||!form.status}>
      <div className="ad-drawer-form">
        <Field label="广告类型选择" required><Select value={form.type} onChange={value=>setForm({...form,type:value})}><option>web首页banner</option><option>web官方公告banner</option><option>web出哈夫币banner</option><option>web哈夫币列表banner</option><option>web二维码</option><option>H5首页banner</option></Select></Field>
        <Field label="广告名称" required><Input value={form.name} onChange={value=>setForm({...form,name:value})} placeholder="请输入广告名称"/></Field>
        <Field label="排序" required><Input type="number" value={form.sort} onChange={value=>setForm({...form,sort:value})} placeholder="请输入排序"/></Field>
        <Field label="状态" required><RadioStatus value={form.status} onChange={value=>setForm({...form,status:value})}/></Field>
        <Field label="图片" required><UploadBox value={form.image} label="请上传广告图" onClick={()=>setForm({...form,image:BANNER})}/></Field>
        {!editing.id&&<Field label="缩略图" required><UploadBox value={form.thumbnail} label="请上传广告缩略图" onClick={()=>setForm({...form,thumbnail:IMAGE})}/></Field>}
        <Field label="跳转链接"><Input value={form.link} onChange={value=>setForm({...form,link:value})} placeholder="请输入跳转链接"/></Field>
      </div>
    </Drawer>}
    {deleting&&<ConfirmDialog message={`确认删除广告位“${deleting.name}”吗？`} onClose={()=>setDeleting(null)} onConfirm={()=>{setRows(current=>current.filter(row=>row.id!==deleting.id));setDeleting(null);}}/>}
    {preview&&<div className="operation-image-mask" onClick={()=>setPreview('')}><div><button onClick={()=>setPreview('')}>×</button><img src={preview} alt="广告图片"/></div></div>}
  </div>;
}

export function PaymentChannelInfoPage() {
  const [rows,setRows]=useState(channelInfoSeed);
  const [draft,setDraft]=useState({id:'',name:'',merchantNo:''});
  const [filters,setFilters]=useState(draft);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({id:'',name:'',englishName:'',merchantNo:'',params:''});
  const [jsonMessage,setJsonMessage]=useState('');
  const visible=rows.filter(row=>(!filters.id||String(row.id).includes(filters.id))&&(!filters.name||row.name.includes(filters.name))&&(!filters.merchantNo||row.merchantNo.includes(filters.merchantNo)));
  const openForm=row=>{setEditing(row||{});setJsonMessage('');setForm(row?{id:String(row.id),name:row.name,englishName:row.englishName,merchantNo:row.merchantNo,params:row.params}:{id:'',name:'',englishName:'',merchantNo:'',params:'{\n  "merchant_no": "",\n  "channel": ""\n}'});};
  const save=()=>{const payload={id:Number(form.id),name:form.name,englishName:form.englishName,merchantNo:form.merchantNo,params:form.params,updatedAt:NOW};if(editing.id)setRows(current=>current.map(row=>row.id===editing.id?{...row,...payload}:row));else setRows(current=>[{...payload,createdAt:NOW},...current]);setEditing(null);};
  const columns=[{key:'id',label:'支付通道id',width:110},{key:'name',label:'支付通道名称',width:300},{key:'englishName',label:'支付通道英文名',width:150},{key:'merchantNo',label:'商户号',width:190},{key:'createdAt',label:'创建时间',width:180},{key:'updatedAt',label:'更新时间',width:180},{key:'actions',label:'操作',width:90,render:row=><RowActions><button onClick={()=>openForm(row)}>编辑</button></RowActions>}];
  const formatJson=()=>{try{setForm(current=>({...current,params:JSON.stringify(JSON.parse(current.params),null,2)}));setJsonMessage('');}catch{setJsonMessage('JSON格式错误');}};
  const validateJson=()=>{try{JSON.parse(form.params);setJsonMessage('JSON格式正确');}catch{setJsonMessage('JSON格式错误');}};
  return <div className="operation-page">
    <div className="operation-query"><Field label="支付通道ID"><Input value={draft.id} onChange={value=>setDraft({...draft,id:value})} placeholder="请输入支付通道ID"/></Field><Field label="支付通道名称"><Input value={draft.name} onChange={value=>setDraft({...draft,name:value})} placeholder="请输入支付通道名称"/></Field><Field label="商户号"><Input value={draft.merchantNo} onChange={value=>setDraft({...draft,merchantNo:value})} placeholder="请输入商户号"/></Field><Button primary onClick={()=>setFilters(draft)}>查询</Button><Button onClick={()=>{const empty={id:'',name:'',merchantNo:''};setDraft(empty);setFilters(empty);}}>重置</Button></div>
    <div className="operation-toolbar"><Button primary onClick={()=>openForm(null)}>新增</Button></div>
    <PageTable columns={columns} rows={visible} minWidth={1250}/>
    {editing&&<Modal title={editing.id?'编辑支付通道':'新增支付通道'} onClose={()=>setEditing(null)} onConfirm={save} confirmDisabled={!form.id||!form.name.trim()||!form.englishName.trim()||!form.merchantNo.trim()||!form.params.trim()} width="660px">
      <Field label="支付通道id"><Input disabled={Boolean(editing.id)} type="number" value={form.id} onChange={value=>setForm({...form,id:value})}/></Field>
      <Field label="支付通道名称" required><Input value={form.name} onChange={value=>setForm({...form,name:value})}/></Field>
      <Field label="支付通道英文名称" required><Input value={form.englishName} onChange={value=>setForm({...form,englishName:value})}/></Field>
      <Field label="商户号" required><Input value={form.merchantNo} onChange={value=>setForm({...form,merchantNo:value})}/></Field>
      <Field label="通道参数信息 ⓘ" required><textarea className="operation-textarea operation-json-area" value={form.params} onChange={event=>setForm({...form,params:event.target.value})}/></Field>
      <div className="operation-json-actions"><button onClick={formatJson}>格式化</button><button onClick={validateJson}>校验</button><button className="red" onClick={()=>{setForm({...form,params:''});setJsonMessage('');}}>清空</button>{jsonMessage&&<span className={jsonMessage.includes('正确')?'success':'error'}>{jsonMessage}</span>}</div>
    </Modal>}
  </div>;
}

function PaymentConfigPage({mode='pool'}) {
  const source=mode==='fee'?feeSeed:paymentPoolSeed;
  const [rows,setRows]=useState(source);
  const [draft,setDraft]=useState({channelId:'',channelName:'',merchantNo:'',appId:'',businessId:'',client:'',payType:'',status:''});
  const [filters,setFilters]=useState(draft);
  const [editing,setEditing]=useState(null);
  const blankForm={appId:'',businessId:'',channelId:'',channelName:'',englishName:'',merchantNo:'',payType:'',client:'',status:'',feeRate:''};
  const [form,setForm]=useState(blankForm);
  const visible=useMemo(()=>rows.filter(row=>Object.entries(filters).every(([key,value])=>!value||String(row[key]).includes(value))),[rows,filters]);
  const openForm=row=>{setEditing(row||{});setForm(row?{...row,channelId:String(row.channelId),feeRate:row.feeRate||'0'}:{...blankForm});};
  const chooseChannel=value=>{const channel=channelInfoSeed.find(item=>String(item.id)===value);setForm(current=>({...current,channelId:value,channelName:channel?.name||'',englishName:channel?.englishName||'',merchantNo:channel?.merchantNo||''}));};
  const save=()=>{const payload={...form,channelId:Number(form.channelId),updatedAt:NOW};if(editing.id)setRows(current=>current.map(row=>row.id===editing.id?{...row,...payload}:row));else setRows(current=>[{id:Math.max(...current.map(row=>row.id))+1,...payload,createdAt:NOW},...current]);setEditing(null);};
  const columns=[{key:'appId',label:'应用id',width:210},{key:'businessId',label:'子业务ID',width:190},{key:'channelId',label:'支付通道id',width:110},{key:'channelName',label:'支付通道名称',width:310},{key:'englishName',label:'支付通道英文名',width:140},{key:'merchantNo',label:'商户号',width:190},{key:'payType',label:'支付方式',width:150},{key:'client',label:'客户端',width:120},{key:'status',label:'状态',width:90,render:row=><Status value={row.status}/>},{key:'createdAt',label:'创建时间',width:180},{key:'updatedAt',label:'更新时间',width:180},{key:'actions',label:'操作',width:80,render:row=><RowActions><button onClick={()=>openForm(row)}>编辑</button></RowActions>}];
  const updateDraft=(key,value)=>setDraft(current=>({...current,[key]:value}));
  const appFields=<>
    <Field label="业务应用id" required><Select value={form.appId} onChange={value=>setForm({...form,appId:value})}><option value="">请选择业务应用id</option><option value="speedMallWeb_ncb01mef">茄子商城</option><option value="leigodMallPro_pcb03dfc">雷神商城-推广平台</option></Select></Field>
    <Field label="子系统业务id" required><Select value={form.businessId} onChange={value=>setForm({...form,businessId:value})}><option value="">请选择子系统业务id</option><option value="sp_scd9fo388143">茄子商城</option><option value="mall_pay_2026">商城支付业务</option></Select></Field>
    <Field label="客户端类型" required><Select value={form.client} onChange={value=>setForm({...form,client:value})}><option value="">请选择客户端类型</option><option>PC</option><option>Android</option><option>雷神商城H5</option></Select></Field>
    <Field label="支付类型" required><Select value={form.payType} onChange={value=>setForm({...form,payType:value})}><option value="">请选择支付类型</option><option>支付宝扫码支付</option><option>支付宝APP支付</option><option>支付宝H5支付</option><option>微信H5支付</option><option>微信JSAPI支付</option><option>微信扫码支付</option></Select></Field>
  </>;
  const channelFields=<>
    <Field label="支付通道id" required><Select value={form.channelId} onChange={chooseChannel}><option value="">请选择支付通道</option>{channelInfoSeed.map(channel=><option key={channel.id} value={channel.id}>{channel.id}</option>)}</Select></Field>
    <Field label="商户号"><Input disabled value={form.merchantNo} onChange={()=>{}}/></Field>
    <Field label="支付通道英文名称"><Input disabled value={form.englishName} onChange={()=>{}}/></Field>
  </>;
  const confirmDisabled=!form.appId||!form.businessId||!form.client||!form.payType||!form.channelId||!form.status;
  return <div className="operation-page">
    <div className="operation-query payment-config-query"><Field label="支付通道ID"><Input value={draft.channelId} onChange={value=>updateDraft('channelId',value)} placeholder="请输入支付通道ID"/></Field><Field label="支付通道名称"><Input value={draft.channelName} onChange={value=>updateDraft('channelName',value)} placeholder="请输入支付通道名称"/></Field><Field label="商户号"><Input value={draft.merchantNo} onChange={value=>updateDraft('merchantNo',value)} placeholder="请输入商户号"/></Field><Field label="业务应用id"><Select value={draft.appId} onChange={value=>updateDraft('appId',value)}><option value="">请选择业务应用id</option><option>speedMallWeb_ncb01mef</option><option>leigodMallPro_pcb03dfc</option></Select></Field><Field label="子系统业务id"><Select value={draft.businessId} onChange={value=>updateDraft('businessId',value)}><option value="">请选择子系统业务id</option><option>sp_scd9fo388143</option><option>mall_pay_2026</option></Select></Field><Field label="客户端类型"><Select value={draft.client} onChange={value=>updateDraft('client',value)}><option value="">请选择客户端类型</option><option>PC</option><option>Android</option><option>雷神商城H5</option></Select></Field><Field label="支付类型"><Select value={draft.payType} onChange={value=>updateDraft('payType',value)}><option value="">请选择支付类型</option><option>支付宝扫码支付</option><option>支付宝APP支付</option><option>支付宝H5支付</option><option>微信H5支付</option><option>微信JSAPI支付</option><option>微信扫码支付</option></Select></Field><Field label="状态"><Select value={draft.status} onChange={value=>updateDraft('status',value)}><option value="">请选择状态</option><option>启用</option><option>禁用</option></Select></Field><div className="operation-query-actions"><Button primary onClick={()=>setFilters(draft)}>查询</Button><Button onClick={()=>{const empty={channelId:'',channelName:'',merchantNo:'',appId:'',businessId:'',client:'',payType:'',status:''};setDraft(empty);setFilters(empty);}}>重置</Button></div></div>
    <div className="operation-toolbar"><Button primary onClick={()=>openForm(null)}>新增</Button></div>
    <PageTable columns={columns} rows={visible} total={Object.values(filters).some(Boolean)?visible.length:(mode==='fee'?6:15)} minWidth={2050}/>
    {editing&&<Modal title={editing.id?'编辑支付通道池':'新增支付通道池'} onClose={()=>setEditing(null)} onConfirm={save} confirmDisabled={confirmDisabled} width="660px">
      <div className="payment-pool-form">
        {mode==='fee'?<>{appFields}<Field label="手续费率"><Input type="number" value={form.feeRate} onChange={value=>setForm({...form,feeRate:value})} placeholder="请输入手续费率"/></Field>{channelFields}</>:<>{channelFields}{appFields}</>}
        <Field label="状态" required><RadioStatus value={form.status} onChange={value=>setForm({...form,status:value})}/></Field>
      </div>
    </Modal>}
  </div>;
}

export function PaymentChannelConfigPage() { return <PaymentConfigPage mode="pool"/>; }
export function FeeConfigPage() { return <PaymentConfigPage mode="fee"/>; }
