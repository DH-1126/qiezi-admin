import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import './Home.css';

const figmaAssets = `${import.meta.env.BASE_URL}assets/figma-v2/`;
const advancedFilters = ['价格区间', '安全箱', '靶场等级', '训练中心', '账号等级', '段位', '绝密KD', '持有刀皮', '持有枪皮', '干员皮肤', '人脸归属', '封禁记录', '常用登录地'];
const hotSearches = ['36-39比例', 'M7-棱镜攻势S2', '6格6体', '9格7体顶格', '彦祖', 'AS Val-悬赏令', '北极星'];

const defaultFilters = {
  server: '', loginMethod: '', hafuCoinMin: '', hafuCoinMax: '',
  priceMin: '', priceMax: '', rank: '', keyword: '',
};

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatCoin(value) {
  const amount = Number(value || 0);
  if (amount >= 100) return `${(amount / 100).toFixed(amount % 100 ? 2 : 1)}亿`;
  return `${amount}00万`;
}

function ProductCard({ product, index, backgroundLocation }) {
  const isOffline = product.status === 'offline';
  const skins = parseList(product.topSkins);
  const extras = parseList(product.extraItemNames);
  const training = Math.max(3, Math.min(7, Math.round((product.level || 42) / 9)));
  const firingRange = Math.max(3, Math.min(7, training - (index % 2)));
  const safeBox = Number(product.hafuCoin) >= 180 ? '3×3' : Number(product.hafuCoin) >= 90 ? '2×3' : '2×2';
  const otherAssets = [
    [`${index * 10}发`, 'AWM子弹'], [`${index % 4}个`, '六头'], [`${(index * 3) % 12}个`, '六甲'],
    [`${index % 3}组`, '红弹'], ['0组', '巴雷特'], [`${index % 2}个`, '3×3体验卡'],
  ];
  const city = ['河南省-郑州市', '广东省-深圳市', '湖北省-武汉市'][index % 3];

  return (
    <Link to={`/product/${product.id}`} state={{ backgroundLocation, product }} className={`web-product-card${isOffline ? ' is-offline' : ''}`}>
      <div className="web-card-primary">
        <div className="web-product-visual">
          <img className="web-product-image" src={`${figmaAssets}card-product.png`} alt="商品实拍" />
          <img className="web-card-watermark" src={`${figmaAssets}card-watermark.png`} alt="茄子代售" />
          <span className="web-photo-count"><img src={`${figmaAssets}photo-icon.svg`} alt="" />{Math.max(1, (index % 4) + 1)}</span>
        </div>

        <div className="web-product-main">
          <div className="web-product-heading">
            <div className="web-product-title-row">
              {isOffline && <span className="web-offline-badge">已下架</span>}
              {product.ratioType === 'quick' && <span className="web-special-badge">特惠</span>}
              <span className="web-ratio-badge">1元={product.ratio}万币</span>
              <h2>登录区服:{product.server?.split('-')[0]} 总资产：{product.totalAsset}M 纯币资产：{product.hafuCoin}M 账密：{product.loginMethod} 段位：{product.rank} 安全箱：{safeBox} 账号等级：{product.level}</h2>
            </div>

            <div className="web-product-meta">
              <span><em>{product.server?.replace('-', '苹果-') || 'QQ苹果'}</em> / {product.loginMethod} / {city}</span>
              <span>封禁记录：{product.banRecord || '无'}</span>
              <span>人脸归属：{product.faceOwner ? '是' : '否'}</span>
            </div>
          </div>

          <div className="web-tags">
            {product.kdRatio > 0 && <span>绝密KD：{product.kdRatio}</span>}
            <span>租期{product.rentDays}天</span><span>租期内打完</span><span>{product.rank}</span><span>{product.level}级</span>
            {[...skins, ...extras].slice(0, 2).map((item) => <span key={item}>{item}</span>)}
          </div>

          <div className="web-assets-row">
            <div className="web-core-assets">
              <div className="web-core-asset accent"><strong>{formatCoin(product.hafuCoin)}</strong><small>哈夫币纯币</small></div>
              <div className="web-core-asset accent"><strong>{safeBox}</strong><small>安全箱</small></div>
              <div className="web-core-asset"><strong>{training}级</strong><small>训练中心</small></div>
              <div className="web-core-asset"><strong>{firingRange}级</strong><small>靶场等级</small></div>
            </div>

            <div className="web-other-group">
              <div className="web-other-label">其他资产</div>
              <div className="web-other-content">
                <div className="web-other-assets">
                  {otherAssets.map(([value, label]) => <div key={label}><strong>{value}</strong><small>{label}</small></div>)}
                </div>
                <div className="web-skin-assets">
                  <div><img src={`${figmaAssets}card-gun-decoration.svg`} alt="" /><span><strong>0/13</strong><small>持有枪皮</small></span></div>
                  <div><img src={`${figmaAssets}card-knife-decoration.svg`} alt="" /><span><strong>{skins.length}/12</strong><small>持有刀皮</small></span></div>
                  <div><img src={`${figmaAssets}card-operator-decoration.svg`} alt="" /><span><strong>{Math.min(25, skins.length + extras.length)}/25</strong><small>干员皮肤</small></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="web-card-spacer" />

      <aside className="web-product-buy">
        <div className="web-buy-top">
          <span className="web-product-no">商品编号：{product.productNo}<b>复制</b></span>
          <p className="web-deposit">押金：<strong>￥{Math.round(product.deposit / 100)}</strong></p>
        </div>
        <div className="web-rent-action">
          <span>租金：<b>￥</b><strong>{Math.floor(product.price / 100)}</strong><i>.{String(product.price % 100).padStart(2, '0')}</i></span>
          <em>{isOffline ? '商品已下架' : '立即租玩'}</em>
        </div>
      </aside>
    </Link>
  );
}

