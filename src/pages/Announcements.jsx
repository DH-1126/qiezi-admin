import { useState, useEffect } from 'react';
import { request } from '../api';

export default function Announcements() {
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { request('/announcements').then(d => { setList(d.list||[]); setLoading(false); }); }, []);
  const openDetail = async (id) => { setDetail(await request(`/announcements/${id}`)); };

  if (detail) return (
    <div className="max-w-3xl mx-auto">
      <button onClick={()=>setDetail(null)} className="text-[#4452A9] hover:text-[#202125] mb-6 bg-transparent border-none cursor-pointer text-sm">← 返回列表</button>
      <h1 className="text-xl font-bold text-[#202125] mb-4">{detail.title}</h1>
      <p className="text-[#9EAAB9] text-xs mb-6">{detail.publishTime}</p>
      <div className="text-[#29344A] leading-relaxed whitespace-pre-wrap">{detail.content}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-[#202125] mb-6">官方公告</h1>
      {loading ? <div className="space-y-3">{[1,2].map(i=><div key={i} className="bg-white border border-[#E8EAED] rounded-lg p-4 h-16 animate-pulse"/>)}</div>
      : <div className="space-y-3">
        {list.map(a => (
          <button key={a.id} onClick={() => openDetail(a.id)} className="block w-full text-left bg-white border border-[#E8EAED] rounded-lg p-4 hover:border-[#4452A9] cursor-pointer">
            <h3 className="font-bold text-[#202125] mb-1">{a.title}</h3><p className="text-xs text-[#9EAAB9]">{a.publishTime} · {a.summary}</p>
          </button>
        ))}
      </div>}
      <div className="mt-8 bg-white border border-[#E8EAED] rounded-xl p-6">
        <h2 className="font-bold text-[#202125] mb-4">帮助中心</h2>
        {['如何发布商品？','如何租用账号？','充值后余额没到账？','押金什么时候退还？','提现多久到账？','被拦截怎么办？'].map((q,i) => (
          <details key={i} className="border-b border-[#E8EAED]/50 py-3 cursor-pointer"><summary className="text-[#29344A] text-sm font-medium">{q}</summary>
            <p className="text-[#64687A] text-sm mt-2 ml-4">{['点击"出哈夫币"→"发布商品"，按四步向导填写。','在首页浏览商品，点击"立即租玩"支付即可。','充值实时到账，如未到账请联系客服。','租期结束无纠纷后，押金自动退回钱包。','提交后管理员审核通过即到账，一般1个工作日内。','请先完成实名认证和支付宝绑定。'][i]}</p></details>))}
      </div>
    </div>
  );
}
