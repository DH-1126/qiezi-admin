import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProduct, createOrder, orderAction } from '../api';

const SKIN_ITEMS = [
  { name: '暗星', grade: 'top', img: 'data:image/png;base64,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' },
  { name: '处刑者', grade: 'normal', img: 'data:image/png;base64,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' },
];

const OPERATOR_ITEMS = [
  { name: '蛊-能天使/午夜邮差', img: 'data:image/png;base64,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' },
  { name: '乌鲁鲁-荒原猎手', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKsAAAB+CAYAAABbG+GFAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAC8lJREFUeAHtnV1rG+kVx8+8S5Ylx3Zk49hsjGPWxCGGooVumkJ1ZXDZ5KKgXveb1P0a+xEq9qZdMIRCdVOWwmpbUqI24BhTXGsdVU6syNHLaGZ2zlhy9DKSRjN6eUY6PwhsvCJYz/Of85y3OQ8H44UDSPDbB0Wx/H6eV6+v+OWlKqepEa7xgfcfyjovyUZoRdMW3r7V0+l0zfyxAcQYMcz9+IP551V9Xx6Z63+IezDRfeBgLCSEtVhJWQwX+WZhOgUFvCHlqyTckcDFYjExH34slC7PhTvhAN/tg4JUMN59mNfRkBwflTSAlPlnfPsxUrFubx8o8kZJciPQblSkgnqaSlWAROsFS6DnsCZFArwAHrjZj6gKkNRgxIxIrAlhb/8qULnu/pR6RbtQq8fHRxUgBoEzDYg8bAOC4On3cKlaSaVSNRgRwxYrt7kZV5T1iARjQAmV9ZcvXnwEsrIOGL0BQUZ58g1TrPze/n5w1IvRjiApRgZyZRjhE+1zxmpAEDQiUt6KMVQYIp78lSYmIlTE0DXurq5Ii8oWd3l5PHK/yWfgvsxBICTCGNFUkauKEXHYezIMsU5MqC2/xLwgrIb3IJfLkGBvmPi+4J6EH6zx709Ph3LqeRUrE0JtYAQ1Mf/lngaZzKz7sMzsi6grgrh4X7q+eONZsF6+DFNCbbCbgyCMLX/MJMztC+ZuV/dMd8Tjvri1rEwKFUEfdv3hffHizZtZDLg49FFZ3JeAInKmhRW9WFg3YmV2QRqgg+91YfzIxpMnQb62MKygeeh4FezAX4z1BWkwjCfZT5jpqUBwYWls6Sm34L6YQRfnJugaSHRYPlXCYeYXpAEuzAy4BNxa7Ku50FJgrOkpL2DQ5SZL4FisZi1Zqt25o4DPQJdgigVr5VFFQ2L+pGsHBTtoqtHpl+Sjjx8HcOPBh+DvvfpgT/psOWhks1kdpgIsn24wGeQ6ZdBUoyOxsh5QOQGzBKOoqkyC3d2EvPR5JehX49HMalkUc6cZR2XZvmJFP1WXFd/4Q/3AqorpFkg+dQt40z8NymHdN3FDP9CI1APhvoLt92TyO0+fh2BK8VFv7Mha+1ihvhflXp/p+cXN4z/k9+O/H6PqEBoWGNiqy8vytO8D8vqe8hGS3Zu4u4oVj39hVZJhRmgSLQuvzlid/LMi0gb9+pO7iXWqj/9e4IIVqlXtNBWvAhyOOXNgmMf9r6f6uO9HL3fAdkE24/GAokamxol3Cwr3oyDUjo9+ro5OuDcCvV4QBK/vQ00L3dwBG7EmhJ2nlTkgWsA3OwuVqLZaPaml01umcJMo3kHdBetV9FjshMe3SefgVJxVC9oLfJ/r4uWL6/afdyzULARVwwIFnL+UDZxzoITv2lreWuWas5uPQPRGeKdUMplktflnLflTjDyLJFTHoPjuhOsPvHppe4QruJrhgPnZABADsAIyZAAzNLenV4sw8T1yIAgG0NQKZ1bqWvTYJNYEOfgEW6B1bXJVb8W6Gc+RVSWYot26NsTKU6qKYBFx46pVrGZgRcc/wSRWZiqRsPRpiZUCK4Jltv9RtLJWKFaOAiuCZeSNecuYcvF4XMyqkSAQBMNgCVYQxYcSNiQDQTDMZi6q8dhAAQTBOPlwVeDvrQFBME9EPhf4UjFIvQAE89SqCxyPVQIgCMZBnZJVJXwDj2POgSAYB3XKB+dLUzKhhJhm8pdXBn/1H43GmhPME1yqavzxz+bplhOCeU7NhAAPyaROfivBMvgCIV4dhdkAA95CFQiCUZZ3FqxpOY0cK4cXFPS6ZJYgJkHza9kNcRoXv/lFidyB4WAdW4RnLt8VDFOoHxt//9TEkkoZueWgcVeMTM14y0lQKOvaj/88KuEYRxwTD4Rr/sv9vwLZ7G22qvXYT6dVXGwgXJNNf1sCPKmWqnRjtwe0iFqFtsmOHT6qudhlcgfcgUPFoDGUwYxe6cF3B7pRx0dHHUG/XUClZz6ckFUYEFzg+mDiW7JbQVpHF9T91A6DaR/9kzswMBdSHi1B6wInk5p1nBGOEe4pXSeRd01VkVVwjhX9d5mcjccZuVXOwHXMJJNdH+7ueVXTKlzrCpViHdAnmDLIrXJG/XTqSs8iwNl3SVrkPlhBlRlM9fyQaXUp99obax373OvQr2Klk8/Vm/agqhsXOwtlIGzB5L+TdexbXiWfqzu9goEOyK3qSvRRtDM4tcHRa9jRuUfW1YVA3GKlqv7654GsZeEso+O1nHhRGRAWg6yjo8aVTCapknVtpV8w0AWdOtxaGWQdnXZZURthE9Zx7vKSN3zwKdi6wUlQ1YzjlkCyrp8wsyRegiXqG6jjNDhtMEj/KllXaKv/u4X6BgYLTusM1Gw969bVrv7vluyzL2Y2lVWvVA3sRg36ZsBMWlfMA1akJbWeKx3Ow3p4qL8u/6+M/y7++zBD2PZROMBNCoXbjSdC0zx2CMUTWtmsnX74lwbff18Djhu9mHAU+ckJvyFviZWrnLC0OJ0XvGFwavr8JXCBqwXZ3U3I2mJFgSmhRZzPnmlo9WDSTKl4X//tT0VweTq5XoDVvf2QX18wZFKc/TDFu/sKhMICCCG+4ssCDQZVvbqq+uH+aTUXb+fcHxcSoziVhah2Vj2pwdaWbnfjsu/wmXi7XR48CJ6Olu2DA0UoSDIwzmupUOrbGeVjtrfNfVhldx/QWOQyKRSqJ9/f0zGOTS5+qMbsQhRv+Z3KgAUvMGFZqMhnv/x84JyqHV59TmveADAOZi729vfRZZk2wfJvAZi+bhv91PTXX7sqTbcznM2LxaSdwDrzd5Rj1Sib/vYjTAe8+QAGrRv4GAWrfWYRZWjFj+F80XRarZfPmAYvp9uMx5l/qJyw8eSJMktCRYZ2rVAuk9HyD9Z08coQWJ5EIuqKkF/5lQHZtG87nzCgUsJhJq8wxWAq+sX9yr+/+Wbolc7h3oF1eqpfX7zRVr/cM96dX/N2osWAbNJiXg2qQu53v63hyCTwGViQgbvGxAsyKMpgUOGa/y6v8urZd38pZ9PpkaQGRyuaw0MeXr3isBJTT74bsVhMLDLg3yqhsv7yhf0wBYbhd+PxOU2dfDVrzUwHplIpDYz68o2hJD32L22KVWJBrMgwEtVjhKmAqi7WseauZ3oeK5aL/RJwsR75j4OZHx6sqBHJ8gMZZnMzHph1oSI06drE6iDDLicGsSL/9QiTkf+4IbHW2c1BENircPGsl1LHCYm1DpZk8V4FYEewVkAFxC0k1ibqARcLTeUcBVSd0GK0gQGXmSCe6LpgLpqE2gktiB2JVzTeh0FIrHYk/zjRvoFwOEzDRGwgsdoyWcOaSkVJrDaQWO2ZsFiSJFYbSKxtYIMLEExCYm3j4kdgAXpgbCCxtiGFFpgQCk1s7ITEyiiifEVibYPE2oaohJgQiSTLJNY2SKxtzL29ZsINOM8C0QaJlVGUfJGCrDZIrG2srOS8isSsKMTpZpsRQIvaRgrccshvH/xdkkslCV/oU0L7eu1sQcVp4eCiyDA3F9U1oKsHmiGxthMdtNSZENZiJSUS+EGAggQa3DT1W11TixVl5+lz5WbgQ7xqCtqx1Q4GF40isJH0ZQUSazvJR6ZYk/0+xWEb35m6LN8JV/h+3hS2He48/UEqlL/S7kFWTTu6Tidt/lkH4hMk1g5+b4r1sNv/5Le3DyR5oyQVzaP+zoDvxeL4oiKsC3v7y7KUz1dN0eKrzLaWHDuvikMZZzY9kFg7sBvW0DjqeeulQk319v4eugiVwHpg5+l6YyZUx0jIVCqlmy4EEJ8gsTbRVuK0jvpzWJMigYowqsTJjYvwXMIJh85dhNmExNpEvcTJmUe93DjqIzAebFyEmb7UzQ4SaxN4PJtWbh7/2+tR7+V3aLgIRCtUFCB8A4mV8A0kVsI3kFgJ30BiJXwDiZXwDSRWwjeQWAnfQGIlfAOJlfANJFbCN5BYCd9AYiV8A4mV8A0kVsI3kFgJ30BiJXwDiZXwDSRWwjeQWAlXpKLjv6Rj7GJNp7doOt40YE2uGS8/AQAjUFKV4XGgAAAAAElFTkSuQmCC' },
];

const OTHER_ASSETS = [
  { label: 'AWM子弹', value: '215发' },
  { label: '六头', value: '17个' },
  { label: '六甲', value: '21个' },
  { label: '红弹', value: '0组' },
  { label: '巴雷特', value: '0组' },
  { label: '3*3体验卡', value: '7个' },
];

const CORE_STATS = [
  { label: '哈夫币纯币', value: '2.25亿', accent: true },
  { label: '安全箱', value: '3x3', accent: true },
  { label: '训练中心', value: '7级' },
  { label: '靶场中心', value: '7级' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');
  const [skinTab, setSkinTab] = useState('dao');
  const [previewIdx, setPreviewIdx] = useState(0);

  useEffect(() => { getProduct(id).then(d => { setProduct(d); setLoading(false); }); }, [id]);

  const handleBuy = async () => {
    if (!user) return navigate('/login');
    if (user.kycStatus !== 'verified') return alert('请先完成实名认证');
    setBuying(true);
    try {
      const o = await createOrder(product.id);
      await orderAction(o.orderId, 'pay');
      alert('支付成功！');
      navigate('/orders');
    } catch(e) { alert(e.message); }
    setBuying(false);
  };

  if (loading) return <div className="text-center py-20 text-[#9EAAB9]">加载中...</div>;
  if (!product) return <div className="text-center py-20"><p className="text-[#9EAAB9] mb-4">商品不存在或已下架</p><button onClick={() => navigate('/')} className="text-[#4452A9]">返回首页</button></div>;

  const p = product;
  const images = p.images?.length ? p.images : ['/assets/card-placeholder.png'];
  const currentImg = images[previewIdx] || images[0];

  return (
    <div className="page-content-inner py-6">
      <div className="bg-white rounded-[10px] px-6 pb-6">
        {/* 上半部分: 图片 + 信息 */}
        <div className="flex gap-[30px] items-start w-full pt-6">
          {/* 左侧图片区 */}
          <div className="w-[580px] flex flex-col gap-5 shrink-0">
            <div className="relative w-full h-[308px]">
              <img src={currentImg} className="w-full h-[308px] rounded-[6px] overflow-hidden object-cover cursor-pointer" alt="" />
            </div>
            {images.length > 1 && (
              <div className="w-full h-[60px] relative">
                <div className="overflow-hidden w-full h-full">
                  <div className="flex gap-[10px] items-center h-[60px]">
                    {images.map((img, i) => (
                      <div key={i} onClick={() => setPreviewIdx(i)}
                        className={`relative h-[60px] w-[108px] rounded-[6px] overflow-hidden cursor-pointer shrink-0 ${i === previewIdx ? 'ring-2 ring-[#202125] ring-inset' : ''}`}>
                        <img src={img} className="absolute inset-0 w-full h-full rounded-[6px] object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧信息区 */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col gap-[10px]">
                <p className="text-[18px] text-[#29344A] leading-[26px] break-words font-[520]">{p.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] text-[#64687A] leading-[22px]">区服：{p.region} / 登录方式：{p.loginMethod}</p>
                  <div className="text-[#64687A] text-[12px] flex items-center cursor-pointer shrink-0 ml-2">
                    <span className="mr-1">📤</span> 分享
                  </div>
                </div>
                <div className="bg-[#FFF7E8] flex gap-1 items-center px-[6px] w-full py-1 rounded-[4px]">
                  <span className="text-[#FF9A2E] text-[12px] shrink-0">⚠️</span>
                  <p className="text-[12px] text-[#C9A065] leading-[20px] whitespace-nowrap">
                    <span>温馨提示：</span> 不得使用或浏览外挂等第三方软件，违反将会扣除押金及租金！非账号问题不可撤单！
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-center">
                <div className="flex gap-[10px] items-center">
                  <span className="text-[14px] text-[#64687A]">价格:</span>
                  <span className="text-[20px] text-[#F53F3F] leading-[20px] font-[520]">￥{(p.price/100).toFixed(0)}</span>
                </div>
                <div className="flex gap-[10px] items-center text-[14px] text-[#64687A]">
                  <span>押金:</span><span>￥{(p.deposit/100).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="p-4 flex flex-col gap-y-2" style={{ background: 'linear-gradient(#F7F8FA 0%, #FFFFFF 100%)' }}>
                  <div className="text-[14px] text-[#29344A] leading-[22px] flex items-center gap-x-[5px] flex-wrap">
                    <span className="text-[#64687A]">卖家认证：</span>
                    <span className="text-[#017A7E]">✓ 已手机认证</span>
                    <span className="text-[#017A7E] ml-[5px]">✓ 已实名认证</span>
                  </div>
                  <div className="text-[14px] leading-[22px] flex items-center">
                    <span className="text-[#64687A]">商品编号：</span>
                    <span className="text-[#29344A] ml-[5px]">{p.productNo}</span>
                    <span className="text-[#202125] cursor-pointer ml-[10px]">复制</span>
                  </div>
                  <div className="text-[14px] leading-[22px] flex items-center">
                    <span className="text-[#64687A]">比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例：</span>
                    <span className="text-[#29344A] ml-[4px]">1:{p.ratio}</span>
                  </div>
                  <div className="text-[14px] leading-[22px] flex items-center">
                    <span className="text-[#64687A]">发布时间：</span>
                    <span className="text-[#29344A]">{p.publishTime}</span>
                  </div>
                </div>
                <div className="bg-[#F7F8FA] flex gap-[10px] items-center px-4 py-[5px]">
                  <span className="text-[14px] text-[#64687A] shrink-0">服务保障：</span>
                  <div className="flex items-center gap-x-[30px] flex-wrap">
                    {['专属客服', '签署合同', '实名认证', '平台担保'].map(s => (
                      <div key={s} className="flex items-center text-[14px] text-[#64687A]">
                        <span className="text-[#017A7E] mr-1">✓</span> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-[10px] items-start pt-[10px] px-[10px]">
              <div className="w-[200px] h-12 bg-[#F2F3F5] rounded-[6px] flex items-center justify-center gap-[6px] cursor-pointer shrink-0">
                <span className="text-[20px]">💬</span>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-[14px] text-[#29344A] leading-[22px] font-[520]">客服咨询</p>
                  <p className="text-[12px] text-[#64687A] leading-[18px] whitespace-nowrap">在线客服(9:00~24:00)</p>
                </div>
              </div>
              <button onClick={handleBuy} disabled={buying || p.status !== 'selling'}
                className="flex-1 h-12 rounded-[6px] flex items-center justify-center gap-[10px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: p.status === 'selling' ? 'linear-gradient(90deg, #34393E, #252A2F)' : '#C8CAD1' }}>
                <span className="text-white whitespace-nowrap font-[520]">
                  <span className="text-[12px] leading-[20px] mr-[2px]">¥</span>
                  <span className="text-[18px] leading-[26px]">{(p.price/100).toFixed(0)}</span>
                </span>
                <span className="text-[16px] text-white leading-[24px] font-[520]">
                  {p.status === 'selling' ? '立即下单' : p.status === 'locked' ? '已被锁定' : p.status === 'rented' ? '已出租' : '已下架'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 下半部分: Tab 内容 */}
        <div className="bg-white border-t border-[#F2F3F5] mt-[10px]">
          <div className="h-[56px] pl-6 flex items-end border-b border-[#F2F3F5]">
            {['detail', 'notice'].map(tab => (
              <div key={tab} onClick={() => setActiveTab(tab)}
                className={`text-[16px] h-[56px] leading-[56px] w-[120px] text-center cursor-pointer ${activeTab === tab ? 'text-[#29344A] font-[520] border-b-[4px] border-[#202125]' : 'text-[#64687A]'}`}>
                {tab === 'detail' ? '账号详情' : '买家须知'}
              </div>
            ))}
          </div>

          {activeTab === 'detail' ? (
            <div className="p-6 pt-3 flex flex-col gap-6">
              {/* 账号信息卡片 */}
              <div className="bg-[#F7F8FA] p-5 rounded-[2px] flex flex-col gap-5">
                <div className="flex items-center justify-between gap-[10px]">
                  <p className="text-[#29344A] text-[18px] leading-[26px] shrink-0 font-[520]">账号信息</p>
                  <p className="text-[12px] text-[#9497B2] text-right">数据来源于卖家提供的游戏账密, 账号详细以登录验号为准&nbsp;&nbsp;&nbsp;&nbsp;发布时间：{p.publishTime}</p>
                </div>

                <div className="bg-white px-5 py-6 rounded-[2px] flex flex-col gap-5">
                  {/* 标签行 */}
                  <div className="flex gap-[10px] items-start flex-wrap">
                    {[['绝密KD: ' + (p.kdRatio || '0.0')], ['租期' + p.rentDays + '天'], [p.rank], ['Lv.' + p.level], ...(p.operatorSkin ? p.operatorSkin.split(',').map(s => [s.trim()]) : []), ...(p.knifeSkin ? p.knifeSkin.split(',').map(s => [s.trim()]) : [])].map(([t], i) => (
                      <div key={i} className="bg-[#F7F8FA] border border-[#E5E9F2] rounded-[4px] px-[6px] h-[20px] flex items-center">
                        <span className="text-[12px] text-[#64687A] leading-[20px] whitespace-nowrap">{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* 核心属性 + 其他资产 */}
                  <div className="flex gap-4 items-start w-full">
                    <div className="flex-1 max-w-[400px] min-w-[200px] flex flex-col gap-[6px]">
                      <div className="flex gap-[6px]">
                        {CORE_STATS.slice(0, 2).map(s => (
                          <div key={s.label} className="flex-1 flex flex-col items-center justify-center p-[5px] rounded-[4px] border border-[rgba(96,145,170,0.2)] bg-[#F1FBFA]">
                            <p className="text-[15px] text-[#017A7E] leading-[22px] w-full text-center font-[520]">{s.value}</p>
                            <p className="text-[12px] text-[#64687A] leading-[20px] w-full text-center">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-[6px]">
                        {CORE_STATS.slice(2, 4).map(s => (
                          <div key={s.label} className="flex-1 flex flex-col items-center justify-center p-[5px] rounded-[4px] bg-[#F3F8FF]">
                            <p className="text-[15px] text-[#29344A] leading-[22px] w-full text-center font-[520]">{s.value}</p>
                            <p className="text-[12px] text-[#64687A] leading-[20px] w-full text-center">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex gap-[6px] min-w-0">
                      <div className="bg-[#F7F8FA] flex items-center justify-center px-[10px] py-[11px] rounded-[4px] shrink-0 self-stretch">
                        <div className="text-[14px] text-[#64687A] text-center leading-[16px] font-[520]">
                          <p>其</p><p>他</p><p>资</p><p>产</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-[6px] min-w-0">
                        <div className="flex gap-[5px] items-center w-full">
                          {OTHER_ASSETS.map(a => (
                            <div key={a.label} className="flex-1 min-w-0 bg-[#F7F8FA] flex flex-col items-center justify-center p-[5px] rounded-[4px] text-center">
                              <p className="text-[15px] text-[#29344A] leading-[22px] w-full truncate font-[520]">{a.value}</p>
                              <p className="text-[12px] text-[#64687A] leading-[20px] w-full truncate">{a.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-[5px]">
                          <div className="bg-[#F7F8FA] relative flex flex-col items-start justify-center px-5 py-[5px] rounded-[4px] min-h-[52px]">
                            <p className="text-[14px] text-[#29344A] leading-[22px] relative z-[1] font-[520]">0/13</p>
                            <p className="text-[12px] text-[#64687A] leading-[20px] relative z-[1]">持有枪皮</p>
                          </div>
                          {p.knifeSkin && (
                            <div className="bg-[#F7F8FA] relative flex flex-col items-start justify-center px-5 py-[5px] rounded-[4px] min-h-[52px]">
                              <p className="text-[14px] text-[#29344A] leading-[22px] relative z-[1] font-[520]">2/12</p>
                              <p className="text-[12px] text-[#64687A] leading-[20px] relative z-[1]">持有刀皮</p>
                            </div>
                          )}
                          {p.operatorSkin && (
                            <div className="bg-[#F7F8FA] relative flex flex-col items-start justify-center px-5 py-[5px] rounded-[4px] min-h-[52px]">
                              <p className="text-[14px] text-[#29344A] leading-[22px] relative z-[1] font-[520]">4/25</p>
                              <p className="text-[12px] text-[#64687A] leading-[20px] relative z-[1]">干员皮肤</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[14px] text-[#64687A] flex items-center gap-x-5 flex-wrap leading-[20px]">
                    <p>租期：<span className="text-[#29344A]">{p.rentDays}天</span></p>
                    <p>封禁记录：<span className="text-[#29344A]">{p.banRecord || '无封禁记录'}</span></p>
                    <p>人脸是否本人：<span className="text-[#29344A]">{p.faceOwner ? '是' : '否'}</span></p>
                    {p.loginRegion && <p>常用登录地：<span className="text-[#29344A]">{p.loginRegion}</span></p>}
                  </div>
                </div>
              </div>

              {/* 皮肤资产 */}
              <div className="flex flex-col gap-4">
                <p className="text-[#29344A] text-[18px] leading-[26px] font-[520]">皮肤资产</p>
                <div className="flex gap-[9px] items-center">
                  {['持有刀皮', '干员外观'].map(t => (
                    <div key={t} onClick={() => setSkinTab(t === '持有刀皮' ? 'dao' : 'operator')}
                      className={`px-5 py-[6px] rounded-[4px] cursor-pointer text-[14px] text-[#29344A] leading-[22px] ${skinTab === (t === '持有刀皮' ? 'dao' : 'operator') ? 'bg-[#F7F8FA] border border-[#29344A]' : 'bg-[#F7F8FA]'}`}>
                      {t}
                    </div>
                  ))}
                </div>
                <div className="flex gap-[10px] items-start">
                  {(skinTab === 'dao' ? SKIN_ITEMS : OPERATOR_ITEMS).map((item, i) => (
                    <div key={i} className="shrink-0 flex flex-col gap-[10px] items-center" style={{ width: '183px' }}>
                      <div className={`flex items-center justify-center rounded-[6px] overflow-hidden w-full aspect-[180/100] ${item.grade === 'top' ? 'bg-gradient-to-b from-[#202529] to-[#3E3576]' : 'bg-gradient-to-b from-[#1E2327] to-[#262A2D]'}`}>
                        <img src={item.img} className="h-full object-contain" alt="" />
                      </div>
                      <p className="text-[14px] text-[#29344A] leading-[22px] text-center w-full truncate">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 号主赠送 & 商品备注 */}
              {p.ownerGift && (
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[#29344A] text-[18px] leading-[26px] font-[520]">号主赠送：</p>
                  <p className="text-[14px] text-[#64687A] leading-[22px]">{p.ownerGift}</p>
                </div>
              )}
              {p.remarks && (
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[#29344A] text-[18px] leading-[26px] font-[520]">商品备注：</p>
                  <p className="text-[14px] text-[#64687A] leading-[22px]">{p.remarks}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 pt-3">
              <div className="bg-[#F7F8FA] p-5 rounded-[2px]">
                <p className="text-[14px] text-[#64687A] leading-[22px]">
                  1. 租号前请仔细阅读商品详情和备注信息<br /><br />
                  2. 不得使用或浏览外挂等第三方软件<br /><br />
                  3. 禁止修改账号密码、绑定信息<br /><br />
                  4. 遵守号主要求，不得擅自动用收藏室等物品<br /><br />
                  5. 如遇问题请及时联系客服处理
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
