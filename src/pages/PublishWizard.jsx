import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './PublishWizard.css';

const steps = ['账号信息', '账号资产', '其他资产', '交易信息'];
const ranks = ['三角洲巅峰', '黑鹰', '钻石', '铂金', '黄金', '白银', '青铜', '无段位'];
const regions = ['请选择常用登录城市', '北京市', '上海市', '广州市', '深圳市', '武汉市', '杭州市', '成都市', '重庆市', '南京市'];
const knifeSkinOptions = ['无刀皮', '处刑者', '北极星', '夜鹰', '赤枭', '黑鹰'];
const gunSkinOptions = ['无枪皮', 'M7-棱镜攻势S2', 'AS Val-悬赏令', '银翼-未结卷宗', '疾风-西部往事'];
const operatorSkinOptions = ['无干员外观', '未结卷宗', '西部往事', '北极星', '彦祖'];

const initialForm = {
  formSchemaVersion: 2,
  accountType: '纯币号', server: '', accountLoginType: '', rank: '', level: '', loginRegion: '', banRecord: '', faceOwner: '', kdRatio: '',
  hafuCoin: '', totalAsset: '', trainingCenter: '', safeBox: '', firingRange: '',
  operatorSkins: [], gunSkins: [], knifeSkins: [],
  settleType: 'lease_complete', ratioType: 'standard', standardRatio: '0', quickRatio: '36', netAmount: '', deposit: '', rentDays: '1', gift: '', remark: '',
};

export default function PublishWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editing = Boolean(searchParams.get('edit'));
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const banner = `${import.meta.env.BASE_URL}assets/seller/sell-hafu-banner.webp`;

  useEffect(() => {
    if (editing) return;
    localStorage.removeItem('publish_draft');
    setForm({ ...initialForm });
  }, [editing]);

  const update = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      localStorage.setItem('publish_draft', JSON.stringify(next));
      return next;
    });
  };

  const estimate = () => {
    const coins = Number(form.hafuCoin || 0);
    const level = Number(form.trainingCenter || 1);
    const ratio = Math.max(28, 28 + level * 1.5 + (form.safeBox === '3×3' ? 2 : 0));
    if (coins) {
      update('standardRatio', ratio.toFixed(1));
      update('netAmount', Math.round(coins * 100 / ratio));
    }
    if (!form.quickRatio) update('quickRatio', '36');
    if (!form.rentDays) update('rentDays', '1');
  };

  const nextStep = () => {
    if (step === 2) estimate();
    setStep((current) => Math.min(3, current + 1));
    window.scrollTo({ top: 210, behavior: 'smooth' });
  };

  const publish = () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      localStorage.removeItem('publish_draft');
      localStorage.setItem('publish_success', '1');
      setSubmitting(false);
      navigate('/seller/products');
    }, 500);
  };

  return (
    <div className="publish-page">
      <div className="publish-breadcrumb"><Link to="/seller/products">我要出租</Link><i>/</i><b>{editing ? '编辑商品' : '商品上架'}</b></div>
      <img className="publish-banner" src={banner} alt="出哈夫币" />

      <div className="publish-stepper" aria-label="发布进度">
        {steps.map((name, index) => (
          <div className={`publish-step ${index === step ? 'current' : ''} ${index < step ? 'done' : ''}`} key={name}>
            <button type="button" onClick={() => index <= step && setStep(index)}>{index < step ? '✓' : index + 1}</button>
            <span>第{['一','二','三','四'][index]}步：{name}</span>
            {index < steps.length - 1 && <i />}
          </div>
        ))}
      </div>

      <section className="publish-form-card">
        <header>第{['一','二','三','四'][step]}步：{steps[step]}</header>
        <div className="publish-form-body">
          {step === 0 && <AccountStep form={form} update={update} />}
          {step === 1 && <AssetStep form={form} update={update} />}
          {step === 2 && <OtherAssetStep form={form} update={update} />}
          {step === 3 && <TradeStep form={form} update={update} />}
        </div>
      </section>

      <div className="publish-actions">
        <label className="publish-agreement"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span>发布即已阅读并同意</span><a href="#agreement">《虚拟资产租赁协议》</a></label>
        <div>
          {step > 0 && <button className="publish-back" type="button" onClick={() => setStep((current) => current - 1)}>上一步</button>}
          {step < 3
            ? <button className="publish-primary" type="button" onClick={nextStep}>下一步</button>
            : <button className="publish-primary" type="button" disabled={!agreed || submitting} onClick={publish}>{submitting ? '提交中…' : editing ? '保存修改' : '提交审核'}</button>}
        </div>
      </div>
    </div>
  );
}

