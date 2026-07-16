import { useMemo, useState } from 'react';
import './OrderDetailPage.css';

const GOODS_IMAGE = `${import.meta.env.BASE_URL}assets/goods-avatar.png`;

const STATUS_STAGE = {
  待支付: 0,
  待发货: 1,
  租用中: 2,
  待结算: 3,
  已完成: 4,
};

function getTitleValue(title, label) {
  const match = String(title || '').match(new RegExp(`${label}[：:]\\s*([^\\s]+)`));
  return match?.[1] || '';
}

function display(value) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function money(value) {
  if (value === null || value === undefined || value === '') return '-';
  return Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(String(value).replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date, dotted = false) {
  if (!date) return '-';
  const pad = value => String(value).padStart(2, '0');
  const separator = dotted ? '.' : '-';
  return `${date.getFullYear()}${separator}${pad(date.getMonth() + 1)}${separator}${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}${dotted ? '' : `:${pad(date.getSeconds())}`}`;
}

function addDays(date, days) {
  if (!date) return null;
  return new Date(date.getTime() + Number(days) * 86400000);
}

function statusClass(status) {
  if (status === '租用中' || status === '已完成') return 'is-success';
  if (status === '待发货') return 'is-primary';
  if (status === '待支付' || status === '待结算') return 'is-warning';
  if (status === '已取消' || status === '已超时') return 'is-muted';
  return '';
}

export default function OrderDetailPage({ order, onBack }) {
  const [remark, setRemark] = useState(order.remark || '');
  const [rentDays, setRentDays] = useState(order.rentDays || 2);
  const [editDraft, setEditDraft] = useState({ remark: order.remark || '', rentDays: String(order.rentDays || 2) });
  const [showEdit, setShowEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [toast, setToast] = useState('');

  const detail = useMemo(() => {
    const snapshot = order.productSnapshot || {};
    const [serverLoginMethod, serverName] = String(order.server || '').split('|');
    const startTime = parseDate(order.rentStartTime || order.shipTime || order.createTime);
    const endTime = parseDate(order.rentEndTime) || addDays(startTime, rentDays);
    const isChannelOrder = order.orderChannel && order.orderChannel !== '官方';
    return {
      sellerId: display(order.sellerId || '101715'),
      buyerId: display(isChannelOrder ? (order.buyerName || order.buyerId || order.orderChannel) : (order.buyerId || '100802')),
      sellerPhone: display(order.sellerPhone || order.phone),
      buyerPhone: display(order.buyerPhone || order.phone),
      startTime,
      endTime,
      loginMethod: display(snapshot.loginMethod || order.loginMethod || getTitleValue(order.title, '账密') || serverLoginMethod),
      accountLevel: display(snapshot.accountLevel || order.accountLevel || getTitleValue(order.title, '账号等级')),
      rank: display(snapshot.rank || order.rank || getTitleValue(order.title, '段位')),
      banRecord: display(snapshot.banRecord || order.banRecord || '无封禁记录'),
      commonLoginArea: display(snapshot.commonLoginArea || order.commonLoginArea),
      faceOwner: display(snapshot.faceOwner || order.faceOwner || '是'),
      totalAsset: display(snapshot.totalAsset || order.totalAsset || getTitleValue(order.title, '总资产')),
      pureCoin: display(snapshot.pureCoin || order.pureCoin || getTitleValue(order.title, '纯币资产')),
      trainingCenter: display(snapshot.trainingCenter || order.trainingCenter || getTitleValue(order.title, '训练中心')),
      shootingRange: display(snapshot.shootingRange || order.shootingRange || getTitleValue(order.title, '靶场等级')),
      safeBox: display(snapshot.safeBox || order.safeBox || getTitleValue(order.title, '安全箱')),
      awmAmmo: display(snapshot.awmAmmo || order.awmAmmo || getTitleValue(order.title, 'awm子弹')),
      helmet6: display(snapshot.helmet6 || order.helmet6 || 0),
      armor6: display(snapshot.armor6 || order.armor6 || 0),
      redAmmo: display(snapshot.redAmmo || order.redAmmo || 0),
      card33: display(snapshot.card33 || order.card33 || 0),
      barrett: display(snapshot.barrett || order.barrett || 0),
      thirdProductId: display(order.thirdProductId),
      productType: display(order.type),
      gameServer: display(serverName),
      images: Array.isArray(order.images) && order.images.length ? order.images : [order.image || GOODS_IMAGE],
    };
  }, [order, rentDays]);

  const currentStage = STATUS_STAGE[order.status] ?? (['已取消', '已超时'].includes(order.status) ? 1 : 0);
  const steps = [
    { title: '创建订单', time: order.createTime },
    { title: ['已取消', '已超时'].includes(order.status) ? order.status : '支付完成', time: order.status === '待支付' ? '' : order.updateTime },
    { title: '租用中', time: order.shipTime || (currentStage >= 2 ? formatDate(detail.startTime) : '') },
    { title: '待结算', time: currentStage >= 2 ? formatDate(detail.endTime) : '' },
    { title: '已完成', time: order.completeTime || '' },
  ];

  const saveEdit = () => {
    const nextDays = Math.max(1, Number(editDraft.rentDays) || 1);
    setRentDays(nextDays);
    setRemark(editDraft.remark.trim());
    setShowEdit(false);
    setToast('租用信息已更新');
    window.setTimeout(() => setToast(''), 1800);
  };

  const handleStatusAction = label => {
    setToast(`${label}操作已记录（原型演示）`);
    window.setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="order-detail-page">
      <header className="order-detail-topbar">
        <div><strong>{order.orderNo}</strong><span className={`order-detail-status ${statusClass(order.status)}`}>{order.status}</span></div>
        <button onClick={onBack}>返 回</button>
      </header>

      <DetailCard title="租用信息" extra={<button className="order-detail-primary-button" onClick={() => { setEditDraft({ remark, rentDays: String(rentDays) }); setShowEdit(true); }}>编 辑</button>}>
        <DetailGrid columns={3}>
          <DetailField label="卖家ID" value={detail.sellerId} />
          <DetailField label="买家ID" value={detail.buyerId} />
          <DetailField label="创建时间" value={display(order.createTime)} />
          <DetailField label="租用时间" value={<>{rentDays.toFixed ? rentDays.toFixed(1) : Number(rentDays).toFixed(1)}天&nbsp;&nbsp;{formatDate(detail.startTime, true)} - {formatDate(detail.endTime, true)}</>} />
          <DetailField label="卖家手机号" value={detail.sellerPhone} />
          <DetailField label="买家手机号" value={detail.buyerPhone} />
          <DetailField label="订单备注" value={remark || ''} wide />
          <DetailField
            label="群二维码"
            value={order.groupQrCode ? (
              <button className="order-detail-qr-button" type="button" onClick={() => setPreviewImage(order.groupQrCode)}>
                <img src={order.groupQrCode} alt="群二维码" />
                <span>查看大图</span>
              </button>
            ) : '—'}
            wide
          />
        </DetailGrid>
      </DetailCard>

      <DetailCard title="支付信息">
        <DetailGrid columns={3}>
          <DetailField label="出租金额（元）" value={money(order.rent)} />
          <DetailField label="平台抽成金额（元）" value={money(order.fee)} />
          <DetailField label="卖家结算总金额（元）" value={order.sellerSettle === '' ? '' : money(order.sellerSettle)} />
          <DetailField label="押金金额（元）" value={money(order.deposit)} />
          <DetailField label="买家实付总金额（元）" value={money(order.buyerPay)} />
          <DetailField label="买家实退总金额（元）" value={order.buyerRefund === '' ? '' : money(order.buyerRefund)} />
          <DetailField label="成本金额（元）" value={money(order.cost)} wide />
        </DetailGrid>
      </DetailCard>

      <DetailCard title="商品信息" flushBottom>
        <DetailGrid columns={4}>
          <DetailField label="登录方式" value={detail.loginMethod} />
          <DetailField label="账号等级" value={detail.accountLevel} />
          <DetailField label="段位" value={detail.rank} />
          <DetailField label="封禁记录" value={detail.banRecord} />
          <DetailField label="常用登录地" value={detail.commonLoginArea} />
          <DetailField label="人脸是否本人" value={detail.faceOwner} />
          <DetailField label="仓库总资产(M)" value={detail.totalAsset} />
          <DetailField label="哈夫币纯币(M)" value={detail.pureCoin} />
          <DetailField label="训练中心等级(体力)" value={detail.trainingCenter} />
          <DetailField label="靶场等级(负重)" value={detail.shootingRange} />
          <DetailField label="安全箱" value={detail.safeBox} />
          <DetailField label="awm子弹" value={detail.awmAmmo} />
          <DetailField label="六头" value={detail.helmet6} />
          <DetailField label="六甲" value={detail.armor6} />
          <DetailField label="红弹" value={detail.redAmmo} />
          <DetailField label="3*3体验卡(建议赠送)" value={detail.card33} />
          <DetailField label="巴雷特(自行协商)" value={detail.barrett} />
          <DetailField label="三方商品ID" value={detail.thirdProductId} />
          <DetailField label="商品类型" value={detail.productType} span={2} />
        </DetailGrid>
        <div className="order-detail-images-row">
          <span>商品图片</span>
          <div>{detail.images.map((image, index) => <button key={`${image}-${index}`} onClick={() => setPreviewImage(image)}><img src={image} alt={`商品图片${index + 1}`} /></button>)}</div>
        </div>
      </DetailCard>

      <section className="order-detail-timeline" aria-label="订单进度">
        {steps.map((step, index) => {
          const state = index < currentStage ? 'is-finish' : index === currentStage ? 'is-current' : 'is-wait';
          return (
            <div className={`order-detail-step ${state}`} key={step.title}>
              <div className="order-detail-step-marker"><span>{index < currentStage ? '✓' : index + 1}</span></div>
              <div><strong>{step.title}</strong>{step.time && <small>{step.time}</small>}</div>
            </div>
          );
        })}
      </section>

      <div className="order-detail-actions">
        {order.status === '租用中' && <button onClick={() => handleStatusAction('提前结算')}>提前结算</button>}
        {order.status === '待发货' && <button onClick={() => handleStatusAction('确认发货')}>确认发货</button>}
      </div>

      {showEdit && (
        <div className="order-detail-modal-layer" role="dialog" aria-modal="true" aria-label="编辑租用信息">
          <button className="order-detail-modal-mask" aria-label="关闭" onClick={() => setShowEdit(false)} />
          <div className="order-detail-edit-modal">
            <header><h3>编辑租用信息</h3><button onClick={() => setShowEdit(false)}>×</button></header>
            <label><span>租用天数</span><input type="number" min="1" step="1" value={editDraft.rentDays} onChange={event => setEditDraft(current => ({ ...current, rentDays: event.target.value }))} /></label>
            <label><span>订单备注</span><textarea rows="4" value={editDraft.remark} placeholder="请输入订单备注" onChange={event => setEditDraft(current => ({ ...current, remark: event.target.value }))} /></label>
            <footer><button onClick={() => setShowEdit(false)}>取 消</button><button className="primary" onClick={saveEdit}>确 认</button></footer>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="order-detail-modal-layer order-detail-image-preview" role="dialog" aria-modal="true" aria-label="图片预览">
          <button className="order-detail-modal-mask" aria-label="关闭图片" onClick={() => setPreviewImage('')} />
          <button className="order-detail-preview-close" onClick={() => setPreviewImage('')}>×</button>
          <img src={previewImage} alt="图片大图" />
        </div>
      )}
      {toast && <div className="order-detail-toast">✓ {toast}</div>}
    </div>
  );
}

function DetailCard({ title, extra, children, flushBottom }) {
  return <section className={`order-detail-card ${flushBottom ? 'is-flush-bottom' : ''}`}><header><h3>{title}</h3>{extra}</header>{children}</section>;
}

function DetailGrid({ columns, children }) {
  return <div className={`order-detail-grid columns-${columns}`}>{children}</div>;
}

function DetailField({ label, value, wide, span }) {
  return <div className={`order-detail-field ${wide ? 'is-wide' : ''} ${span ? `span-${span}` : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}
