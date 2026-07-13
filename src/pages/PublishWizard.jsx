import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { request } from '../api';

const steps = ['账号信息','账号资产','皮肤资产','交易信息'];
const ranks = ['巅峰','钻石','铂金','黄金','白银','青铜','黑鹰','无段位'];
const safeBoxes = ['无','黄金(2×3)','顶级(3×3)'];

export default function PublishWizard() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const editId = sp.get('edit');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    server:'QQ',loginMethod:'QQ',accountLoginType:'账密登录',rank:'青铜',level:60,loginRegion:'武汉',banRecord:0,faceOwner:1,
    hafuCoin:'',totalAsset:'',trainingCenter:1,safeBox:'无',firingRange:1,kdRatio:'',
    operatorSkins:[],gunSkins:[],knifeSkins:[],extraItemsCharge:false,extraItems:[],
    ratioType:'standard',standardRatio:'',quickRatio:'',netAmount:'',deposit:'',rentDays:'',remark:''
  });

  useEffect(() => { const d = localStorage.getItem('publish_draft'); if (d && !editId) setForm(JSON.parse(d)); }, []);
  useEffect(() => {
    if (editId) request(`/products/${editId}`).then(d => setForm({
      server:d.server||'QQ',loginMethod:d.loginMethod||'QQ',accountLoginType:d.accountLoginType||'账密登录',rank:d.rank||'青铜',
      level:d.level||60,loginRegion:d.loginRegion||'武汉',banRecord:d.banRecord==='有封禁记录'?1:0,faceOwner:d.faceOwner?1:0,
      hafuCoin:d.hafuCoin||'',totalAsset:d.totalAsset||'',trainingCenter:d.trainingCenter||1,safeBox:d.safeBox||'无',firingRange:d.firingRange||1,kdRatio:d.kdRatio||'',
      operatorSkins:d.skinAssets?.operatorSkins||[],gunSkins:d.skinAssets?.gunSkins||[],knifeSkins:d.skinAssets?.knifeSkins||[],
      extraItemsCharge:(d.extraItems||[]).length>0,extraItems:d.extraItems||[],
      ratioType:d.ratioType||'standard',standardRatio:d.ratio||'',quickRatio:'',netAmount:d.price||'',deposit:d.deposit||'',rentDays:d.rentDays||'',remark:d.remark||''
    }));
  }, [editId]);

  const update = (k, v) => { const f = { ...form, [k]: v }; setForm(f); localStorage.setItem('publish_draft', JSON.stringify(f)); };
  const handleEstimate = async () => {
    setLoading(true);
    try { const d = await request('/products/estimate', { method: 'POST', body: JSON.stringify({ hafuCoin: parseInt(form.hafuCoin), trainingCenter: form.trainingCenter, safeBox: form.safeBox }) });
      update('standardRatio', d.standardRatio); update('quickRatio', d.quickRatio); update('netAmount', Math.round(d.netAmount/100)); update('deposit', Math.round(d.suggestedDeposit/100)); update('rentDays', d.suggestedPeriod); }
    catch(e) {}
    setLoading(false);
  };
  const handleNetChange = v => { update('netAmount', v); if (v && form.hafuCoin) update('standardRatio', Math.round(parseFloat(v)/parseInt(form.hafuCoin)*100)/100); };
  const handlePublish = async () => {
    setLoading(true);
    try { await request('/products/publish', { method: 'POST', body: JSON.stringify({ ...form, price: parseInt(form.netAmount)*100, deposit: parseInt(form.deposit)*100, rentDays: parseInt(form.rentDays), ratio: parseInt(form.standardRatio), hafuCoin: parseInt(form.hafuCoin), totalAsset: parseInt(form.totalAsset), level: parseInt(form.level), banRecord: form.banRecord?'有封禁记录':'无封禁记录', faceOwner: !!form.faceOwner, kdRatio: parseFloat(form.kdRatio)||0, skinAssets: { operatorSkins:form.operatorSkins, gunSkins:form.gunSkins, knifeSkins:form.knifeSkins }, extraItems: form.extraItems }) });
      localStorage.removeItem('publish_draft'); alert('发布成功！'); navigate('/seller'); }
    catch(e) { alert(e.message); }
    setLoading(false);
  };

  const btnStyle = { background: 'linear-gradient(90deg, #34393E, #252A2F)' };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-[#202125] mb-6">{editId ? '编辑商品' : '发布商品'}</h1>
      <div className="flex mb-8">
        {steps.map((s,i) => (
          <button key={i} onClick={() => i<step && setStep(i)}
            className={`flex-1 py-2 text-center text-sm rounded-lg ${i===step ? 'bg-[#202125] text-white' : i<step ? 'bg-[#F2F3F5] text-[#64687A] cursor-pointer' : 'bg-[#F7F8FA] text-[#C8CAD1]'}`}>
            {i+1}. {s} {i<step?'✅':''}
          </button>
        ))}
      </div>
      <div className="bg-white border border-[#E8EAED] rounded-xl p-6">
        {step === 0 && <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="大区" value={form.server} onChange={v => update('server',v)} options={['QQ','微信']}/>
            <Field label="登录方式" value={form.loginMethod} onChange={v => update('loginMethod',v)} options={['QQ','微信']}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="账密方式" value={form.accountLoginType} onChange={v => update('accountLoginType',v)} options={['账密登录','扫码登录']}/>
            <Field label="段位" value={form.rank} onChange={v => update('rank',v)} options={ranks}/>
          </div>
          <div className="grid grid-cols-3 gap-4"><Input label="等级" value={form.level} onChange={v=>update('level',v)} type="number"/><Input label="登录地" value={form.loginRegion} onChange={v=>update('loginRegion',v)}/><Input label="绝密KD" value={form.kdRatio} onChange={v=>update('kdRatio',v)} type="number" step="0.1"/></div>
          <label className="flex items-center gap-2 text-sm text-[#29344A]"><input type="checkbox" checked={!!form.banRecord} onChange={e=>update('banRecord',e.target.checked?1:0)}/>有封禁记录</label>
          <label className="flex items-center gap-2 text-sm text-[#29344A]"><input type="checkbox" checked={!!form.faceOwner} onChange={e=>update('faceOwner',e.target.checked?1:0)}/>已人脸</label>
        </div>}

        {step === 1 && <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><Input label="哈夫币纯币(M)" value={form.hafuCoin} onChange={v=>update('hafuCoin',v)} type="number"/><Input label="总资产(M)" value={form.totalAsset} onChange={v=>update('totalAsset',v)} type="number"/></div>
          <Input label="训练中心" value={form.trainingCenter} onChange={v=>update('trainingCenter',v)} type="number"/>
          <Field label="安全箱" value={form.safeBox} onChange={v=>update('safeBox',v)} options={safeBoxes}/>
          <Input label="靶场等级" value={form.firingRange} onChange={v=>update('firingRange',v)} type="number"/>
        </div>}

        {step === 2 && <div className="space-y-4">
          <SkinSelect label="干员皮肤" value={form.operatorSkins} onChange={v=>update('operatorSkins',v)}/>
          <SkinSelect label="枪皮" value={form.gunSkins} onChange={v=>update('gunSkins',v)}/>
          <SkinSelect label="刀皮" value={form.knifeSkins} onChange={v=>update('knifeSkins',v)}/>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.extraItemsCharge} onChange={e=>update('extraItemsCharge',e.target.checked)}/>额外道具付费设置</label>
          {form.extraItemsCharge && <div className="space-y-2 pl-6">{['AWM子弹','6头','6甲','红弹','巴雷特','3×3体验卡'].map(item => <div key={item} className="flex items-center gap-3"><span className="text-sm text-[#64687A] w-20">{item}</span>
            <input type="number" placeholder="单价(元)" className="w-24 bg-[#F7F8FA] border border-[#E8EAED] rounded px-3 py-1.5 text-sm" onChange={e=>{ const its=[...form.extraItems]; const idx=its.findIndex(i=>i.name===item); if(idx>=0)its[idx]={name:item,unitPrice:parseFloat(e.target.value)||0}; else its.push({name:item,unitPrice:parseFloat(e.target.value)||0}); update('extraItems',its.filter(i=>i.unitPrice>0)); }}/></div>)}</div>}
        </div>}

        {step === 3 && <div className="space-y-4">
          <div className="bg-[#F7F8FA] rounded-lg p-4"><div className="grid grid-cols-2 gap-3 text-sm"><div className="flex justify-between"><span className="text-[#64687A]">标准比例</span><span className="text-[#FF7D00] font-bold">{form.standardRatio||'-'}</span></div><div className="flex justify-between"><span className="text-[#64687A]">快出比例</span><span className="text-[#FF7D00] font-bold">{form.quickRatio||'-'}</span></div></div>
            <button onClick={handleEstimate} disabled={loading||!form.hafuCoin} className="mt-3 px-4 py-2 rounded bg-[#4452A9] text-white text-sm disabled:opacity-50">{loading?'计算中...':'重新估价'}</button></div>
          <div className="grid grid-cols-2 gap-4"><Input label="到手金额(元)" value={form.netAmount} onChange={handleNetChange} type="number"/><Input label="押金(元)" value={form.deposit} onChange={v=>update('deposit',v)} type="number"/></div>
          <div className="grid grid-cols-2 gap-4"><Input label="推荐租期(天)" value={form.rentDays} onChange={v=>update('rentDays',v)} type="number"/>
            <Field label="比例类型" value={form.ratioType} onChange={v=>update('ratioType',v)} options={[{v:'standard',l:'标准比例'},{v:'quick',l:'快出比例'}]}/></div>
          <Input label="商品备注" value={form.remark} onChange={v=>update('remark',v)}/>
        </div>}
        <div className="flex justify-between mt-8">
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} className="px-6 py-2.5 rounded-lg bg-[#F2F3F5] text-[#64687A] hover:bg-[#E8EAED] disabled:opacity-30">上一步</button>
          {step < 3 ? <button onClick={()=>setStep(s=>Math.min(3,s+1))} className="px-6 py-2.5 rounded-lg text-white font-bold" style={btnStyle}>下一步</button>
          : <button onClick={handlePublish} disabled={loading} className="px-8 py-2.5 rounded-lg bg-[#017A7E] text-white font-bold disabled:opacity-50">{loading?'发布中...':'确认发布'}</button>}
        </div>
      </div>
    </div>
  );
}