function AccountStep({ form, update }) {
  return <>
    <OptionRow required label="账号类型" value={form.accountType} options={['纯币号']} onChange={(value) => update('accountType', value)} />
    <OptionRow required label="登录区服" value={form.server} options={['微信', 'QQ']} onChange={(value) => update('server', value)} />
    <OptionRow required label="登录方式" value={form.accountLoginType} options={['账密登录', '扫码登录']} onChange={(value) => update('accountLoginType', value)}>
      <p>账密登录的商品售出概率提高3倍，两种方式安全性相同，租客只登录三角洲游戏，不登录其他，号主可通过微信腾讯游戏安全中心勾选禁登游戏。<em>*因账密登录打手上号更简便快速，避免您不在线无法扫码，平台全程为您账号安全保驾护航!</em></p>
    </OptionRow>
    <FormRow required label="账号等级" hint="账号等级低于30无法寄售租赁"><ControlInput type="number" min="1" max="60" value={form.level} placeholder="请输入1-60之间的等级" onChange={(value) => update('level', value)} /></FormRow>
    <OptionRow label="段位" value={form.rank} options={ranks} onChange={(value) => update('rank', value)}><p>排位段位</p></OptionRow>
    <FormRow label="绝密KD" hint="绝密行动模式下的KD数值"><ControlInput type="number" step="0.1" min="0" max="99.9" value={form.kdRatio} placeholder="请输入绝密KD" onChange={(value) => update('kdRatio', value)} /></FormRow>
    <OptionRow required label="封禁记录" value={form.banRecord} options={['有封号记录', '无封禁记录']} onChange={(value) => update('banRecord', value)}><p>请如实选择封禁记录，避免影响商品审核与后续交易。</p></OptionRow>
    <FormRow label="常用登录地" hint="建议填写最近常用登录城市，可降低异地登录风险并开启WeGame账号保护。">
      <select className="publish-control" value={form.loginRegion} onChange={(event) => update('loginRegion', event.target.value)}>{regions.map((region) => <option value={region === regions[0] ? '' : region} key={region}>{region}</option>)}</select>
    </FormRow>
    <OptionRow required label="人脸是否本人" value={form.faceOwner} options={['否', '是']} onChange={(value) => update('faceOwner', value)}><p>请按账号实际人脸认证情况填写。</p></OptionRow>
  </>;
}

function AssetStep({ form, update }) {
  return <>
    <FormRow required label="仓库总资产" hint="游戏仓库内所有资产的总价值，单位为M。"><ControlInput suffix="M" type="number" value={form.totalAsset} placeholder="请输入仓库总资产" onChange={(value) => update('totalAsset', value)} /></FormRow>
    <FormRow required label="哈夫币纯币" hint="填写账号当前可使用的哈夫币数量。"><ControlInput suffix="M" type="number" value={form.hafuCoin} placeholder="请输入哈夫币纯币数量" onChange={(value) => update('hafuCoin', value)} /></FormRow>
    <OptionRow required label="训练中心等级" value={form.trainingCenter} options={['1','2','3','4','5','6','7']} onChange={(value) => update('trainingCenter', value)} />
    <OptionRow label="靶场等级" value={form.firingRange} options={['0','1','2','3','4','5','6','7']} onChange={(value) => update('firingRange', value)} />
    <OptionRow required label="安全箱" value={form.safeBox} options={['无','1×1','2×2','2×3','3×3']} onChange={(value) => update('safeBox', value)}><p>选择账号当前已解锁的最大安全箱。</p></OptionRow>
    <FormRow label="资产截图" hint="上传仓库总资产与哈夫币余额截图，最多6张。"><UploadBox /></FormRow>
  </>;
}

function OtherAssetStep({ form, update }) {
  return <>
    <AssetSelectRow label="刀皮" value={form.knifeSkins} options={knifeSkinOptions} placeholder="请选择刀皮" onChange={(value) => update('knifeSkins', value)} />
    <AssetSelectRow label="枪皮" value={form.gunSkins} options={gunSkinOptions} placeholder="请选择枪皮" onChange={(value) => update('gunSkins', value)} />
    <AssetSelectRow label="干员外观" value={form.operatorSkins} options={operatorSkinOptions} placeholder="请选择干员外观" onChange={(value) => update('operatorSkins', value)} />
    <FormRow required label="上传截图" hint="温馨提示：为避免使用物品产生纠纷，请上传仓库、KV、资产、藏品及收藏室界面截图；如有卡邮件或卡交易行，也须上传相应截图。截图需清楚展示物品、邮件和交易行状态。"><UploadBox label="点击上传图片" compact /></FormRow>
    <FormRow label="商品备注" hint="温馨提示：禁止使用的物品一定要备注清楚，并说明仓库物品是否可用、打手使用是否付费。免费活动赠送的抽奖券如被使用或领取将无法补单；租客在租号期间完成任务或活动获得的奖励，租客有权免费使用。"><textarea className="publish-textarea" maxLength="200" value={form.remark} placeholder="请填写商品备注" onChange={(event) => update('remark', event.target.value)} /><small className="publish-word-count">{form.remark.length}/200</small></FormRow>
    <FormRow label="号主赠送" hint="温馨提示：当前版本抽奖币赠品，有赠送道具的账号基本当天秒租。"><ControlInput value={form.gift} placeholder="如不赠送，请不填写" onChange={(value) => update('gift', value)} /></FormRow>
  </>;
}

