import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const figmaAssets = `${import.meta.env.BASE_URL}assets/figma-v2/`;
  const legacyAssets = `${import.meta.env.BASE_URL}assets/web-home/`;
  const isSellerWorkbench = location.pathname === '/seller' || location.pathname === '/seller/products';

  const handleSearch = (event) => {
    event.preventDefault();
    const value = keyword.trim();
    navigate(value ? `/?keyword=${encodeURIComponent(value)}` : '/');
  };

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <div className={`site-shell ${isSellerWorkbench ? 'is-seller-workbench' : ''}`}>
      <header className={`site-header ${isSellerWorkbench ? 'has-utility' : ''} ${headerScrolled ? 'is-scrolled' : 'is-at-top'}`}>
        {isSellerWorkbench && <div className="site-utility"><div className="site-container site-utility-inner"><div><span>HI~ 欢迎访问茄子代售交易平台！</span><b>159****4761</b><button type="button">退出</button></div><nav><Link to="/orders">订单消息</Link><Link to="/profile">个人中心</Link><Link to="/announcements">帮助中心</Link><Link to="/announcements">关于我们</Link></nav></div></div>}
        <div className="site-container site-header-inner">
          <Link to="/" className="site-logo" aria-label="茄子代售首页">
            <img className="site-logo-mark" src={`${figmaAssets}logo-mark.svg`} alt="" />
            <span className="site-logo-wordmark">
              <img src={`${figmaAssets}logo-wordmark.png`} alt="茄子代售" />
            </span>
          </Link>

          <button type="button" className="site-mobile-menu" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="打开导航">
            <span /><span /><span />
          </button>

          <nav className={`site-main-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>资源号租赁</Link>
            <Link to="/seller" className={location.pathname.startsWith('/seller') || location.pathname === '/publish' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
              出哈夫币<img className="site-hot-badge" src={`${figmaAssets}hot-badge.svg`} alt="HOT" />
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>我的订单</Link>
            <Link to="/announcements" onClick={() => setMobileMenuOpen(false)}>官方公告</Link>
          </nav>

          <form className="site-search" onSubmit={handleSearch}>
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="哈夫币36-39比例" aria-label="搜索商品" />
            <button type="submit">
              <img src={`${figmaAssets}search-icon.svg`} alt="" />
              搜索
            </button>
          </form>

          <button type="button" className="site-mobile-scan">
            <img className="site-phone-hand" src={`${figmaAssets}phone-hand.png`} alt="" />
            <span><b>移动端扫一扫</b><small>方便 / 快捷 / 安全</small></span>
            <img className="site-scan-arrow" src={`${figmaAssets}scan-arrow.svg`} alt="" />
          </button>
        </div>
      </header>

      <main className="site-main">
        <div className="site-container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-container">
          <ul className="site-guarantees">
            <li><span>✓</span><div><b>权威认证</b><small>商品/服务品质保障</small></div></li>
            <li><span>盾</span><div><b>官方授权</b><small>正版授权，购物安全无风险</small></div></li>
            <li><span>低</span><div><b>低价保障</b><small>天天低价，畅选无忧</small></div></li>
            <li><span>售</span><div><b>售后无忧</b><small>专业客服，极速响应</small></div></li>
          </ul>
          <div className="site-footer-info">
            <div>
              <b>官方客服</b>
              <p>每天 9:00-24:00 客服在线</p>
              <div className="site-footer-links">
                <Link to="/announcements">官方公告</Link><Link to="/announcements">帮助中心</Link><Link to="/announcements">关于我们</Link><Link to="/orders">我的订单</Link><Link to="/profile">我的钱包</Link>
              </div>
              <small>Copyright Reserved © 2024-2027 武汉新巢科技有限公司 版权所有</small>
            </div>
            <div className="site-footer-qr"><img src={`${legacyAssets}qrcode.png`} alt="茄子代售公众号" /><span>茄子代售公众号</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
