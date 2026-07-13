import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api';

const statuses = ['全部','pending','selling','offline','locked','rented','settled','rejected'];
const statusLabels = { pending:'待审核', selling:'已上架', offline:'已下架', locked:'已锁定', rented:'已出租', settled:'已结单', rejected:'审核失败' };

export default function SellerProducts() {
  const [status, setStatus] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const p = new URLSearchParams(); if (status !== '全部') p.set('status', status); if (keyword) p.set('keyword', keyword);
    const d = await request(`/seller/products?${p}`);
    setProducts(d.list || []);
    setLoading(false);
  };
  useEffect(() => { fetchProducts(); }, [status]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-[#202125]">我的商品</h1>
        <Link to="/publish" className="ml-auto px-4 py-2 rounded-lg text-white text-sm font-medium" style={{background:'linear-gradient(90deg,#34393E,#252A2F)'}}>发布商品</Link>
      </div>
      <div className="flex gap-1 mb-4 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded text-sm ${status===s ? 'bg-[#202125] text-white' : 'bg-white text-[#64687A] border border-[#E8EAED]'}`}>{statusLabels[s]||s}</button>
        ))}
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="搜索商品编号..." className="ml-auto bg-[#F7F8FA] border border-[#E8EAED] rounded px-3 py-1.5 text-sm w-40" />
        <button onClick={fetchProducts} className="px-3 py-1.5 rounded bg-white border border-[#E8EAED] text-[#64687A] text-sm">搜索</button>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="bg-white border border-[#E8EAED] rounded-lg p-4 h-16 animate-pulse"/>)}</div>
      : products.length===0 ? <div className="text-center py-12 text-[#9EAAB9]">暂无商品</div>
      : <div className="space-y-3">
        {products.map(p => (
          <Link key={p.id} to={`/publish?edit=${p.id}`} className="block bg-white border border-[#E8EAED] rounded-lg p-4 hover:border-[#4452A9] no-underline">
            <div className="flex justify-between items-start">
              <div><span className="text-xs text-[#9EAAB9]">#{p.productNo}</span><span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#F7F8FA] text-[#64687A]">{statusLabels[p.status]}</span></div>
              <span className="text-[#FF7D00] font-bold">¥{(p.price/100).toFixed(2)}</span>
            </div>
            <div className="flex gap-4 text-xs text-[#9EAAB9] mt-2">
              <span>{p.server} · {p.loginMethod}</span><span>总资产 {p.totalAsset}M</span><span>纯币 {p.hafuCoin}M</span><span>{p.rank}</span>
            </div>
          </Link>
        ))}
      </div>}
    </div>
  );
}