function TradeStep({ form, update }) {
  const adjustRatio = (amount) => update('standardRatio', String(Math.max(0, Number(form.standardRatio || 0) + amount)));
  return <>
    <OptionRow required label="结算模式" value={form.settleType} options={[['lease_complete','租期内打完'],['negotiated_minimum','协商保底消耗']]} onChange={(value) => update('settleType', value)}>
      <p>租期内打完：租客须在租期内消耗完账号内所有哈夫币<br />协商保底消耗：号主与租客协商约定最低哈夫币消耗量，超出部分按实际结算</p>
    </OptionRow>
    <FormRow required label="比例设定">
      <div className="ratio-setting">
        <label className={`ratio-choice ${form.ratioType === 'standard' ? 'active' : ''}`}>
          <input type="radio" name="ratioType" checked={form.ratioType === 'standard'} onChange={() => update('ratioType', 'standard')} />
          <b>标准比例</b><span>1元 =</span>
          <span className="ratio-stepper"><button type="button" onClick={() => adjustRatio(-1)}>−</button><input type="number" min="0" value={form.standardRatio} onChange={(event) => update('standardRatio', event.target.value)} /><button type="button" onClick={() => adjustRatio(1)}>＋</button></span>
          <span>万哈夫币/资产</span>
        </label>
        <p>温馨提示：标准比例为系统估价，流程简单，用户可以自行修改（一般2-4天有人下单）</p>
        <label className={`ratio-choice ${form.ratioType === 'quick' ? 'active' : ''}`}>
          <input type="radio" name="ratioType" checked={form.ratioType === 'quick'} onChange={() => update('ratioType', 'quick')} />
          <b>快出比例</b><span>1元 =</span><strong>{form.quickRatio || 36}</strong><span>万哈夫币/资产</span>
        </label>
        <p>温馨提示：更多曝光，能快速吸引买家，加速成交（一般可以当天成交）</p>
      </div>
    </FormRow>
    <FormRow required label="推荐租期"><ControlInput suffix="天" type="number" min="1" value={form.rentDays} placeholder="请输入推荐租期" onChange={(value) => update('rentDays', value)} /></FormRow>
    <FormRow required label="到手金额"><ControlInput suffix="元" type="number" value={form.netAmount} placeholder="系统计算（可修改）" onChange={(value) => update('netAmount', value)} /></FormRow>
    <FormRow required label="押金"><ControlInput suffix="元" type="number" value={form.deposit} placeholder="系统计算（可修改）" onChange={(value) => update('deposit', value)} /></FormRow>
  </>;
}

function FormRow({ label, required, hint, children }) {
  return <div className="publish-form-row"><label className={required ? 'required' : ''}>{label}</label><div className="publish-field">{children}{hint && <p>{hint}</p>}</div></div>;
}

function OptionRow({ label, required, value, options, onChange, children }) {
  return <FormRow label={label} required={required}><div className="publish-options">{options.map((option) => {
    const optionValue = Array.isArray(option) ? option[0] : option;
    const optionLabel = Array.isArray(option) ? option[1] : option;
    return <button type="button" className={value === optionValue ? 'active' : ''} onClick={() => onChange(optionValue)} key={optionValue}>{optionLabel}</button>;
  })}</div>{children}</FormRow>;
}

function ControlInput({ suffix, onChange, ...props }) {
  return <div className="publish-input-wrap"><input className="publish-control" {...props} onChange={(event) => onChange(event.target.value)} />{suffix && <span>{suffix}</span>}</div>;
}

function AssetSelectRow({ label, value, options, placeholder, onChange }) {
  const selected = Array.isArray(value) ? value[0]?.name || '' : value || '';
  return <FormRow label={label} hint="温馨提示：请根据实际情况勾选账号相关资产，以便账号快速出租！"><select className="publish-control asset-select" value={selected} onChange={(event) => onChange(event.target.value ? [{ name: event.target.value, level: 'normal' }] : [])}><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></FormRow>;
}

function UploadBox({ label = '上传图片', compact = false }) {
  return <button className={`publish-upload ${compact ? 'compact' : ''}`} type="button"><span>＋</span><b>{label}</b>{!compact && <small>支持 JPG、PNG、WEBP</small>}</button>;
}
