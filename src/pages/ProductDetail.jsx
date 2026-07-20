import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createOrder, getProduct, orderAction } from '../api';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const detailAssets = `${import.meta.env.BASE_URL}assets/product-detail/`;
const figmaAssets = `${import.meta.env.BASE_URL}assets/figma-v2/`;

const fallbackGallery = [
  `${detailAssets}detail-main.jpg`,
  `${detailAssets}detail-shot.png`,
];

const skinGroups = {
  knife: [
    { name: '暗星', image: `${detailAssets}knife-dark.webp`, grade: 'top' },
    { name: '黑海', image: `${detailAssets}knife-blue.webp`, grade: 'top' },
  ],
  operator: [
    { name: '蛊-能天使 / 午夜邮差', image: `${figmaAssets}card-product.png`, grade: 'normal' },
    { name: '乌鲁鲁-荒原猎手', image: `${detailAssets}detail-shot.png`, grade: 'normal' },
  ],
};

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list : [];
  } catch {
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
  }
}

function formatCoin(value) {
  const amount = Number(value || 0);
  if (amount >= 100) return `${(amount / 100).toFixed(amount % 100 ? 2 : 1)}亿`;
  return `${amount}00万`;
}

function formatPrice(cents) {
  return (Number(cents || 0) / 100).toFixed(2);
}

