import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWallet, getTransactions, recharge, withdraw, bindAlipay } from '../api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [wallet, setWallet] = useState({ balance: 0, freezeAmount: 0, alipayBound: false, alipayAccount: '' });
  const [transactions, setTransactions] = useState([]);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAlipay, setShowAlipay] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [w, t] = await Promise.all([getWallet(), getTransactions()]);
    setWallet(w);
    setTransactions(t.list || []);
  };
  useEffect(() => { fetchData(); }, []);

  const handleRecharge = async () => {
    if (!amount) return; setLoading(true);
    await recharge(parseFloat(amount)*100);
    setAmount(''); setShowRecharge(false); setLoading(false); fetchData();
  };
  const handleWithdraw = async () => {
    if (!amount) return; setLoading(true);
    try { await withdraw(parseFloat(amount)*100); setAmount(''); setShowWithdraw(false); fetchData(); }
    catch(e) { alert(e.message); }
    setLoading(false);
  };
  const handleAlipay = async () => {
    setLoading(true); setShowAlipay(true);
    await new Promise(r => setTimeout(r, 1500));
    await bindAlipay();
    setShowAlipay(false); setLoading(false); fetchData();
  };
  const typeLabels = { recharge:'充值', withdraw:'提现', income:'租号收入', expense:'租号支出' };

  return (
    <div>
      <div className="bg-white border border-[#E8EAED] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">👤</div>
          <div>
            <h1 className="text-xl font-bold text-[#202125]">{user?.nickname}</h1>
            <p className="text-[#64687A] text-sm">{user?.phone}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-sm ${user?.kycStatus==='verified'?'bg-green-50 text-green-600':'bg-yellow-50 text-yellow-600'}`}>{user?.kycStatus==='verified'?'已实名':'未实名'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[#E8EAED] rounded-xl p-6">
          <h2 className="font-bold text-[#202125] mb-4">我的钱包</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center bg-[#F7F8FA] rounded-lg p-3"><div className="text-xl font-bold text-[#FF7D00]">¥{(wallet.balance/100).toFixed(2)}</div><div className="text-xs text-[#9EAAB9]">可用余额</div></div>
            <div className="text-center bg-[#F7F8FA] rounded-lg p-3"><div className="text-xl font-bold text-[#64687A]">¥{(wallet.freezeAmount/100).toFixed(2)}</div><div className="text-xs text-[#9EAAB9]">冻结金额</div></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowRecharge(true)} className="flex-1 py-2 rounded-lg bg-[#017A7E] text-white text-sm font-medium">充值</button>
            <button onClick={() => { if(user?.kycStatus!=='verified') return alert('请先实名'); if(!wallet.alipayBound) return alert('请先绑定支付宝'); setShowWithdraw(true); }}
              className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{background:'linear-gradient(90deg,#34393E,#252A2F)'}}>提现</button>
          </div>
        </div>

        <div className="bg-white border border-[#E8EAED] rounded-xl p-6">
          <h2 className="font-bold text-[#202125] mb-4">支付宝授权</h2>
          {wallet.alipayBound ? (
            <div className="text-center"><div className="text-green-600 mb-2">✅ 已绑定</div><p className="text-[#9EAAB9] text-sm">{wallet.alipayAccount}</p>
              <button onClick={handleAlipay} className="mt-3 px-4 py-2 rounded-lg bg-[#F2F3F5] text-[#64687A] text-sm">更换绑定</button></div>
          ) : (
            <div className="text-center"><div className="text-[#9EAAB9] mb-2">未绑定</div>
              <button onClick={handleAlipay} className="px-4 py-2 rounded-lg bg-[#4452A9] text-white font-bold text-sm">绑定支付宝</button></div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E8EAED] rounded-xl p-6 mb-6">
        <h2 className="font-bold text-[#202125] mb-4">交易记录</h2>
        {transactions.length===0 ? <p className="text-[#9EAAB9] text-center py-4">暂无交易记录</p> : (
          <div className="space-y-2">{transactions.slice(0,10).map(tx => (
            <div key={tx.id} className="flex justify-between py-2 border-b border-[#E8EAED]/50">
              <div><span className="text-sm text-[#202125]">{typeLabels[tx.type]||tx.type}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[#F7F8FA] text-[#64687A]">{tx.status==='success'?'成功':tx.status==='pending'?'处理中':'已拒绝'}</span></div>
              <span className={`text-sm font-bold ${tx.amount>0?'text-green-600':'text-[#FF7D00]'}`}>{tx.amount>0?'+':''}¥{(Math.abs(tx.amount)/100).toFixed(2)}</span>
            </div>
          ))}</div>)}
      </div>
      <button onClick={logout} className="w-full py-3 rounded-lg bg-[#F2F3F5] text-[#64687A] hover:bg-[#E8EAED]">退出登录</button>
      {showRecharge && <Modal onClose={()=>setShowRecharge(false)} title="充值余额"><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="输入充值金额（元）" className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-3 text-sm mb-4" />
        <button onClick={handleRecharge} disabled={loading} className="w-full py-3 rounded-lg bg-[#017A7E] text-white font-bold disabled:opacity-50">{loading?'处理中...':'确认充值'}</button></Modal>}
      {showWithdraw && <Modal onClose={()=>setShowWithdraw(false)} title="提现"><p className="text-[#9EAAB9] text-sm mb-3">可用余额：¥{(wallet.balance/100).toFixed(2)}</p>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="输入提现金额（元）" className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-3 text-sm mb-4" />
        <button onClick={handleWithdraw} disabled={loading} className="w-full py-3 rounded-lg text-white font-bold disabled:opacity-50" style={{background:'linear-gradient(90deg,#34393E,#252A2F)'}}>{loading?'处理中...':'确认提现'}</button></Modal>}
      {showAlipay && <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center"><div className="text-4xl mb-4">📱</div><h3 className="font-bold text-[#202125] mb-2">支付宝授权</h3><p className="text-[#9EAAB9] mb-6">正在跳转支付宝授权...</p><div className="animate-spin inline-block w-8 h-8 border-2 border-[#E8EAED] border-t-[#4452A9] rounded-full"/></div></div>}
    </div>
  );
}

function Modal({children,onClose,title}) {
  return <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-xl p-6 max-w-sm mx-4 w-full" onClick={e=>e.stopPropagation()}>
      <h3 className="font-bold text-[#202125] mb-4">{title}</h3>{children}
      <button onClick={onClose} className="mt-3 w-full py-2 rounded-lg bg-[#F2F3F5] text-[#64687A] text-sm">取消</button></div></div>;
}