export default function Home() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const urlKeyword = searchParams.get('keyword') || '';
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ ...defaultFilters, keyword: urlKeyword });
  const [sortBy, setSortBy] = useState('default');
  const [showAdvanced, setShowAdvanced] = useState(true);

  useEffect(() => {
    setFilters((current) => current.keyword === urlKeyword ? current : { ...current, keyword: urlKeyword });
    setPage(1);
  }, [urlKeyword]);

  useEffect(() => {
    let alive = true;
    const loadProducts = async () => {
      setLoading(true); setError('');
      const params = { page, pageSize: 10 };
      if (filters.server) params.server = filters.server;
      if (filters.loginMethod) params.loginMethod = filters.loginMethod;
      if (filters.hafuCoinMin) params.hafuCoinMin = filters.hafuCoinMin;
      if (filters.hafuCoinMax) params.hafuCoinMax = filters.hafuCoinMax;
      if (filters.priceMin) params.priceMin = Math.round(Number(filters.priceMin) * 100);
      if (filters.priceMax) params.priceMax = Math.round(Number(filters.priceMax) * 100);
      if (filters.rank) params.rank = filters.rank;
      if (filters.keyword) params.keyword = filters.keyword;
      try {
        const data = await getProducts(params);
        if (!alive) return;
        setProducts(data.list || []); setTotal(data.total || 0);
      } catch (requestError) {
        if (!alive) return;
        setProducts([]); setTotal(0); setError(requestError.message || '商品加载失败');
      } finally { if (alive) setLoading(false); }
    };
    loadProducts();
    return () => { alive = false; };
  }, [page, filters]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'price') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'coin') list.sort((a, b) => b.hafuCoin - a.hafuCoin);
    if (sortBy === 'ratio') list.sort((a, b) => b.ratio - a.ratio);
    return list;
  }, [products, sortBy]);

  const totalPages = Math.max(1, Math.ceil(total / 10));
  const updateFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1); };
  const chooseCoinRange = (min, max) => {
    const active = filters.hafuCoinMin === min && filters.hafuCoinMax === max;
    setFilters((current) => ({ ...current, hafuCoinMin: active ? '' : min, hafuCoinMax: active ? '' : max })); setPage(1);
  };

  return (
    <div className="web-home">
      <section className="web-hero" aria-label="租号优惠活动">
        <img className="web-hero-image" src={`${figmaAssets}home-banner.png`} alt="租号大优惠，比例低至1比34" />
        <img className="web-hero-dots" src={`${figmaAssets}banner-dots.svg`} alt="" />
      </section>

      <section className={`web-filter-panel ${showAdvanced ? 'expanded' : ''}`} aria-label="商品筛选">
        <div className="web-filter-row web-filter-primary">
          <div className="web-server-group">
            <b className="web-filter-label">区服</b>
            <select value={filters.server} onChange={(event) => updateFilter('server', event.target.value)} aria-label="选择大区">
              <option value="">选择大区</option><option value="QQ-安卓">QQ-安卓</option><option value="QQ-苹果">QQ-苹果</option><option value="微信-安卓">微信-安卓</option><option value="微信-苹果">微信-苹果</option>
            </select>
            <select className="login-select" value={filters.loginMethod} onChange={(event) => updateFilter('loginMethod', event.target.value)} aria-label="选择登录方式">
              <option value="">选择登录方式</option><option value="QQ扫码">QQ扫码</option><option value="微信扫码">微信扫码</option>
            </select>
          </div>

          <div className="web-coin-group">
            <b className="web-filter-label">哈夫币纯币</b>
            {[['0', '100'], ['100', '200'], ['200', '500']].map(([min, max]) => (
              <button className={`web-range-button ${filters.hafuCoinMin === min && filters.hafuCoinMax === max ? 'active' : ''}`} type="button" key={min} onClick={() => chooseCoinRange(min, max)}>
                <img src={`${figmaAssets}coin-icon.png`} alt="" />{min}-{max}M
              </button>
            ))}
            <div className="web-price-range">
              <input type="number" value={filters.priceMin} onChange={(event) => updateFilter('priceMin', event.target.value)} placeholder="最低价" aria-label="最低价" />
              <span>-</span>
              <input type="number" value={filters.priceMax} onChange={(event) => updateFilter('priceMax', event.target.value)} placeholder="最高价" aria-label="最高价" />
              <button type="button">查询</button>
            </div>
          </div>

          <button className="web-advanced-button" type="button" onClick={() => setShowAdvanced((value) => !value)}>
            <span>{showAdvanced ? '⌃' : '⌄'}</span>{showAdvanced ? '收起高级筛选' : '展开高级筛选'}
          </button>
        </div>

        {showAdvanced && (
          <>
            <div className="web-filter-row web-advanced-row">
              {advancedFilters.map((label) => (
                <button type="button" className={label === '段位' && filters.rank ? 'active' : ''} onClick={() => label === '段位' && updateFilter('rank', filters.rank ? '' : '巅峰')} key={label}>
                  {label}<img src={`${figmaAssets}down-icon.svg`} alt="" />
                </button>
              ))}
            </div>
            <div className="web-filter-row web-hot-row">
              <b className="web-filter-label">热门搜索</b>
              {hotSearches.map((label) => <button type="button" onClick={() => updateFilter('keyword', label)} key={label}>{label}</button>)}
            </div>
            <div className="web-filter-row web-selection-row">
              <b className="web-filter-label">我的选择</b>
              <span>价格：0-100元</span><span>安全箱：3×3</span><span>靶场等级：5级以上</span><span>训练中心：5级以上</span>
              <button type="button" onClick={() => { setFilters({ ...defaultFilters, keyword: urlKeyword }); setPage(1); }}>清空选择</button>
            </div>
          </>
        )}
      </section>

      <nav className="web-sort-bar" aria-label="商品排序">
        {[
          ['default', '综合排序'], ['price', '价格排序'], ['coin', '纯币数量'], ['ratio', '比例排序'], ['safe', '安全箱'],
        ].map(([key, label]) => (
          <button type="button" key={key} className={sortBy === key ? 'active' : ''} onClick={() => setSortBy(key)}>
            {label}{key !== 'default' && <img src={`${figmaAssets}${sortBy === key ? 'sort-active.svg' : 'sort-default.svg'}`} alt="" />}
          </button>
        ))}
      </nav>

      <section className="web-product-list" aria-live="polite">
        {loading && [0, 1, 2].map((item) => <div className="web-product-skeleton" key={item} />)}
        {!loading && error && <div className="web-empty-state"><strong>暂时无法加载商品</strong><span>{error}</span></div>}
        {!loading && !error && sortedProducts.length === 0 && <div className="web-empty-state"><strong>暂无符合条件的商品</strong><span>换个筛选条件试试</span></div>}
        {!loading && !error && sortedProducts.map((product, index) => <ProductCard product={product} index={index} backgroundLocation={location} key={product.id} />)}
      </section>

      {!loading && !error && total > 0 && (
        <div className="web-pagination">
          <span>共 {total} 条</span><button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1).map((pageNumber) => <button type="button" className={page === pageNumber ? 'active' : ''} onClick={() => setPage(pageNumber)} key={pageNumber}>{pageNumber}</button>)}
          {totalPages > 5 && <span className="web-pagination-ellipsis">•••</span>}{totalPages > 5 && <button type="button" onClick={() => setPage(totalPages)}>{totalPages}</button>}
          <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>›</button>
        </div>
      )}

      <Link to="/seller" className="web-business-entry" aria-label="进入商务合作申请">
        <span className="web-business-copy">
          <strong>商务合作找我</strong>
          <small>入驻享专属服务和现金奖励</small>
        </span>
        <span className="web-business-visual" aria-hidden="true">
          <i className="web-business-card"><img src={`${figmaAssets}logo-mark.svg`} alt="" /></i>
          <i className="web-business-envelope" />
        </span>
      </Link>

      <button type="button" className="web-floating-service" aria-label="在线客服"><span>◉</span><em>在线客服</em></button>
    </div>
  );
}