function DetailModalFrame({ children, onClose }) {
  return (
    <div className="detail-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="detail-modal-shell" role="dialog" aria-modal="true" aria-label="商品详情">
        <button type="button" className="detail-modal-close" onClick={onClose} aria-label="关闭商品详情">×</button>
        <header className="detail-modal-header">商品详情</header>
        <div className="detail-modal-scroll">{children}</div>
      </section>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const routeProduct = location.state?.product?.id === id ? location.state.product : null;
  const [product, setProduct] = useState(routeProduct);
  const [loading, setLoading] = useState(!routeProduct);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [buying, setBuying] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');
  const [skinTab, setSkinTab] = useState('knife');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const closeModal = () => {
    if (location.state?.backgroundLocation) navigate(-1);
    else navigate('/');
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => { if (event.key === 'Escape') closeModal(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    let alive = true;
    if (!routeProduct) setLoading(true);
    setError('');
    getProduct(id)
      .then((data) => { if (alive) setProduct(data); })
      .catch((requestError) => {
        if (!alive || routeProduct) return;
        setError(requestError.message || '商品加载失败');
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, retryKey, routeProduct]);

  const gallery = useMemo(() => {
    const remoteImages = parseList(product?.images).filter((image) => image && !image.includes('card-placeholder'));
    return remoteImages.length ? remoteImages : fallbackGallery;
  }, [product]);

  const handleBuy = async () => {
    if (!user) return navigate('/login');
    if (user.kycStatus !== 'verified') return window.alert('请先完成实名认证');
    setBuying(true);
    try {
      const order = await createOrder(product.id);
      await orderAction(order.orderId, 'pay');
      window.alert('支付成功！');
      navigate('/orders');
    } catch (buyError) {
      window.alert(buyError.message || '下单失败');
    } finally {
      setBuying(false);
    }
  };

  const copyProductNo = async () => {
    try {
      await navigator.clipboard.writeText(product.productNo);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (loading) return <DetailModalFrame onClose={closeModal}><div className="detail-status">商品加载中...</div></DetailModalFrame>;
  if (error || !product) {
    return <DetailModalFrame onClose={closeModal}><div className="detail-status"><strong>商品加载失败</strong><span>{error || '暂时无法获取商品信息'}</span><div><button type="button" onClick={() => setRetryKey((value) => value + 1)}>重新加载</button><button type="button" onClick={closeModal}>返回首页</button></div></div></DetailModalFrame>;
  }

  const p = product;
  const topSkins = parseList(p.topSkins);
  const extras = parseList(p.extraItemNames);
  const coreStats = [
    { label: '哈夫币纯币', value: formatCoin(p.hafuCoin), accent: true },
    { label: '安全箱', value: p.safeBox || (Number(p.hafuCoin) >= 180 ? '3×3' : '2×3'), accent: true },
    { label: '训练中心', value: `${p.trainingCenter || 7}级` },
    { label: '靶场中心', value: `${p.firingRange || 7}级` },
  ];
  const otherAssets = [
    { label: 'AWM子弹', value: extras.find((item) => item.includes('AWM'))?.replace('AWM子弹*', '') || '233发' },
    { label: '六头', value: `${Math.max(1, Math.round(Number(p.hafuCoin || 0) / 28))}个` },
    { label: '六甲', value: `${Math.max(0, Math.round(Number(p.totalAsset || 0) / 36))}个` },
    { label: '红弹', value: extras.find((item) => item.includes('红弹'))?.replace('红弹*', '') || '0组' },
    { label: '巴雷特', value: extras.find((item) => item.includes('巴雷特'))?.replace('巴雷特*', '') || '0组' },
    { label: '3×3体验卡', value: extras.find((item) => item.includes('3x3'))?.replace('3x3体验卡*', '') || '0个' },
  ];
  const statusText = p.status === 'selling' ? '立即下单' : p.status === 'locked' ? '已被锁定' : p.status === 'rented' ? '已出租' : '已下架';

  return (
    <DetailModalFrame onClose={closeModal}>
    <div className="detail-page">
      <section className="detail-card detail-summary-card">
        <div className="detail-summary">
          <div className="detail-gallery">
            <div className="detail-main-image">
              <img src={gallery[previewIndex] || gallery[0]} alt="商品截图" />
              <span>{previewIndex + 1}/{gallery.length}</span>
            </div>
            <div className="detail-thumbnails">
              {gallery.slice(0, 5).map((image, index) => (
                <button type="button" className={previewIndex === index ? 'active' : ''} onClick={() => setPreviewIndex(index)} key={image}>
                  <img src={image} alt={`商品缩略图${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-product-info">
            <div className="detail-title-area">
              <h1>{p.title}</h1>
              <div className="detail-subline">
                <span>区服：{p.server} / 登录方式：{p.loginMethod}</span>
                <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>↗ 分享</button>
              </div>
              <div className="detail-warning"><b>!</b><span>温馨提示：不得使用或浏览外挂等第三方软件，违反将会扣除押金及租金！非账号问题不可撤单！</span></div>
            </div>

            <div className="detail-price-row">
              <span>价格：</span><strong>￥{formatPrice(p.price)}</strong><span className="detail-deposit">押金：<b>￥{formatPrice(p.deposit)}</b></span>
            </div>

            <div className="detail-seller-panel">
              <div className="detail-seller-data">
                <p><span>卖家认证：</span><b>✓ 已手机认证</b><b>✓ 已实名认证</b></p>
                <p><span>商品编号：</span><em>{p.productNo}</em><button type="button" onClick={copyProductNo}>{copied ? '已复制' : '复制'}</button></p>
                <p><span>比　　例：</span><em>1:{p.ratio}</em></p>
                <p><span>发布时间：</span><em>{p.publishTime}</em></p>
              </div>
              <div className="detail-guarantees">
                <span>服务保障：</span>
                {['专属客服', '签署合同', '实名认证', '平台担保'].map((item) => <b key={item}>✓ {item}</b>)}
              </div>
            </div>

            <div className="detail-actions">
              <button className="detail-support-button" type="button"><i>◎</i><span><b>客服咨询</b><small>在线客服（9:00~24:00）</small></span></button>
              <button className="detail-order-button" type="button" onClick={handleBuy} disabled={buying || p.status !== 'selling'}>
                <span><small>￥</small>{formatPrice(p.price)}</span><b>{buying ? '提交中...' : statusText}</b>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-card detail-content-card">
        <div className="detail-tabs">
          <button type="button" className={activeTab === 'detail' ? 'active' : ''} onClick={() => setActiveTab('detail')}>账号详情</button>
          <button type="button" className={activeTab === 'notice' ? 'active' : ''} onClick={() => setActiveTab('notice')}>买家须知</button>
        </div>

        {activeTab === 'detail' ? (
          <div className="detail-tab-panel">
            <section className="detail-account-section">
              <header><h2>账号信息</h2><p>数据来源于卖家提供的游戏账密，账号详细以登录验号为准　　发布时间：{p.publishTime}</p></header>
              <div className="detail-account-card">
                <div className="detail-tags">
                  <span>绝密KD：{p.kdRatio || '0.0'}</span><span>租期{p.rentDays}天</span><span>租期内打完</span><span>{p.rank}</span><span>{p.level}级</span>
                  {topSkins.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
                </div>

                <div className="detail-assets-layout">
                  <div className="detail-core-assets">
                    {coreStats.map((item) => <div className={item.accent ? 'accent' : ''} key={item.label}><strong>{item.value}</strong><small>{item.label}</small></div>)}
                  </div>
                  <div className="detail-other-assets">
                    <div className="detail-other-label">其他资产</div>
                    <div className="detail-other-body">
                      <div className="detail-other-top">
                        {otherAssets.map((item) => <div key={item.label}><strong>{item.value}</strong><small>{item.label}</small></div>)}
                      </div>
                      <div className="detail-other-bottom">
                        <div><span><strong>0/13</strong><small>持有枪皮</small></span><img src={`${figmaAssets}card-gun-decoration.svg`} alt="" /></div>
                        <div><span><strong>{Math.min(12, topSkins.length)}/12</strong><small>持有刀皮</small></span><img src={`${figmaAssets}card-knife-decoration.svg`} alt="" /></div>
                        <div><span><strong>{Math.min(25, topSkins.length + extras.length)}/25</strong><small>干员皮肤</small></span><img src={`${figmaAssets}card-operator-decoration.svg`} alt="" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-account-meta">
                  <p>租期：<b>{p.rentDays}天</b></p><p>封禁记录：<b>{p.banRecord || '无封禁记录'}</b></p><p>人脸是否本人：<b>{p.faceOwner ? '是' : '否'}</b></p><p>常用登录地：<b>{p.loginRegion || '暂无'}</b></p>
                </div>
              </div>
            </section>

            <section className="detail-skins-section">
              <h2>皮肤资产</h2>
              <div className="detail-skin-tabs">
                <button type="button" className={skinTab === 'knife' ? 'active' : ''} onClick={() => setSkinTab('knife')}>持有刀皮</button>
                <button type="button" className={skinTab === 'operator' ? 'active' : ''} onClick={() => setSkinTab('operator')}>干员外观</button>
              </div>
              <div className="detail-skin-list">
                {skinGroups[skinTab].map((item, index) => (
                  <article key={item.name}><div className={item.grade === 'top' ? 'top-grade' : ''}><img src={item.image} alt={item.name} /></div><p>{topSkins[index] || item.name}</p></article>
                ))}
              </div>
            </section>

            <section className="detail-text-section"><h2>号主赠送：</h2><p>{p.ownerGift || '捆绑包'}</p></section>
            <section className="detail-text-section"><h2>商品备注：</h2><p>{p.remarks || '不能动藏品箱、收藏室、高级咖啡豆和限定红，其余内容请以验号结果为准。'}</p></section>
            <section className="detail-proof-section"><h2>商品截图</h2><img src={`${detailAssets}detail-shot.png`} alt="商品详情截图" /></section>
          </div>
        ) : (
          <div className="detail-notice-panel">
            <h2>租号须知</h2>
            <ol><li>租号前请仔细阅读商品详情和备注信息。</li><li>不得使用或浏览外挂等第三方软件。</li><li>禁止修改账号密码、绑定信息。</li><li>遵守号主要求，不得擅自动用收藏室等物品。</li><li>如遇问题，请及时联系平台客服处理。</li></ol>
          </div>
        )}
      </section>
    </div>
    </DetailModalFrame>
  );
}
