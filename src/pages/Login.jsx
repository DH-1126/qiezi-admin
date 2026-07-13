import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^1\d{10}$/.test(phone)) { setError('请输入正确的手机号'); return; }
    if (!code) { setError('请输入验证码'); return; }
    setLoading(true); setError('');
    try {
      const data = await login(phone, code);
      saveToken(data.token, data.user);
      navigate('/');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white rounded-xl border border-[#E8EAED] p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🍆</div>
          <h1 className="text-xl font-bold text-[#202125]">手机号登录/注册</h1>
          <p className="text-sm text-[#9EAAB9] mt-1">新用户自动注册 · 测试验证码 123456</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="请输入手机号" maxLength={11}
            className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-3 text-[#202125] text-sm focus:outline-none focus:border-[#4452A9]" />
          <div className="flex gap-2">
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="验证码 123456" maxLength={6}
              className="flex-1 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-3 text-[#202125] text-sm focus:outline-none focus:border-[#4452A9]" />
            <button type="button" onClick={() => alert('验证码：123456')}
              className="px-4 py-2 rounded-lg bg-[#F2F3F5] text-[#64687A] text-sm whitespace-nowrap">获取验证码</button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white text-lg transition-colors disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #34393E, #252A2F)' }}>
            {loading ? '登录中...' : '登录 / 注册'}
          </button>
        </form>
      </div>
    </div>
  );
}
