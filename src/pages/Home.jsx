import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';

const ranks = ['全部','巅峰','钻石','铂金','黄金','白银','青铜','黑鹰','无段位'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ server: '', loginMethod: '', hafuCoinMin: '', hafuCoinMax: '', priceMin: '', priceMax: '', rank: '', keyword: '', sortBy: 'default' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const params = { page, pageSize: 12 };
    if (filters.server) params.server = filters.server;
    if (filters.loginMethod) params.loginMethod = filters.loginMethod;
    if (filters.hafuCoinMin) params.hafuCoinMin = filters.hafuCoinMin;
    if (filters.hafuCoinMax) params.hafuCoinMax = filters.hafuCoinMax;
    if (filters.priceMin) params.priceMin = filters.priceMin;
    if (filters.priceMax) params.priceMax = filters.priceMax;
    if (filters.rank) params.rank = filters.rank;
    if (filters.keyword) params.keyword = filters.keyword;
    const data = await getProducts(params);
    setProducts(data.list || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, filters]);
  const updateFilter = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); setPage(1); };
  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      {/* Banner区 */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img src="/assets/home-banner.png" alt="" className="w-full h-24 object-cover" />
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-sm text-[#64687A]">区服</span>
        <select value={filters.server} onChange={e => updateFilter('server', e.target.value)} className="bg-[#F2F3F5] border border-[#E8EAED] rounded px-3 py-1.5 text-sm text-[#202125]">
          <option value="">选择大区</option><option value="QQ">QQ</option><option value="微信">微信</option>
        </select>
        <select value={filters.loginMethod} onChange={e => updateFilter('loginMethod', e.target.value)} className="bg-[#F2F3F5] border border-[#E8EAED] rounded px-3 py-1.5 text-sm text-[#202125]">
          <option value="">选择登录方式</option><option value="QQ">QQ</option><option value="微信">微信</option>
        </select>
        <span className="text-sm text-[#64687A]">哈夫币纯币(M)</span>
        {['0-100','100-200','200-500'].map(r => {
          const [min,max] = r.split('-');
          const active = filters.hafuCoinMin === min && filters.hafuCoinMax === max;
          return <button key={r} onClick={() => active ? (updateFilter('hafuCoinMin',''), updateFilter('hafuCoinMax','')) : (updateFilter('hafuCoinMin',min), updateFilter('hafuCoinMax',max))} className={`px-3 py-1.5 text-sm rounded ${active ? 'bg-[#202125] text-white' : 'bg-[#F2F3F5] text-[#64687A]'}`}>{r}</button>;
        })}
        <input value={filters.priceMin} onChange={e => updateFilter('priceMin', e.target.value)} type="number" placeholder="最低价" className="w-20 bg-[#F2F3F5] border border-[#E8EAED] rounded px-2 py-1.5 text-sm text-[#202125]" />
        <span className="text-[#64687A]">-</span>
        <input value={filters.priceMax} onChange={e => updateFilter('priceMax', e.target.value)} type="number" placeholder="最高价" className="w-20 bg-[#F2F3F5] border border-[#E8EAED] rounded px-2 py-1.5 text-sm text-[#202125]" />
        <button onClick={fetchProducts}
          className="px-4 py-1.5 rounded text-sm font-medium bg-[#C8CAD1] text-black hover:bg-[#64687A] hover:text-white transition-colors">查询</button>
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-[#F2F3F5] text-[#64687A] px-3 py-1.5 rounded text-sm">{showAdvanced ? '收起▲' : '展开高级筛选'}</button>
        <button onClick={() => { setFilters({ server:'',loginMethod:'',hafuCoinMin:'',hafuCoinMax:'',priceMin:'',priceMax:'',rank:'',keyword:'',sortBy:'default' }); setPage(1); }}
          className="bg-[#F2F3F5] text-[#64687A] px-3 py-1.5 rounded text-sm">清空筛选</button>
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#F2F3F5]/50 rounded">
          {ranks.map(r => (
            <button key={r} onClick={() => updateFilter('rank', r === '全部' ? '' : r)}
              className={`px-3 py-1 rounded text-xs ${filters.rank === r || (r === '全部' && !filters.rank) ? 'bg-[#202125] text-white' : 'bg-white text-[#64687A] border border-[#E8EAED]'}`}>{r}</button>
          ))}
        </div>
      )}

      {/* 排序 */}
      <div className="flex gap-1 mb-4">
        {[{k:'default',l:'综合排序'},{k:'price_asc',l:'价格排序'},{k:'hafu_coin',l:'纯币数量'},{k:'ratio',l:'比例排序'},{k:'safe_box',l:'安全箱'}].map(s => (
          <button key={s.k} onClick={() => updateFilter('sortBy', s.k)}
            className={`px-4 py-2 text-sm ${filters.sortBy === s.k ? 'text-black font-medium border-b-2 border-black' : 'text-[#64687A] hover:text-black'}`}>{s.l}</button>
        ))}
      </div>

      {/* 商品列表 */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-lg border border-[#E8EAED] h-48 animate-pulse" />)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-[#9EAAB9]">暂无符合条件的商品</div>
      ) : (
        <>
          <div className="space-y-2">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="block bg-white rounded-lg border border-[#E8EAED] hover:border-[#4452A9] hover:shadow-sm transition-all no-underline">
                <div className="flex gap-4 p-4">
                  <div className="w-48 h-32 bg-[#F2F3F5] rounded flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="/assets/card-placeholder.png" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {p.ratioType === 'quick' && <span className="text-xs bg-[#E6F7FF] text-[#4452A9] px-2 py-0.5 rounded font-medium">特惠</span>}
                      <span className="bg-[#EBF9FF] text-[#017A7E] text-xs px-2 py-0.5 rounded font-medium">1元={p.ratio}万</span>
                      <span className="text-xs text-[#9EAAB9] ml-auto">#{p.productNo}</span>
                    </div>
                    <p className="text-xs text-[#64687A] mb-2">登入区服:{p.server} 总资产:{p.totalAsset}M 纯币资产:{p.hafuCoin}M 段位:{p.rank} 等级:{p.level}级</p>
                    <div className="flex flex-wrap gap-1 text-xs text-[#64687A] mb-2">
                      <span>封禁记录:{p.banRecord}</span><span>|</span><span>人脸归属:{p.faceOwner?'是':'否'}</span>
                      {p.kdRatio>0 && <><span>|</span><span>绝密KD:{p.kdRatio}</span></>}
                      <span>|</span><span>租期{p.rentDays}天</span>
                      <span>|</span><span>{p.rank}</span>
                      <span>|</span><span>{p.level}级</span>
                    </div>
                    {(p.topSkins?.length>0 || p.extraItemNames?.length>0) && (
                      <div className="text-xs text-[#64687A] mb-2">{[...(p.topSkins||[]),...(p.extraItemNames||[])].slice(0,4).join(' / ')}</div>
                    )}
                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {[{v:p.hafuCoin+'万',l:'哈夫币纯币'},{v:p.safeBox||'-',l:'安全箱'},{v:(p.trainingCenter||'')+'级',l:'训练中心'},{v:'详情',l:'更多资产'},{v:'0/13',l:'持有枪皮'},{v:'0/12',l:'持有刀皮'}].map((g,i) => (
                        <div key={i} className="bg-[#F7F8FA] rounded px-2 py-1 text-center">
                          <div className="text-xs font-medium text-[#202125]">{g.v}</div>
                          <div className="text-[10px] text-[#9EAAB9]">{g.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="text-xs text-[#9EAAB9]">押金：￥{(p.deposit/100).toFixed(0)}</div>
                    <div className="text-lg font-bold text-[#FF7D00]">¥{(p.price/100).toFixed(2)}</div>
                    <span className="px-5 py-2 rounded text-white text-sm font-medium whitespace-nowrap" style={{ background: 'linear-gradient(90deg, #34393E, #252A2F)' }}>立即租玩</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 rounded bg-white border border-[#E8EAED] text-[#64687A] disabled:opacity-30">{'<'}</button>
              <span className="px-3 py-1 text-[#64687A] text-sm">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 rounded bg-white border border-[#E8EAED] text-[#64687A] disabled:opacity-30">{'>'}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
