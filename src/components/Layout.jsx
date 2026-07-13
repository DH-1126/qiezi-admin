import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };
  const isVerified = user?.kycStatus === 'verified';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部工具栏 */}
      <div className="bg-gradient-to-r from-[#DAFFE2] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-sm text-[#29344A]">
          <span>HI~ 欢迎访问茄子代售交易平台！</span>
          <div className="flex items-center gap-4">
            {user ? (
              <><span>{user.nickname}</span><button onClick={handleLogout} className="bg-transparent border-none cursor-pointer text-[#64687A] hover:text-[#29344A] text-sm">退出</button></>
            ) : (
              <Link to="/login" className="text-[#4452A9] no-underline">请登录/注册</Link>
            )}
            <Link to="/orders" className="text-[#29344A] no-underline">订单消息</Link>
            <Link to="/profile" className="text-[#29344A] no-underline">个人中心</Link>
            <Link to="/announcements" className="text-[#29344A] no-underline">帮助中心</Link>
            <Link to="/admin" className="text-[#29344A] no-underline">管理后台</Link>
          </div>
        </div>
      </div>

      {/* 主导航 + 搜索 */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#202125] no-underline">
              <span className="text-2xl">🍆</span>茄子代售
            </Link>
            <div className="hidden md:flex items-center gap-0">
              <Link to="/" className="px-4 py-4 text-[#202125] no-underline text-sm border-b-2 border-[#202125] font-medium">资源号租赁</Link>
              <Link to="/seller" className="px-4 py-4 text-[#64687A] hover:text-[#202125] no-underline text-sm">出哈夫币</Link>
              <Link to="/orders" className="px-4 py-4 text-[#64687A] hover:text-[#202125] no-underline text-sm">我的订单</Link>
              <Link to="/announcements" className="px-4 py-4 text-[#64687A] hover:text-[#202125] no-underline text-sm">官方公告</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input placeholder="综合性价比..." className="bg-[#F2F3F5] border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#202125] w-48 focus:outline-none" />
            <button className="bg-[#202125] text-white rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap">搜索</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#202125] p-2 bg-transparent border-none cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
            <Link to="/" onClick={()=>setMenuOpen(false)} className="text-[#202125] no-underline text-sm">资源号租赁</Link>
            <Link to="/seller" onClick={()=>setMenuOpen(false)} className="text-[#64687A] no-underline text-sm">出哈夫币</Link>
            <Link to="/orders" onClick={()=>setMenuOpen(false)} className="text-[#64687A] no-underline text-sm">我的订单</Link>
            <Link to="/announcements" onClick={()=>setMenuOpen(false)} className="text-[#64687A] no-underline text-sm">官方公告</Link>
            {!user && <Link to="/login" onClick={()=>setMenuOpen(false)} className="text-[#4452A9] no-underline text-sm">登录/注册</Link>}
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-[#202125] py-6 text-center text-[#9EAAB9] text-xs mt-8">
        <p>茄子代售 © 2024 — 三角洲行动账号租赁平台</p>
      </footer>
    </div>
  );
}
