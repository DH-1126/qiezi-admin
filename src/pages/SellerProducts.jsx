import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './SellerProducts.css';

const statusTabs = [
  ['all', '全部商品', '▣'],
  ['pending', '待审核', '◷'],
  ['selling', '已上架', '●'],
  ['offline', '已下架', '■'],
  ['shipping', '待发货', '◕'],
  ['rented', '已出租', '↯'],
  ['completed', '已结单', '◆'],
  ['failed', '审核失败', '!'],
];

const demoProducts = [
  {
    id: 'demo-01', productNo: '945992508487', status: 'failed', publishedAt: '2026-04-28 09:39:53', server: 'QQ',
    loginMethod: '账密登录', totalAsset: 22, hafuCoin: 22, safeBox: '顶级安全箱(3*3)', firingRange: 3,
    level: 44, trainingCenter: 5, price: '56.42', rentDays: 3, reviewMessage: '审核失败:重复上架', imagePosition: '50% 22%',
  },
  {
    id: 'demo-02', productNo: '528302504921', status: 'failed', publishedAt: '2026-04-14 10:21:18', server: '微信',
    loginMethod: '扫码登录', totalAsset: 22, hafuCoin: 22, rank: '黄金', safeBox: '高级安全箱(2*3)', awmAmmo: 0,
    firingRange: 4, level: 55, trainingCenter: 3, price: '52.39', rentDays: 3, reviewMessage: '审核失败:重复上架', imagePosition: '50% 34%',
  },
];

export default function SellerProducts() {
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const banner = `${import.meta.env.BASE_URL}assets/seller/sell-hafu-banner.webp`;
  const productImage = `${import.meta.env.BASE_URL}assets/figma-v2/card-product.png`;

  const products = useMemo(() => demoProducts.filter((item) => {
    const matchesStatus = status === 'all' || item.status === status;
    const value = keyword.trim().toLowerCase();
    const matchesKeyword = !value || `${item.productNo}${item.server}${item.rank || ''}${item.loginMethod}`.toLowerCase().includes(value);
    return matchesStatus && matchesKeyword;
  }), [keyword, status]);

  const copyProductNo = async (productNo) => {
    try { await navigator.clipboard.writeText(productNo); } catch { /* clipboard permissions are browser controlled */ }
  };

  const startNewPublish = () => {
    localStorage.removeItem('publish_draft');
  };

  return (
    <div className="seller-page">
      <img className="seller-banner" src={banner} alt="封号包赔，高额赔付比例" />

      <div className="seller-workbench">
        <aside className="seller-sidebar" aria-label="商品状态筛选">
          {statusTabs.map(([value, label, icon]) => (
            <button key={value} type="button" className={status === value ? 'active' : ''} onClick={() => setStatus(value)}>
              <i>{icon}</i><span>{label}</span>
            </button>
          ))}
        </aside>

        <section className="seller-products-panel">
          <div className="seller-products-toolbar">
            <label className="seller-list-search">
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="请输入商品编号或关键词查询" />
              <span aria-hidden="true">⌕</span>
            </label>
            <Link className="seller-publish-button" to="/publish" onClick={startNewPublish}><span>✥</span>出哈夫币</Link>
          </div>

          <div className="seller-product-list">
            {products.length ? products.map((product) => (
              <article className="seller-product-card" key={product.id}>
                <header>
                  <div>商品编号:{product.productNo}<button type="button" onClick={() => copyProductNo(product.productNo)}>复制</button><span>发布时间：{product.publishedAt}</span></div>
                  <em>{product.reviewMessage}</em>
                </header>
                <div className="seller-product-body">
                  <img src={productImage} style={{ objectPosition: product.imagePosition }} alt="三角洲行动商品" />
                  <div className="seller-product-detail">
                    <strong>
                      登录区服:{product.server} 总资产：{product.totalAsset} M 纯币资产：{product.hafuCoin} M 账密：{product.loginMethod}
                      {product.rank ? ` 段位：${product.rank}` : ''} 安全箱：{product.safeBox}
                      {product.awmAmmo !== undefined ? ` awm子弹：${product.awmAmmo}` : ''} 靶场等级：{product.firingRange}级 账号等级：{product.level} 训练中心：{product.trainingCenter}级
                    </strong>
                    <p>游戏区服：三角洲行动&nbsp;&nbsp;登录方式：{product.server}</p>
                    <div><span>到手金额：</span><b>¥{product.price}</b><i /><span>{product.rentDays} 天起租</span></div>
                  </div>
                  <Link className="seller-edit-button" to={`/publish?edit=${product.id}`}>编辑</Link>
                </div>
              </article>
            )) : <div className="seller-empty"><b>没有找到相关商品</b><span>换个筛选条件试试看</span></div>}
          </div>

          <div className="seller-pagination">
            <span>共 {products.length} 条</span><button type="button">10 条/页⌄</button><button type="button">‹</button><b>1</b><button type="button">›</button><span>前往</span><input aria-label="前往页码" />
          </div>
        </section>
      </div>
    </div>
  );
}