function Field({label,value,onChange,options}) {
  return <div><label className="block text-sm text-[#29344A] mb-2">{label}</label>
    <select value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-2.5 text-sm text-[#202125]">
      {options.map(o=> <option key={typeof o==='object'?o.v:o} value={typeof o==='object'?o.v:o}>{typeof o==='object'?o.l:o}</option>)}</select></div>;
}
function Input({label,value,onChange,type,step}) {
  return <div><label className="block text-sm text-[#29344A] mb-2">{label}</label>
    <input type={type||'text'} step={step} value={value} onChange={e=>onChange(e.target.value)}
      className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-2.5 text-sm text-[#202125]"/></div>;
}
function SkinSelect({label,value,onChange}) {
  const [text,setText]=useState('');
  const add = () => { if(!text.trim()) return; onChange([...value,{name:text,level:'normal'}]); setText(''); };
  return <div><label className="block text-sm text-[#29344A] mb-2">{label}</label><div className="flex gap-2 mb-2">
    <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="输入皮肤名，回车添加" className="flex-1 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-3 py-1.5 text-sm"/>
    <button onClick={add} className="px-3 py-1.5 rounded bg-[#F2F3F5] text-[#64687A] text-sm">+</button></div>
    {value.length>0 && <div className="flex flex-wrap gap-2">{value.map((s,i)=> <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F7F8FA] text-xs text-[#29344A]">{s.name}<button onClick={()=>onChange(value.filter((_,j)=>j!==i))} className="text-[#9EAAB9] hover:text-red-500">×</button></span>)}</div>}</div>;
}
