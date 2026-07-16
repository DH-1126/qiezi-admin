import { useMemo, useState } from 'react';
import './OrderShipModal.css';

const GOODS_IMAGE = `${import.meta.env.BASE_URL}assets/goods-avatar.png`;

function display(value) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function money(value) {
  if (value === null || value === undefined || value === '') return '-';
  return Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function OrderShipModal({ order, onCancel, onConfirm }) {
  const [groupQrCode, setGroupQrCode] = useState('');
  const [groupQrName, setGroupQrName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const info = useMemo(() => {
    const isChannelOrder = order.orderChannel && order.orderChannel !== '官方';
    return {
      rentDays: Number(order.rentDays || 10).toFixed(2),
      productId: display(order.productId),
      gameServer: display(order.server),
      title: display(order.title),
      thirdProductId: display(order.thirdProductId),
      productType: display(order.type),
      images: Array.isArray(order.images) && order.images.length ? order.images : [order.image || GOODS_IMAGE],
      sellerId: display(order.sellerId || '104032'),
      sellerPhone: display(order.sellerPhone || order.phone),
      buyerId: display(isChannelOrder ? (order.buyerName || order.buyerId || order.orderChannel) : (order.buyerId || '106037')),
      buyerPhone: display(order.buyerPhone || order.phone),
    };
  }, [order]);

  const uploadQrCode = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('请上传图片格式的群二维码');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('图片大小不能超过 2MB');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setGroupQrCode(String(reader.result));
      setGroupQrName(file.name);
      setUploadError('');
    };
    reader.onerror = () => setUploadError('图片读取失败，请重新上传');
    reader.readAsDataURL(file);
  };

  const submit = () => {
    onConfirm({ orderNo: order.orderNo, groupQrCode, groupQrName });
  };

  return (
    <div className="order-ship-modal-layer" role="dialog" aria-modal="true" aria-label="发货">
      <button className="order-ship-modal-mask" aria-label="取消发货" onClick={onCancel} />
      <div className="order-ship-modal">
        <header className="order-ship-header">
          <div className="order-ship-heading"><span>!</span><div><h3>发货</h3><p>租用期：{info.rentDays} 天</p></div></div>
          <button className="order-ship-close" onClick={onCancel}>×</button>
        </header>

        <div className="order-ship-content">
          <ShipSection title="商品信息">
            <div className="order-ship-product-grid">
              <InfoItem label="商品ID" value={info.productId} />
              <InfoItem label="游戏区服" value={info.gameServer} />
              <InfoItem label="商品名称" value={info.title} />
              <InfoItem label="三方商品ID" value={info.thirdProductId} />
              <InfoItem label="商品类型" value={info.productType} />
              <div className="order-ship-info-item order-ship-product-images"><span>商品图片：</span><div>{info.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`商品图片${index + 1}`} />)}</div></div>
            </div>
          </ShipSection>

          <div className="order-ship-party-grid">
            <ShipSection title="卖家信息">
              <InfoItem label="卖家ID" value={info.sellerId} />
              <InfoItem label="卖家手机号" value={info.sellerPhone} />
            </ShipSection>
            <ShipSection title="买家信息">
              <InfoItem label="买家ID" value={info.buyerId} />
              <InfoItem label="买家手机号" value={info.buyerPhone} />
            </ShipSection>
          </div>

          <ShipSection title="支付信息">
            <div className="order-ship-payment-grid">
              <InfoItem label="成本金额（元）" value={money(order.cost)} />
              <InfoItem label="平台抽成金额（元）" value={money(order.fee)} />
              <InfoItem label="出租金额（元）" value={money(order.rent)} />
              <InfoItem label="买家实付总金额（元）" value={money(order.buyerPay)} />
              <InfoItem label="押金金额（元）" value={money(order.deposit)} />
            </div>
          </ShipSection>

          <ShipSection title="群二维码（选填）">
            <div className="order-ship-qr-upload">
              {groupQrCode ? (
                <div className="order-ship-qr-preview">
                  <img src={groupQrCode} alt="群二维码预览" />
                  <div><strong>{groupQrName}</strong><button onClick={() => { setGroupQrCode(''); setGroupQrName(''); }}>重新上传</button></div>
                </div>
              ) : (
                <label className="order-ship-upload-button"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadQrCode} /><span>＋ 上传群二维码</span></label>
              )}
              <p>支持 JPG、PNG、WEBP 格式，图片不超过 2MB</p>
              {uploadError && <small>{uploadError}</small>}
            </div>
          </ShipSection>
        </div>

        <footer><button onClick={onCancel}>取 消</button><button className="primary" onClick={submit}>发 货</button></footer>
      </div>
    </div>
  );
}

function ShipSection({ title, children }) {
  return <section className="order-ship-section"><h4>{title}</h4>{children}</section>;
}

function InfoItem({ label, value }) {
  return <div className="order-ship-info-item"><span>{label}：</span><strong>{value}</strong></div>;
}
