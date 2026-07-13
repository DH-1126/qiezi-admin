import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitKYC } from '../api';

export default function KYC() {
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !idCard) { setError('请填写完整信息'); return; }
    if (!/^\d{17}[\dX]$/.test(idCard)) { setError('身份证号格式错误'); return; }

    setStep(2);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(true);
    try {
      await submitKYC(name, idCard);
      setStep(3);
    } catch(e) { setError(e.message); setStep(1); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white rounded-xl border border-[#E8EAED] p-8">
        <h1 className="text-xl font-bold text-[#202125] mb-6 text-center">实名认证</h1>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="请输入身份证上的姓名"
              className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-3 text-sm" />
            <input value={idCard} onChange={e => setIdCard(e.target.value)} placeholder="请输入18位身份证号" maxLength={18}
              className="w-full bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-4 py-3 text-sm" />
            <button onClick={handleSubmit}
              className="w-full py-3 rounded-lg text-white font-bold" style={{ background: 'linear-gradient(90deg, #34393E, #252A2F)' }}>
              支付宝实名授权
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-[#202125] mb-2">支付宝授权中</h3>
            <p className="text-[#9EAAB9] mb-4">正在验证身份信息...</p>
            <div className="animate-spin inline-block w-8 h-8 border-2 border-[#E8EAED] border-t-[#4452A9] rounded-full" />
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-[#202125] mb-2">认证成功</h3>
            <p className="text-[#9EAAB9] mb-6">您已完成实名认证</p>
            <button onClick={() => navigate('/')} className="px-8 py-2.5 rounded-lg text-white font-bold" style={{ background: 'linear-gradient(90deg, #34393E, #252A2F)' }}>返回首页</button>
          </div>
        )}
      </div>
    </div>
  );
}
