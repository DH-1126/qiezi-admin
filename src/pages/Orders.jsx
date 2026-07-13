import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, orderAction } from '../api';

const labels = { pending_pay:'待支付', pending_ship:'待发货', pending_receive:'待收货', renting:'已出租', settled:'已结单', cancelled:'已取消', refunding:'退款中' };
const statuses = ['','pending_pay','pending_ship','pending_receive','renting','settled','cancelled'];

export default function Orders() {
  const [tab, setTab] = useState('buyer');
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const d = await getOrders({ role: tab, status: status || undefined });
    setOrders(d.list || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [tab, status]);

  const doAction = async (id, action) => {
    try { await orderAction(id, action); fetchOrders(); } catch(e) { alert(e.message); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-[#202125] mb-6">我的订单</h1>
      <div className="flex gap-1 mb-4">
        {['buyer','seller'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm font-medium ${tab===t ? 'bg-[#202125] text-white' : 'bg-white text-[#64687A] border border-[#E8EAED]'}`}>
            {t==='buyer'?'我租用的':'我租出的'}
          </button>
        ))}
      </div>
      <div className="flex gap-1 mb-6 flex-wrap">
        {statuses.map(s => (
          <button key={s||'all'} onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded text-xs ${status===s ? 'bg-[#202125] text-white' : 'bg-white text-[#64687A] border border-[#E8EAED]'}`}>
            {s ? labels[s] : '全部'}
          </button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="bg-white border border-[#E8EAED] rounded-lg p-4 h-20 animate-pulse"/>)}</div>
      : orders.length===0 ? <div className="text-center py-12 text-[#9EAAB9]">暂无订单</div>
      : <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white border border-[#E8EAED] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div><span className="text-xs text-[#9EAAB9]">#{o.orderNo}</span><span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#F7F8FA] text-[#64687A]">{labels[o.status]}</span></div>
              <span className="text-[#FF7D00] font-bold">¥{(o.totalAmount/100).toFixed(2)}</span>
            </div>
            <div className="flex gap-4 text-xs text-[#9EAAB9] mb-3">
              <span>#{o.productNo}</span><span>押金 ¥{(o.deposit/100).toFixed(2)}</span><span>租期 {o.rentDays}天</span>
            </div>
            <div className="flex gap-2">
              {tab==='buyer'&&o.status==='pending_pay'&&<><button onClick={()=>doAction(o.id,'pay')} className="px-4 py-1.5 rounded text-white text-sm" style={{background:'linear-gradient(90deg,#34393E,#252A2F)'}}>去支付</button><button onClick={()=>doAction(o.id,'cancel')} className="px-4 py-1.5 rounded bg-[#F2F3F5] text-[#64687A] text-sm">取消</button></>}
              {tab==='seller'&&o.status==='pending_ship'&&<button onClick={()=>doAction(o.id,'ship')} className="px-4 py-1.5 rounded text-white text-sm" style={{background:'#017A7E'}}>确认发货</button>}
              {tab==='buyer'&&o.status==='pending_receive'&&<><button onClick={()=>doAction(o.id,'receive')} className="px-4 py-1.5 rounded text-white text-sm" style={{background:'#017A7E'}}>确认收货</button><button onClick={()=>doAction(o.id,'refund')} className="px-4 py-1.5 rounded text-red-600 text-sm border border-red-200">申请退款</button></>}
              {tab==='buyer'&&o.status==='renting'&&<button onClick={()=>{const d=prompt('续租天数');if(d)doAction(o.id,'renew')}} className="px-4 py-1.5 rounded bg-[#4452A9] text-white text-sm">续租</button>}
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}
