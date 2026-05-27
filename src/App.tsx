import { useState, useMemo, useEffect, useCallback } from 'react';

const SUPABASE_URL = 'https://cdyesoicatjhgenxhatv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkeWVzb2ljYXRqaGdlbnhoYXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDg1MjAsImV4cCI6MjA5NTI4NDUyMH0.Yw5R2Fojln-gL3RsF98VoYWYq9hV6GJqE918ZJ5BvOw';

async function sbGet(table: string) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.asc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  return r.json();
}
async function sbInsert(table: string, data: any) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return r.json();
}
async function sbUpdate(table: string, id: any, data: any) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return r.json();
}
async function sbDelete(table: string, id: any) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
}

const COLORS = {
  sand: '#F5EFE6',
  sandDark: '#E8DDD0',
  coral: '#D4785A',
  coralLight: '#E8967A',
  dark: '#1C1C1E',
  mid: '#4A4A4C',
  muted: '#8A8A8E',
  white: '#FDFAF7',
  ok: '#4A8C6A',
  warn: '#C4872A',
  danger: '#B84040',
  teal: '#3D7A78',
  purple: '#7A5FA0',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:${COLORS.sand};color:${COLORS.dark};}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:${COLORS.sandDark};}::-webkit-scrollbar-thumb{background:${COLORS.coral};border-radius:3px;}
  input,select,textarea{font-family:'DM Sans',sans-serif;outline:none;border:1.5px solid ${COLORS.sandDark};border-radius:8px;padding:8px 12px;background:${COLORS.white};color:${COLORS.dark};font-size:14px;transition:border-color .2s;}
  input:focus,select:focus,textarea:focus{border-color:${COLORS.coral};}
  button{cursor:pointer;font-family:'DM Sans',sans-serif;}
  .tag{display:inline-block;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;}
  .tag-ok{background:#D6EFE0;color:${COLORS.ok};}
  .tag-warn{background:#FFF0D6;color:${COLORS.warn};}
  .tag-danger{background:#FFE0E0;color:${COLORS.danger};}
  .tag-info{background:#DDF0F0;color:${COLORS.teal};}
  .tag-gray{background:${COLORS.sandDark};color:${COLORS.mid};}
  .tag-purple{background:#EDE6F5;color:${COLORS.purple};}
  @media print{.no-print{display:none!important;}body{background:white;}}
`;

const ESTAGIOS = ['CORTE','COSTURA','CONFERÊNCIA','VENDA','ESTOQUE','PILOTAGEM'];
const SITUACOES = ['Em andamento','OK','Voltou p/ conserto','Pendente','Cancelado'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const TIPOS_PRODUTO = ['Biquini','Roupa','Crochê','Calçado','Acessório','Bijuteria','Canga','Bolsa','Cinto','Outro'];
const APARELHOS_OPCOES = ['Reta','Overlock','Galoneira','Interloque','Colarete','Travete','Bordadeira'];

const PRODUTOS_INIT_DEFAULT = [
  { nome: 'SUTIA MIA', cat: 'Biquini' },{ nome: 'CALCINHA MIA', cat: 'Biquini' },
  { nome: 'SUTIA ANA', cat: 'Biquini' },{ nome: 'CALCINHA ANA', cat: 'Biquini' },
  { nome: 'SUTIA CAMILA', cat: 'Biquini' },{ nome: 'CALCINHA CAMILA', cat: 'Biquini' },
  { nome: 'SUTIA SUN', cat: 'Biquini' },{ nome: 'CALCINHA SUN', cat: 'Biquini' },
  { nome: 'SUTIA LARA', cat: 'Biquini' },{ nome: 'CALCINHA LARA', cat: 'Biquini' },
  { nome: 'SUTIA BELLA', cat: 'Biquini' },{ nome: 'CALCINHA BELLA', cat: 'Biquini' },
  { nome: 'SUTIA MILLA', cat: 'Biquini' },{ nome: 'CALCINHA MILLA', cat: 'Biquini' },
  { nome: 'SUTIA LAURA', cat: 'Biquini' },{ nome: 'CALCINHA LAURA', cat: 'Biquini' },
  { nome: 'SUTIA AYLA', cat: 'Biquini' },{ nome: 'SUTIA MEL', cat: 'Biquini' },
  { nome: 'CALCINHA MEL', cat: 'Biquini' },{ nome: 'VESTIDO IZA', cat: 'Roupa' },
  { nome: 'VESTIDO ZAYA', cat: 'Roupa' },{ nome: 'VESTIDO MIA', cat: 'Roupa' },
  { nome: 'SAIA MAITE', cat: 'Roupa' },{ nome: 'SAIA LOLO', cat: 'Roupa' },
  { nome: 'CALCA MAYSA', cat: 'Roupa' },{ nome: 'CALCA HELENA', cat: 'Roupa' },
  { nome: 'HOT PANT', cat: 'Roupa' },{ nome: 'KIMONO', cat: 'Roupa' },
  { nome: 'CROPPED', cat: 'Roupa' },{ nome: 'TOP CONCHA', cat: 'Roupa' },
  { nome: 'SHORT NANDA', cat: 'Roupa' },{ nome: 'BOLSA DALIA', cat: 'Bolsa' },
  { nome: 'BOLSA NALU', cat: 'Bolsa' },{ nome: 'NECESSAIRE', cat: 'Acessório' },
  { nome: 'BONE', cat: 'Acessório' },{ nome: 'TOALHA', cat: 'Acessório' },
  { nome: 'CANGA', cat: 'Canga' },{ nome: 'CINTO', cat: 'Cinto' },
];

const COSTUREIRAS_INIT = [
  { id: 1, nome: 'GEISA', pix: '27998777350', tel: '27 99877-7350', tipo: 'Biquini/Roupa', valor: 13, especialidade: 'MIA, MILLA, ANA', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '4mm', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 2, nome: 'JULIETE', pix: '27998681126', tel: '27 9986-81126', tipo: 'Biquini', valor: 12, especialidade: 'HOT PANT, BELLA, LAURA, LIZ', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 3, nome: 'ALICE', pix: '39667520854', tel: '39667520854', tipo: 'Biquini/Roupa', valor: 12, especialidade: 'CATARINA, MILLA, SAIA MAITE', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 4, nome: 'NEIA', pix: '22997134674', tel: '22 99713-4674', tipo: 'Biquini', valor: 11, especialidade: 'MAYSA, ANA, MIA', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'ela', largura_vies: '3mm', obs_tecnicas: 'Tecido grosso viés 3mm, Carmel viés 4mm', obs_gerais: '', media_entrega_manual: '', precos_modelo: [{ modelo: 'CONJUNTO MAYSA', valor: 11 }] },
  { id: 5, nome: 'ROSA', pix: '27998217026', tel: '27 99821-7026', tipo: 'Biquini', valor: 12, especialidade: 'SUN, ANA, FALESIA', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '3.5mm', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 6, nome: 'CLEIDE', pix: '', tel: '27 99298-3007', tipo: 'Roupa', valor: 13, especialidade: 'VESTIDO ALOHA, SUN', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '3.5mm', obs_tecnicas: 'Viés 3,5', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 7, nome: 'SAMIRA', pix: '27995157813', tel: '27 99515-7813', tipo: 'Roupa', valor: 35, especialidade: 'VESTIDO ISA, SAIA LOLO', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 8, nome: 'MAGDA', pix: '27997470947', tel: '27 99747-0947', tipo: 'Roupa', valor: 35, especialidade: 'KIMONO, CALCA CLEA', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 9, nome: 'PATRICIA V.VELHA', pix: '27988234387', tel: '27988234387', tipo: 'Biquini', valor: 12, especialidade: 'Variados', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
  { id: 10, nome: 'LUZIA', pix: '27988799555', tel: '27 98879-9555', tipo: 'Roupa', valor: 15, especialidade: 'VESTIDO TULE, LARA, CATARINA', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] },
];

function gerarId() { return Date.now() + Math.random(); }
function fmt(v: any) { return (parseFloat(v) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); }
function fmtDate(s: string) { return s ? new Date(s + 'T12:00:00').toLocaleDateString('pt-BR') : '—'; }
function diffDias(envio: string, conferencia: string) {
  if (!envio || !conferencia) return null;
  const d = (new Date(conferencia).getTime() - new Date(envio).getTime()) / (1000 * 60 * 60 * 24);
  return Math.round(d);
}

// ── UI Atoms ──────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', size = 'md', style = {} }: any) {
  const base: any = { border: 'none', borderRadius: '8px', fontWeight: 600, transition: 'all .18s', display: 'inline-flex', alignItems: 'center', gap: 6, ...(size === 'sm' ? { padding: '5px 12px', fontSize: 13 } : { padding: '9px 18px', fontSize: 14 }) };
  const v: any = { primary: { background: COLORS.coral, color: '#fff' }, secondary: { background: COLORS.teal, color: '#fff' }, ghost: { background: 'transparent', color: COLORS.coral, border: `1.5px solid ${COLORS.coral}` }, danger: { background: COLORS.danger, color: '#fff' }, muted: { background: COLORS.sandDark, color: COLORS.mid }, purple: { background: COLORS.purple, color: '#fff' }, dark: { background: COLORS.dark, color: '#fff' } };
  return <button onClick={onClick} style={{ ...base, ...v[variant], ...style }} onMouseEnter={(e: any) => (e.currentTarget.style.opacity = '.85')} onMouseLeave={(e: any) => (e.currentTarget.style.opacity = '1')}>{children}</button>;
}
function Card({ children, style = {} }: any) {
  return <div style={{ background: COLORS.white, borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.07)', ...style }}>{children}</div>;
}
function Badge({ status }: any) {
  const m: any = { OK: 'tag-ok', 'Em andamento': 'tag-warn', 'Voltou p/ conserto': 'tag-danger', Pendente: 'tag-warn', Cancelado: 'tag-gray' };
  return <span className={`tag ${m[status] || 'tag-info'}`}>{status}</span>;
}
function Inp({ label, ...props }: any) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{label && <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>}<input {...props} style={{ width: '100%', ...props.style }} /></div>;
}
function Sel({ label, children, ...props }: any) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{label && <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>}<select {...props} style={{ width: '100%' }}>{children}</select></div>;
}
function Stat({ label, value, color, sub }: any) {
  return <Card style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div><div style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 700, color: color || COLORS.dark }}>{value}</div>{sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{sub}</div>}</Card>;
}
function Modal({ title, onClose, children, wide }: any) {
  return <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}><div style={{ background: COLORS.white, borderRadius: 16, width: '100%', maxWidth: wide ? 920 : 700, maxHeight: '93vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: `1.5px solid ${COLORS.sandDark}`, position: 'sticky', top: 0, background: COLORS.white, zIndex: 2 }}><span style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700 }}>{title}</span><button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: COLORS.muted }}>×</button></div><div style={{ padding: 24 }}>{children}</div></div></div>;
}
function Section({ title, color, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return <div style={{ border: `1.5px solid ${color}33`, borderRadius: 10, overflow: 'hidden', marginBottom: 0 }}><button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '10px 14px', background: `${color}11`, border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: 13, color }}>{title} <span style={{ fontSize: 16 }}>{open ? '▲' : '▼'}</span></button>{open && <div style={{ padding: 14 }}>{children}</div>}</div>;
}

// ── Formulário de Envio ───────────────────────────────────────────────────────
const BLANK = { costureira_id: '', produto: '', tipo_produto: 'Biquini', quantidade: '', grade: '', data_envio: new Date().toISOString().slice(0, 10), data_prevista: '', data_conferencia: '', estagio: 'COSTURA', situacao: 'Em andamento', total: '', pecas_boas: '', pecas_ruins: '', itacare: '', site: '', loja: '', valor_unit: '', qtd_pagamento: '', pagamento_realizado: 'nao', obs: '', valor_colaborador: '' };

function EnvioForm({ costureiras, colaboradores, produtos, onSave, onClose, inicial }: any) {
  const [form, setForm] = useState(inicial ? { ...BLANK, ...inicial } : { ...BLANK });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const totalPagar = (parseFloat(form.qtd_pagamento) || 0) * (parseFloat(form.valor_unit) || 0);
  const custSel = costureiras.find((c: any) => String(c.id) === String(form.costureira_id));
  const colSel = colaboradores.find((c: any) => String(c.id) === String(custSel?.colaborador_id));
  const totalCol = (parseFloat(form.pecas_boas) || 0) * (parseFloat(form.valor_colaborador) || 0);

  const handleCost = (id: any) => {
    const c = costureiras.find((x: any) => String(x.id) === String(id));
    const precoProd = c?.precos_modelo?.find((p: any) => form.produto && form.produto.toUpperCase().includes(p.modelo.toUpperCase()));
    setForm((f: any) => ({ ...f, costureira_id: id, valor_unit: precoProd ? precoProd.valor : c ? c.valor : f.valor_unit }));
  };

  const handleProduto = (prod: string) => {
    const c = costureiras.find((x: any) => String(x.id) === String(form.costureira_id));
    const precoProd = c?.precos_modelo?.find((p: any) => prod.toUpperCase().includes(p.modelo.toUpperCase()));
    const prodObj = produtos.find((p: any) => p.nome.toUpperCase() === prod.toUpperCase());
    setForm((f: any) => ({ ...f, produto: prod, tipo_produto: prodObj ? prodObj.cat : f.tipo_produto, valor_unit: precoProd ? precoProd.valor : c ? c.valor : f.valor_unit }));
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Sel label="Costureira *" value={form.costureira_id} onChange={(e: any) => handleCost(e.target.value)}>
          <option value="">Selecionar...</option>
          {costureiras.map((c: any) => { const col = colaboradores.find((x: any) => String(x.id) === String(c.colaborador_id)); return <option key={c.id} value={c.id}>{c.nome}{c.vinculo === 'indireta' ? ` (${col?.nome || 'Indireta'})` : ''}</option>; })}
        </Sel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Produto *</label>
          <input list="prod-list" value={form.produto} onChange={(e: any) => handleProduto(e.target.value)} placeholder="Buscar ou digitar..." style={{ width: '100%', border: `1.5px solid ${COLORS.sandDark}`, borderRadius: 8, padding: '8px 12px', background: COLORS.white, fontSize: 14 }} />
          <datalist id="prod-list">{produtos.map((p: any, i: number) => <option key={i} value={p.nome} />)}</datalist>
        </div>
      </div>
      {custSel && <div style={{ background: custSel.vinculo === 'indireta' ? '#EDE6F5' : `${COLORS.teal}11`, borderRadius: 8, padding: '10px 14px', fontSize: 13, display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}><div><strong>{custSel.nome}</strong><span className={`tag ${custSel.vinculo === 'indireta' ? 'tag-purple' : 'tag-info'}`} style={{ marginLeft: 8 }}>{custSel.vinculo === 'indireta' ? '🔗 Indireta' : '✅ Direta'}</span>{colSel && <span style={{ color: COLORS.purple, marginLeft: 8 }}>👤 {colSel.nome}</span>}</div>{custSel.corta_vies && <div style={{ color: COLORS.mid }}>Viés: <strong>{custSel.corta_vies === 'ela' ? 'Ela corta' : 'Nós cortamos'}</strong>{custSel.largura_vies ? ` · ${custSel.largura_vies}` : ''}</div>}{custSel.obs_tecnicas && <div style={{ color: COLORS.warn, fontWeight: 600 }}>⚠️ {custSel.obs_tecnicas}</div>}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        <Sel label="Tipo de produto" value={form.tipo_produto} onChange={(e: any) => set('tipo_produto', e.target.value)}>{TIPOS_PRODUTO.map(t => <option key={t}>{t}</option>)}</Sel>
        <Inp label="Quantidade enviada" type="number" value={form.quantidade} onChange={(e: any) => set('quantidade', e.target.value)} />
        <Inp label="Grade (ex: 30P/40M/30G)" value={form.grade} onChange={(e: any) => set('grade', e.target.value)} />
        <Sel label="Estágio" value={form.estagio} onChange={(e: any) => set('estagio', e.target.value)}>{ESTAGIOS.map(s => <option key={s}>{s}</option>)}</Sel>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Inp label="Data de Envio" type="date" value={form.data_envio} onChange={(e: any) => set('data_envio', e.target.value)} />
        <Inp label="Previsão de Entrega" type="date" value={form.data_prevista} onChange={(e: any) => set('data_prevista', e.target.value)} />
        <Inp label="Data Conferência" type="date" value={form.data_conferencia} onChange={(e: any) => set('data_conferencia', e.target.value)} />
      </div>
      <div style={{ background: COLORS.sand, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.coral, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>📦 Distribuição de Peças</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          <Inp label="Total recebido" type="number" value={form.total} onChange={(e: any) => set('total', e.target.value)} />
          <Inp label="Peças boas" type="number" value={form.pecas_boas} onChange={(e: any) => set('pecas_boas', e.target.value)} />
          <Inp label="Peças ruins" type="number" value={form.pecas_ruins} onChange={(e: any) => set('pecas_ruins', e.target.value)} />
          <Inp label="Itacaré" value={form.itacare} onChange={(e: any) => set('itacare', e.target.value)} />
          <Inp label="Site" value={form.site} onChange={(e: any) => set('site', e.target.value)} />
        </div>
        <div style={{ marginTop: 10 }}><Inp label="Loja" value={form.loja} onChange={(e: any) => set('loja', e.target.value)} /></div>
      </div>
      <div style={{ background: `${COLORS.teal}11`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>💰 Pagamento à Costureira</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 10, alignItems: 'end' }}>
          <Inp label="Valor unit. (R$)" type="number" step="0.01" value={form.valor_unit} onChange={(e: any) => set('valor_unit', e.target.value)} />
          <Inp label="Qtd a pagar" type="number" value={form.qtd_pagamento} onChange={(e: any) => set('qtd_pagamento', e.target.value)} />
          <Sel label="Pagamento realizado?" value={form.pagamento_realizado} onChange={(e: any) => set('pagamento_realizado', e.target.value)}><option value="nao">❌ Não pago</option><option value="sim">✅ Pago</option><option value="parcial">⚠️ Parcial</option></Sel>
          <Sel label="Situação produção" value={form.situacao} onChange={(e: any) => set('situacao', e.target.value)}>{SITUACOES.map(s => <option key={s}>{s}</option>)}</Sel>
          <div style={{ background: totalPagar > 0 ? `${COLORS.teal}22` : COLORS.sandDark, borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>TOTAL COSTUREIRA</div><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.teal, fontFamily: "'Playfair Display'" }}>R$ {fmt(totalPagar)}</div></div>
        </div>
      </div>
      {custSel?.vinculo === 'indireta' && colSel && (
        <div style={{ background: '#EDE6F5', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.purple, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>👤 Comissão — {colSel.nome}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, alignItems: 'end' }}>
            <Inp label="Valor por peça boa (R$)" type="number" step="0.01" value={form.valor_colaborador} onChange={(e: any) => set('valor_colaborador', e.target.value)} placeholder="R$ por peça aprovada" />
            <div style={{ background: 'white', borderRadius: 8, padding: '8px 14px', textAlign: 'center', border: `1px solid ${COLORS.purple}33` }}><div style={{ fontSize: 11, color: COLORS.purple, fontWeight: 600 }}>PEÇAS BOAS × VALOR</div><div style={{ fontSize: 15, fontWeight: 700, color: COLORS.purple }}>{form.pecas_boas || 0} × R$ {fmt(form.valor_colaborador)}</div></div>
            <div style={{ background: totalCol > 0 ? '#EDE6F5' : COLORS.sandDark, borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>TOTAL COLABORADOR</div><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.purple, fontFamily: "'Playfair Display'" }}>R$ {fmt(totalCol)}</div></div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Observações</label>
        <textarea value={form.obs} onChange={(e: any) => set('obs', e.target.value)} rows={2} style={{ width: '100%', border: `1.5px solid ${COLORS.sandDark}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'DM Sans'", fontSize: 14, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={() => { if (!form.costureira_id || !form.produto) { alert('Preencha costureira e produto!'); return; } onSave(form); onClose(); }}>Salvar Envio</Btn>
      </div>
    </div>
  );
}

// ── Formulário Costureira ─────────────────────────────────────────────────────
function CostureiraForm({ inicial, colaboradores, produtos, onSave, onClose }: any) {
  const def = { nome: '', pix: '', tel: '', tipo: 'Biquini', valor: '', especialidade: '', vinculo: 'direta', colaborador_id: '', aparelhos: [], corta_vies: 'nos', largura_vies: '', obs_tecnicas: '', obs_gerais: '', media_entrega_manual: '', precos_modelo: [] };
  const [form, setForm] = useState(inicial ? { ...def, ...inicial } : { ...def });
  const [novoProduto, setNovoProduto] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const toggleAparelho = (a: string) => { const arr = form.aparelhos || []; set('aparelhos', arr.includes(a) ? arr.filter((x: string) => x !== a) : [...arr, a]); };
  const addPreco = () => { if (!novoProduto || !novoValor) return; set('precos_modelo', [...(form.precos_modelo || []), { modelo: novoProduto.toUpperCase(), valor: parseFloat(novoValor) }]); setNovoProduto(''); setNovoValor(''); };
  const removePreco = (i: number) => set('precos_modelo', (form.precos_modelo || []).filter((_: any, idx: number) => idx !== i));

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Section title="📋 Dados Básicos" color={COLORS.coral}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Inp label="Nome *" value={form.nome} onChange={(e: any) => set('nome', e.target.value.toUpperCase())} />
          <Inp label="PIX" value={form.pix} onChange={(e: any) => set('pix', e.target.value)} />
          <Inp label="Telefone" value={form.tel} onChange={(e: any) => set('tel', e.target.value)} />
          <Sel label="Tipo de produção" value={form.tipo} onChange={(e: any) => set('tipo', e.target.value)}><option>Biquini</option><option>Roupa</option><option>Biquini/Roupa</option><option>Crochê</option><option>Bordado</option><option>Bolsa</option></Sel>
          <Inp label="Especialidade" value={form.especialidade} onChange={(e: any) => set('especialidade', e.target.value)} />
          <Inp label="Valor base por peça (R$)" type="number" step="0.50" value={form.valor} onChange={(e: any) => set('valor', e.target.value)} />
        </div>
      </Section>
      <Section title="🔗 Vínculo de Produção" color={COLORS.teal}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {['direta', 'indireta'].map(v => <button key={v} onClick={() => set('vinculo', v)} style={{ flex: 1, padding: '10px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all .2s', border: `2px solid ${form.vinculo === v ? (v === 'direta' ? COLORS.teal : COLORS.purple) : COLORS.sandDark}`, background: form.vinculo === v ? (v === 'direta' ? `${COLORS.teal}18` : '#EDE6F5') : COLORS.white, color: form.vinculo === v ? (v === 'direta' ? COLORS.teal : COLORS.purple) : COLORS.muted }}>{v === 'direta' ? '✅ Direta (Conxá)' : '🔗 Indireta (Colaborador)'}</button>)}
        </div>
        {form.vinculo === 'indireta' && <Sel label="Colaborador responsável *" value={form.colaborador_id} onChange={(e: any) => set('colaborador_id', e.target.value)}><option value="">Selecionar colaborador...</option>{colaboradores.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}</Sel>}
      </Section>
      <Section title="💰 Preços por Modelo" color={COLORS.teal}>
        {(form.precos_modelo || []).length > 0 && <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>{(form.precos_modelo || []).map((p: any, i: number) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.sand, borderRadius: 8, padding: '5px 10px', fontSize: 13 }}><span style={{ fontWeight: 600 }}>{p.modelo}</span><span style={{ color: COLORS.teal, fontWeight: 700 }}>R$ {fmt(p.valor)}</span><button onClick={() => removePreco(i)} style={{ border: 'none', background: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 16 }}>×</button></div>)}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Modelo</label><input list="prod-list-cost" value={novoProduto} onChange={(e: any) => setNovoProduto(e.target.value)} placeholder="Ex: SUTIA MIA" style={{ border: `1.5px solid ${COLORS.sandDark}`, borderRadius: 8, padding: '8px 12px', fontSize: 14 }} /><datalist id="prod-list-cost">{produtos.map((p: any, i: number) => <option key={i} value={p.nome} />)}</datalist></div>
          <Inp label="Valor (R$)" type="number" step="0.50" value={novoValor} onChange={(e: any) => setNovoValor(e.target.value)} placeholder="0.00" />
          <Btn onClick={addPreco} style={{ alignSelf: 'flex-end' }}>＋ Adicionar</Btn>
        </div>
      </Section>
      <Section title="🔧 Perfil Técnico" color={COLORS.mid}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Aparelhos que possui</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{APARELHOS_OPCOES.map(a => <button key={a} onClick={() => toggleAparelho(a)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', transition: 'all .2s', border: `1.5px solid ${(form.aparelhos || []).includes(a) ? COLORS.teal : COLORS.sandDark}`, background: (form.aparelhos || []).includes(a) ? `${COLORS.teal}18` : COLORS.white, color: (form.aparelhos || []).includes(a) ? COLORS.teal : COLORS.mid, fontWeight: (form.aparelhos || []).includes(a) ? 700 : 400 }}>{(form.aparelhos || []).includes(a) ? '✓ ' : ''}{a}</button>)}</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Sel label="Quem corta o viés?" value={form.corta_vies} onChange={(e: any) => set('corta_vies', e.target.value)}><option value="nos">Nós cortamos</option><option value="ela">Ela corta</option><option value="ambos">Depende do modelo</option></Sel>
            <Inp label="Largura preferida do viés" value={form.largura_vies} onChange={(e: any) => set('largura_vies', e.target.value)} placeholder="Ex: 4mm, 3.5mm" />
            <Inp label="Média entrega 100 biquínis (dias)" type="number" value={form.media_entrega_manual} onChange={(e: any) => set('media_entrega_manual', e.target.value)} placeholder="Ex: 15" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Observações técnicas</label><textarea value={form.obs_tecnicas} onChange={(e: any) => set('obs_tecnicas', e.target.value)} rows={2} style={{ width: '100%', border: `1.5px solid ${COLORS.sandDark}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'DM Sans'", fontSize: 14, resize: 'vertical' }} /></div>
        </div>
      </Section>
      <Section title="📝 Observações Gerais" color={COLORS.mid} defaultOpen={false}>
        <textarea value={form.obs_gerais} onChange={(e: any) => set('obs_gerais', e.target.value)} rows={3} style={{ width: '100%', border: `1.5px solid ${COLORS.sandDark}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'DM Sans'", fontSize: 14, resize: 'vertical' }} />
      </Section>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={() => { if (!form.nome) { alert('Nome obrigatório!'); return; } onSave(form); onClose(); }}>Salvar Costureira</Btn>
      </div>
    </div>
  );
}

// ── Card de Costureira ────────────────────────────────────────────────────────
function CostureiraCard({ c, col, envios, onEdit, onDelete, onVerPerfil }: any) {
  const envC = envios.filter((e: any) => String(e.costureira_id) === String(c.id));
  const totalP = envC.reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);
  const totalPcs = envC.reduce((s: number, e: any) => s + (parseFloat(e.total) || 0), 0);
  const tempos = envC.filter((e: any) => e.data_envio && e.data_conferencia).map((e: any) => diffDias(e.data_envio, e.data_conferencia)).filter((d: any) => d > 0);
  const mediaAuto = tempos.length > 0 ? Math.round(tempos.reduce((s: number, d: number) => s + d, 0) / tempos.length) : null;
  const mediaFinal = c.media_entrega_manual || mediaAuto;
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div><div style={{ fontFamily: "'Playfair Display'", fontSize: 16, fontWeight: 700 }}>{c.nome}</div><div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}><span className={`tag ${c.tipo === 'Biquini' ? 'tag-info' : c.tipo === 'Roupa' ? 'tag-warn' : 'tag-gray'}`}>{c.tipo}</span><span className={`tag ${c.vinculo === 'indireta' ? 'tag-purple' : 'tag-ok'}`}>{c.vinculo === 'indireta' ? '🔗 Indireta' : '✅ Direta'}</span></div></div>
        <div style={{ display: 'flex', gap: 4 }}><Btn size="sm" variant="secondary" onClick={onVerPerfil}>👁 Perfil</Btn><Btn size="sm" variant="muted" onClick={onEdit}>✏️</Btn><Btn size="sm" variant="danger" onClick={onDelete}>🗑</Btn></div>
      </div>
      <div style={{ display: 'grid', gap: 4, fontSize: 13, marginBottom: 10 }}>
        {c.vinculo === 'indireta' && col && <div style={{ color: COLORS.purple, fontWeight: 600 }}>👤 {col.nome}</div>}
        {c.pix && <div><span style={{ color: COLORS.muted }}>PIX:</span> <strong>{c.pix}</strong></div>}
        {c.tel && <div><span style={{ color: COLORS.muted }}>Tel:</span> {c.tel}</div>}
        {c.especialidade && <div><span style={{ color: COLORS.muted }}>Espec.:</span> {c.especialidade}</div>}
        <div><span style={{ color: COLORS.muted }}>Valor base:</span> <strong style={{ color: COLORS.teal }}>R$ {fmt(c.valor)}/peça</strong></div>
        {c.corta_vies && <div><span style={{ color: COLORS.muted }}>Viés:</span> {c.corta_vies === 'ela' ? 'Ela corta' : 'Nós cortamos'}{c.largura_vies ? ` · ${c.largura_vies}` : ''}</div>}
        {c.obs_tecnicas && <div style={{ color: COLORS.warn, fontSize: 12 }}>⚠️ {c.obs_tecnicas}</div>}
      </div>
      <div style={{ background: COLORS.sand, borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase' }}>Média entrega 100 biquínis</div>
        <div style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700, color: mediaFinal ? COLORS.teal : COLORS.muted }}>{mediaFinal ? `${mediaFinal} dias` : '—'}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.sandDark}` }}>
        <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase' }}>Envios</div><div style={{ fontWeight: 700, fontSize: 16 }}>{envC.length}</div></div>
        <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase' }}>Peças</div><div style={{ fontWeight: 700, fontSize: 16 }}>{totalPcs}</div></div>
        <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase' }}>Total pago</div><div style={{ fontWeight: 700, fontSize: 13, color: COLORS.teal }}>R$ {fmt(totalP)}</div></div>
      </div>
    </Card>
  );
}

function PerfilModal({ c, col, envios, onClose }: any) {
  const envC = envios.filter((e: any) => String(e.costureira_id) === String(c.id)).sort((a: any, b: any) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime());
  const totalPago = envC.filter((e: any) => e.pagamento_realizado === 'sim').reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);
  const totalAPagar = envC.reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);
  return (
    <Modal title={`Perfil — ${c.nome}`} onClose={onClose} wide>
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Stat label="Total a receber" value={`R$ ${fmt(totalAPagar)}`} color={COLORS.coral} />
          <Stat label="Total pago" value={`R$ ${fmt(totalPago)}`} color={COLORS.ok} />
          <Stat label="Envios realizados" value={envC.length} />
        </div>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>📦 Últimos envios</div>
          {envC.length === 0 ? <div style={{ color: COLORS.muted }}>Nenhum envio ainda.</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.sandDark }}>{['Data', 'Produto', 'Qtd', 'Pcs Boas', 'Valor', 'Pgto', 'Situação'].map(h => <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', color: COLORS.mid }}>{h}</th>)}</tr></thead>
              <tbody>{envC.slice(0, 10).map((e: any, i: number) => { const val = (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0); return <tr key={e.id} style={{ background: i % 2 === 0 ? COLORS.white : `${COLORS.sand}66` }}><td style={{ padding: '6px 10px', whiteSpace: 'nowrap' }}>{fmtDate(e.data_envio)}</td><td style={{ padding: '6px 10px', fontWeight: 600 }}>{e.produto}</td><td style={{ padding: '6px 10px', textAlign: 'center' }}>{e.quantidade}</td><td style={{ padding: '6px 10px', textAlign: 'center', color: COLORS.ok, fontWeight: 600 }}>{e.pecas_boas || '—'}</td><td style={{ padding: '6px 10px', fontWeight: 700, color: COLORS.teal }}>R$ {fmt(val)}</td><td style={{ padding: '6px 10px', fontSize: 12, color: e.pagamento_realizado === 'sim' ? COLORS.ok : COLORS.danger }}>{e.pagamento_realizado === 'sim' ? '✅ Pago' : '❌ Não'}</td><td style={{ padding: '6px 10px' }}><Badge status={e.situacao} /></td></tr>; })}</tbody>
            </table>
          )}
        </Card>
      </div>
    </Modal>
  );
}

function ColaboradorForm({ inicial, onSave, onClose }: any) {
  const [form, setForm] = useState(inicial || { nome: '', tel: '', pix: '', obs: '' });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Inp label="Nome *" value={form.nome} onChange={(e: any) => set('nome', e.target.value.toUpperCase())} />
        <Inp label="Telefone" value={form.tel} onChange={(e: any) => set('tel', e.target.value)} />
        <Inp label="PIX" value={form.pix} onChange={(e: any) => set('pix', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="purple" onClick={() => { if (!form.nome) { alert('Nome obrigatório!'); return; } onSave(form); onClose(); }}>Salvar Colaborador</Btn>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ envios, costureiras, colaboradores }: any) {
  const hoje = new Date();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();
  const doMes = useMemo(() => envios.filter((e: any) => { const d = new Date(e.data_envio); return d.getMonth() === mes && d.getFullYear() === ano; }), [envios, mes, ano]);
  const totalAPagar = doMes.reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);
  const totalPago = doMes.filter((e: any) => e.pagamento_realizado === 'sim').reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);
  const totalPecas = doMes.reduce((s: number, e: any) => s + (parseFloat(e.total) || 0), 0);
  const emAndamento = envios.filter((e: any) => e.situacao === 'Em andamento').length;
  const atrasados = envios.filter((e: any) => e.data_prevista && e.situacao !== 'OK' && new Date(e.data_prevista) < hoje).length;
  const pendentes = envios.filter((e: any) => e.situacao !== 'OK' && e.situacao !== 'Cancelado').slice(0, 8);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: 12 }}>
        <Stat label={`A pagar — ${MESES[mes]}`} value={`R$ ${fmt(totalAPagar)}`} color={COLORS.coral} />
        <Stat label="Pago no mês" value={`R$ ${fmt(totalPago)}`} color={COLORS.ok} sub={`Falta: R$ ${fmt(totalAPagar - totalPago)}`} />
        <Stat label="Peças no mês" value={totalPecas} />
        <Stat label="Em andamento" value={emAndamento} color={COLORS.warn} />
        <Stat label="Atrasados" value={atrasados} color={atrasados > 0 ? COLORS.danger : COLORS.ok} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>⏳ Envios em aberto</div>
          {pendentes.length === 0 ? <div style={{ color: COLORS.muted }}>Tudo em dia! 🎉</div> : pendentes.map((e: any) => { const c = costureiras.find((x: any) => String(x.id) === String(e.costureira_id)); const at = e.data_prevista && new Date(e.data_prevista) < hoje; return <div key={e.id} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.sandDark}` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontWeight: 600, fontSize: 13 }}>{e.produto}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{c?.nome} · {e.quantidade} pcs · {fmtDate(e.data_prevista)}</div></div><div style={{ display: 'flex', gap: 4, flexDirection: 'column', alignItems: 'flex-end' }}><Badge status={e.situacao} />{at && <span className="tag tag-danger">ATRASADO</span>}</div></div></div>; })}
        </Card>
        <Card>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>💳 Pagamentos pendentes</div>
          {doMes.filter((e: any) => e.pagamento_realizado !== 'sim').length === 0 ? <div style={{ color: COLORS.muted }}>Todos pagos! 🎉</div> : doMes.filter((e: any) => e.pagamento_realizado !== 'sim').slice(0, 8).map((e: any) => { const c = costureiras.find((x: any) => String(x.id) === String(e.costureira_id)); const val = (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0); return <div key={e.id} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.sandDark}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 600, fontSize: 13 }}>{c?.nome}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{e.produto}</div></div><div style={{ fontWeight: 700, color: COLORS.coral }}>R$ {fmt(val)}</div></div>; })}
        </Card>
      </div>
    </div>
  );
}

// ── Envios ────────────────────────────────────────────────────────────────────
function Envios({ envios, costureiras, colaboradores, produtos, onAddEnvio, onUpdateEnvio, onDeleteEnvio }: any) {
  const [modal, setModal] = useState(null);
  const [editando, setEditando] = useState<any>(null);
  const [filtros, setFiltros] = useState({ costureira: '', situacao: '', mes: '', busca: '', pagamento: '', tipo_produto: '' });
  const filtrados = useMemo(() => envios.filter((e: any) => {
    const c = costureiras.find((x: any) => String(x.id) === String(e.costureira_id));
    if (filtros.costureira && String(e.costureira_id) !== filtros.costureira) return false;
    if (filtros.situacao && e.situacao !== filtros.situacao) return false;
    if (filtros.mes) { const d = new Date(e.data_envio); if (String(d.getMonth()) !== filtros.mes) return false; }
    if (filtros.busca) { const q = filtros.busca.toLowerCase(); if (!e.produto?.toLowerCase().includes(q) && !c?.nome?.toLowerCase().includes(q)) return false; }
    if (filtros.pagamento && e.pagamento_realizado !== filtros.pagamento) return false;
    if (filtros.tipo_produto && e.tipo_produto !== filtros.tipo_produto) return false;
    return true;
  }).sort((a: any, b: any) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime()), [envios, filtros, costureiras]);

  const salvar = (form: any) => {
    if (editando) onUpdateEnvio({ ...form, id: editando.id });
    else onAddEnvio(form);
  };
  const totalF = filtrados.reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px' }}><Inp label="🔍 Buscar" value={filtros.busca} onChange={(e: any) => setFiltros(f => ({ ...f, busca: e.target.value }))} placeholder="Produto ou costureira..." /></div>
          <div style={{ flex: '0 0 140px' }}><Sel label="Costureira" value={filtros.costureira} onChange={(e: any) => setFiltros(f => ({ ...f, costureira: e.target.value }))}><option value="">Todas</option>{costureiras.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}</Sel></div>
          <div style={{ flex: '0 0 115px' }}><Sel label="Situação" value={filtros.situacao} onChange={(e: any) => setFiltros(f => ({ ...f, situacao: e.target.value }))}><option value="">Todas</option>{SITUACOES.map(s => <option key={s}>{s}</option>)}</Sel></div>
          <div style={{ flex: '0 0 115px' }}><Sel label="Pagamento" value={filtros.pagamento} onChange={(e: any) => setFiltros(f => ({ ...f, pagamento: e.target.value }))}><option value="">Todos</option><option value="nao">Não pago</option><option value="sim">Pago</option><option value="parcial">Parcial</option></Sel></div>
          <div style={{ flex: '0 0 110px' }}><Sel label="Mês" value={filtros.mes} onChange={(e: any) => setFiltros(f => ({ ...f, mes: e.target.value }))}><option value="">Todos</option>{MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}</Sel></div>
          <Btn onClick={() => { setEditando(null); setModal('envio' as any); }}>＋ Novo Envio</Btn>
          <Btn variant="ghost" onClick={() => setFiltros({ costureira: '', situacao: '', mes: '', busca: '', pagamento: '', tipo_produto: '' })}>Limpar</Btn>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: COLORS.muted }}>{filtrados.length} envio{filtrados.length !== 1 ? 's' : ''} · Total: <strong style={{ color: COLORS.teal }}>R$ {fmt(totalF)}</strong></div>
      </Card>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: COLORS.sandDark }}>{['Data', 'Costureira', 'Produto', 'Qtd', 'Previsão', 'Estágio', 'Pcs Boas', 'Total Pagar', 'Pgto', 'Situação', 'Ações'].map(h => <th key={h} style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: COLORS.mid, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtrados.map((e: any, i: number) => {
              const c = costureiras.find((x: any) => String(x.id) === String(e.costureira_id));
              const total = (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0);
              const at = e.data_prevista && new Date(e.data_prevista) < new Date() && e.situacao !== 'OK';
              const pgC = e.pagamento_realizado === 'sim' ? COLORS.ok : e.pagamento_realizado === 'parcial' ? COLORS.warn : COLORS.danger;
              const pgL = e.pagamento_realizado === 'sim' ? '✅ Pago' : e.pagamento_realizado === 'parcial' ? '⚠️ Parcial' : '❌ Não';
              return <tr key={e.id} style={{ background: i % 2 === 0 ? COLORS.white : `${COLORS.sand}66`, borderBottom: `1px solid ${COLORS.sandDark}` }}>
                <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>{fmtDate(e.data_envio)}</td>
                <td style={{ padding: '9px 10px', fontWeight: 600 }}>{c?.nome || '—'}</td>
                <td style={{ padding: '9px 10px', maxWidth: 150 }}>{e.produto}</td>
                <td style={{ padding: '9px 10px' }}>{e.quantidade}</td>
                <td style={{ padding: '9px 10px', whiteSpace: 'nowrap', color: at ? COLORS.danger : 'inherit', fontWeight: at ? 700 : 400 }}>{fmtDate(e.data_prevista)}{at && ' ⚠️'}</td>
                <td style={{ padding: '9px 10px' }}><span className={`tag tag-${e.estagio === 'VENDA' ? 'ok' : e.estagio === 'COSTURA' ? 'warn' : 'info'}`}>{e.estagio}</span></td>
                <td style={{ padding: '9px 10px', textAlign: 'center', fontWeight: 600, color: COLORS.ok }}>{e.pecas_boas || '—'}</td>
                <td style={{ padding: '9px 10px', fontWeight: 700, color: COLORS.teal }}>{total > 0 ? `R$ ${fmt(total)}` : '—'}</td>
                <td style={{ padding: '9px 10px', fontSize: 12, fontWeight: 600, color: pgC, whiteSpace: 'nowrap' }}>{pgL}</td>
                <td style={{ padding: '9px 10px' }}><Badge status={e.situacao} /></td>
                <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                  <Btn size="sm" variant="muted" onClick={() => { setEditando(e); setModal('envio' as any); }}>✏️ Editar</Btn>{' '}
                  <Btn size="sm" variant="danger" onClick={() => { if (window.confirm('Remover este envio?')) onDeleteEnvio(e.id); }}>🗑</Btn>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
        {filtrados.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>Nenhum envio encontrado.</div>}
      </Card>
      {modal === 'envio' && <Modal title={editando ? 'Editar Envio' : 'Novo Envio'} onClose={() => { setModal(null); setEditando(null); }} wide><EnvioForm costureiras={costureiras} colaboradores={colaboradores} produtos={produtos} onSave={salvar} onClose={() => { setModal(null); setEditando(null); }} inicial={editando} /></Modal>}
    </div>
  );
}

// ── Costureiras ───────────────────────────────────────────────────────────────
function CostureirasList({ costureiras, colaboradores, envios, produtos, onAdd, onUpdate, onDelete }: any) {
  const [modal, setModal] = useState(null);
  const [editando, setEditando] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [filtroV, setFiltroV] = useState('todos');
  const [busca, setBusca] = useState('');
  const salvar = (form: any) => { if (editando) onUpdate({ ...form, id: editando.id }); else onAdd(form); };
  const filtradas = costureiras.filter((c: any) => { if (filtroV === 'direta' && c.vinculo === 'indireta') return false; if (filtroV === 'indireta' && c.vinculo !== 'indireta') return false; if (busca && !c.nome.toLowerCase().includes(busca.toLowerCase())) return false; return true; });
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['todos', `Todas (${costureiras.length})`], ['direta', `✅ Diretas (${costureiras.filter((c: any) => c.vinculo !== 'indireta').length})`], ['indireta', `🔗 Indiretas (${costureiras.filter((c: any) => c.vinculo === 'indireta').length})`]].map(([v, l]) => <button key={v} onClick={() => setFiltroV(v)} style={{ padding: '7px 16px', borderRadius: 8, border: `2px solid ${filtroV === v ? COLORS.coral : COLORS.sandDark}`, background: filtroV === v ? COLORS.coral : COLORS.white, color: filtroV === v ? '#fff' : COLORS.mid, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>{l}</button>)}
          <input value={busca} onChange={(e: any) => setBusca(e.target.value)} placeholder="Buscar nome..." style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${COLORS.sandDark}`, fontSize: 13, width: 160 }} />
        </div>
        <Btn onClick={() => { setEditando(null); setModal('c' as any); }}>＋ Nova Costureira</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 14 }}>
        {filtradas.map((c: any) => { const col = colaboradores.find((x: any) => String(x.id) === String(c.colaborador_id)); return <CostureiraCard key={c.id} c={c} col={col} envios={envios} onEdit={() => { setEditando(c); setModal('c' as any); }} onDelete={() => { if (window.confirm('Remover esta costureira?')) onDelete(c.id); }} onVerPerfil={() => setPerfil(c)} />; })}
      </div>
      {modal === 'c' && <Modal title={editando ? 'Editar Costureira' : 'Nova Costureira'} onClose={() => { setModal(null); setEditando(null); }} wide><CostureiraForm inicial={editando} colaboradores={colaboradores} produtos={produtos} onSave={salvar} onClose={() => { setModal(null); setEditando(null); }} /></Modal>}
      {perfil && <PerfilModal c={perfil} col={colaboradores.find((x: any) => String(x.id) === String(perfil.colaborador_id))} envios={envios} onClose={() => setPerfil(null)} />}
    </div>
  );
}

// ── Colaboradores ─────────────────────────────────────────────────────────────
function Colaboradores({ colaboradores, costureiras, envios, onAdd, onUpdate, onDelete }: any) {
  const [modal, setModal] = useState(null);
  const [editando, setEditando] = useState<any>(null);
  const salvar = (form: any) => { if (editando) onUpdate({ ...form, id: editando.id }); else onAdd(form); };
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700 }}>👤 Colaboradores de Produção</span>
        <Btn variant="purple" onClick={() => { setEditando(null); setModal('col' as any); }}>＋ Novo Colaborador</Btn>
      </div>
      {colaboradores.length === 0 && <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 40, marginBottom: 12 }}>👤</div><div style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Nenhum colaborador cadastrado</div><Btn variant="purple" onClick={() => { setEditando(null); setModal('col' as any); }}>Cadastrar primeiro colaborador</Btn></Card>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
        {colaboradores.map((col: any) => {
          const custsCol = costureiras.filter((c: any) => String(c.colaborador_id) === String(col.id));
          const comissaoTotal = envios.filter((e: any) => custsCol.some((c: any) => String(c.id) === String(e.costureira_id))).reduce((s: number, e: any) => s + (parseFloat(e.pecas_boas) || 0) * (parseFloat(e.valor_colaborador) || 0), 0);
          return <Card key={col.id} style={{ borderTop: `4px solid ${COLORS.purple}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 700 }}>{col.nome}</div>
              <div style={{ display: 'flex', gap: 6 }}><Btn size="sm" variant="muted" onClick={() => { setEditando(col); setModal('col' as any); }}>✏️</Btn><Btn size="sm" variant="danger" onClick={() => { if (window.confirm('Remover?')) onDelete(col.id); }}>🗑</Btn></div>
            </div>
            <div style={{ fontSize: 13, marginBottom: 12 }}>{col.pix && <div><span style={{ color: COLORS.muted }}>PIX:</span> <strong>{col.pix}</strong></div>}{col.tel && <div><span style={{ color: COLORS.muted }}>Tel:</span> {col.tel}</div>}</div>
            <div style={{ background: COLORS.sand, borderRadius: 8, padding: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.purple, textTransform: 'uppercase', marginBottom: 6 }}>Costureiras vinculadas ({custsCol.length})</div>
              {custsCol.length === 0 ? <div style={{ fontSize: 12, color: COLORS.muted }}>Nenhuma ainda.</div> : custsCol.map((c: any) => <div key={c.id} style={{ fontSize: 13 }}>• {c.nome}</div>)}
            </div>
            <div style={{ textAlign: 'center', paddingTop: 10, borderTop: `1px solid ${COLORS.sandDark}` }}><div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase' }}>Comissão total</div><div style={{ fontWeight: 700, fontSize: 16, color: COLORS.purple }}>R$ {fmt(comissaoTotal)}</div></div>
          </Card>;
        })}
      </div>
      {modal === 'col' && <Modal title={editando ? 'Editar Colaborador' : 'Novo Colaborador'} onClose={() => { setModal(null); setEditando(null); }}><ColaboradorForm inicial={editando} onSave={salvar} onClose={() => { setModal(null); setEditando(null); }} /></Modal>}
    </div>
  );
}

// ── Produtos ──────────────────────────────────────────────────────────────────
function Produtos({ produtos, onAdd, onUpdate, onDelete }: any) {
  const [novo, setNovo] = useState({ nome: '', cat: 'Biquini' });
  const [editando, setEditando] = useState<any>(null);
  const [busca, setBusca] = useState('');
  const filtrados = produtos.filter((p: any) => !busca || p.nome.toLowerCase().includes(busca.toLowerCase()));
  const porCategoria = TIPOS_PRODUTO.filter(t => filtrados.some((p: any) => p.cat === t));
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card>
        <div style={{ fontFamily: "'Playfair Display'", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>＋ Adicionar Produto</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'end' }}>
          <Inp label="Nome do produto" value={novo.nome} onChange={(e: any) => setNovo(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: BOLSA SERENA..." />
          <Sel label="Categoria" value={novo.cat} onChange={(e: any) => setNovo(f => ({ ...f, cat: e.target.value }))}>{TIPOS_PRODUTO.map(t => <option key={t}>{t}</option>)}</Sel>
          <Btn onClick={() => { if (!novo.nome.trim()) return; onAdd({ nome: novo.nome.toUpperCase().trim(), cat: novo.cat }); setNovo({ nome: '', cat: 'Biquini' }); }}>Adicionar</Btn>
        </div>
      </Card>
      <input value={busca} onChange={(e: any) => setBusca(e.target.value)} placeholder="🔍 Buscar produto..." style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${COLORS.sandDark}`, fontSize: 13, width: 220 }} />
      {porCategoria.map(cat => { const itens = filtrados.filter((p: any) => p.cat === cat); if (itens.length === 0) return null; return <Card key={cat}><div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: COLORS.coral }}>{cat} <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 400 }}>({itens.length})</span></div><div style={{ display: 'grid', gap: 6 }}>{itens.map((p: any) => <div key={p.id || p.nome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: COLORS.sand, borderRadius: 8 }}>{editando?.id === p.id || (editando?.nome === p.nome && !p.id) ? <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}><input value={editando.nome} onChange={(e: any) => setEditando((f: any) => ({ ...f, nome: e.target.value.toUpperCase() }))} style={{ flex: 1, padding: '5px 10px', borderRadius: 6, border: `1.5px solid ${COLORS.coral}`, fontSize: 13 }} /><Btn size="sm" onClick={() => { onUpdate(editando); setEditando(null); }}>✓ Salvar</Btn><Btn size="sm" variant="ghost" onClick={() => setEditando(null)}>Cancelar</Btn></div> : <><span style={{ fontWeight: 600, fontSize: 14 }}>{p.nome}</span><div style={{ display: 'flex', gap: 6 }}><Btn size="sm" variant="muted" onClick={() => setEditando({ ...p })}>✏️</Btn><Btn size="sm" variant="danger" onClick={() => { if (window.confirm('Remover produto?')) onDelete(p.id || p.nome); }}>🗑</Btn></div></>}</div>)}</div></Card>; })}
    </div>
  );
}

// ── Relatório ─────────────────────────────────────────────────────────────────
function Relatorio({ envios, costureiras, colaboradores }: any) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const anos = [...new Set(envios.map((e: any) => new Date(e.data_envio).getFullYear()))].sort((a: any, b: any) => b - a);
  const doMes = useMemo(() => envios.filter((e: any) => { const d = new Date(e.data_envio); return d.getMonth() === parseInt(String(mes)) && d.getFullYear() === parseInt(String(ano)); }), [envios, mes, ano]);
  const grandTotal = doMes.reduce((s: number, e: any) => s + (parseFloat(e.qtd_pagamento) || 0) * (parseFloat(e.valor_unit) || 0), 0);
  const grandPecas = doMes.reduce((s: number, e: any) => s + (parseFloat(e.total) || 0), 0);
  const grandBoas = doMes.reduce((s: number, e: any) => s + (parseFloat(e.pecas_boas) || 0), 0);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Sel label="Mês" value={mes} onChange={(e: any) => setMes(e.target.value)} style={{ width: 150 }}>{MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}</Sel>
          <Sel label="Ano" value={ano} onChange={(e: any) => setAno(e.target.value)} style={{ width: 100 }}>{(anos.length ? anos : [hoje.getFullYear()]).map((a: any) => <option key={a}>{a}</option>)}</Sel>
          <div style={{ flex: 1 }} />
          <Btn variant="dark" onClick={() => window.print()}>🖨️ Imprimir / PDF</Btn>
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Stat label="Total a pagar" value={`R$ ${fmt(grandTotal)}`} color={COLORS.coral} />
        <Stat label="Peças produzidas" value={grandPecas} />
        <Stat label="Peças boas" value={grandBoas} color={COLORS.ok} />
        <Stat label="Envios" value={doMes.length} />
      </div>
      {doMes.length === 0 ? <Card><div style={{ color: COLORS.muted, textAlign: 'center', padding: 32 }}>Nenhum envio registrado neste período.</div></Card> : (
        <Card style={{ background: COLORS.dark, color: COLORS.white }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700 }}>Total Geral — {MESES[mes]} {ano}</div><div style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>{grandPecas} peças · {grandBoas} boas</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 13, color: COLORS.muted }}>A PAGAR</div><div style={{ fontFamily: "'Playfair Display'", fontSize: 32, fontWeight: 700, color: COLORS.coralLight }}>R$ {fmt(grandTotal)}</div></div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
const ABAS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'envios', label: '📦 Envios' },
  { id: 'costureiras', label: '🧵 Costureiras' },
  { id: 'colaboradores', label: '👤 Colaboradores' },
  { id: 'produtos', label: '🏷️ Produtos' },
  { id: 'relatorio', label: '📋 Relatório Mensal' },
];

export default function App() {
  const [aba, setAba] = useState('dashboard');
  const [envios, setEnvios] = useState<any[]>([]);
  const [costureiras, setCostureiras] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const flash = () => { setSalvando(true); setTimeout(() => setSalvando(false), 1500); };

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const [e, c, col, p] = await Promise.all([sbGet('envios'), sbGet('costureiras'), sbGet('colaboradores'), sbGet('produtos')]);
        if (e?.error || c?.error) {
          setErro('Erro ao conectar com o banco. Verifique as credenciais do Supabase.');
          setCostureiras(COSTUREIRAS_INIT);
          setProdutos(PRODUTOS_INIT_DEFAULT);
        } else {
          setEnvios(Array.isArray(e) ? e : []);
          setCostureiras(Array.isArray(c) && c.length > 0 ? c : COSTUREIRAS_INIT);
          setColaboradores(Array.isArray(col) ? col : []);
          setProdutos(Array.isArray(p) && p.length > 0 ? p : PRODUTOS_INIT_DEFAULT);
        }
      } catch (err) {
        setErro('Sem conexão. Usando dados padrão.');
        setCostureiras(COSTUREIRAS_INIT);
        setProdutos(PRODUTOS_INIT_DEFAULT);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // ── ENVIOS CRUD ──
  const handleAddEnvio = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      const result = await sbInsert('envios', { ...rest, costureira_id: rest.costureira_id || null });
      const novo = result?.[0] || { ...form, id: gerarId() };
      setEnvios(prev => [...prev, novo]);
      flash();
    } catch { setErro('Erro ao salvar envio.'); }
  }, []);

  const handleUpdateEnvio = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      await sbUpdate('envios', id, rest);
      setEnvios(prev => prev.map(e => e.id === id ? form : e));
      flash();
    } catch { setErro('Erro ao atualizar envio.'); }
  }, []);

  const handleDeleteEnvio = useCallback(async (id: any) => {
    try {
      await sbDelete('envios', id);
      setEnvios(prev => prev.filter(e => e.id !== id));
      flash();
    } catch { setErro('Erro ao remover envio.'); }
  }, []);

  // ── COSTUREIRAS CRUD ──
  const handleAddCostureira = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      const result = await sbInsert('costureiras', rest);
      const nova = result?.[0] || { ...form, id: gerarId() };
      setCostureiras(prev => [...prev, nova]);
      flash();
    } catch { setErro('Erro ao salvar costureira.'); }
  }, []);

  const handleUpdateCostureira = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      await sbUpdate('costureiras', id, rest);
      setCostureiras(prev => prev.map(c => c.id === id ? form : c));
      flash();
    } catch { setErro('Erro ao atualizar costureira.'); }
  }, []);

  const handleDeleteCostureira = useCallback(async (id: any) => {
    try {
      await sbDelete('costureiras', id);
      setCostureiras(prev => prev.filter(c => c.id !== id));
      flash();
    } catch { setErro('Erro ao remover costureira.'); }
  }, []);

  // ── COLABORADORES CRUD ──
  const handleAddColaborador = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      const result = await sbInsert('colaboradores', rest);
      const novo = result?.[0] || { ...form, id: gerarId() };
      setColaboradores(prev => [...prev, novo]);
      flash();
    } catch { setErro('Erro ao salvar colaborador.'); }
  }, []);

  const handleUpdateColaborador = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      await sbUpdate('colaboradores', id, rest);
      setColaboradores(prev => prev.map(c => c.id === id ? form : c));
      flash();
    } catch { setErro('Erro ao atualizar colaborador.'); }
  }, []);

  const handleDeleteColaborador = useCallback(async (id: any) => {
    try {
      await sbDelete('colaboradores', id);
      setColaboradores(prev => prev.filter(c => c.id !== id));
      flash();
    } catch { setErro('Erro ao remover colaborador.'); }
  }, []);

  // ── PRODUTOS CRUD ──
  const handleAddProduto = useCallback(async (form: any) => {
    try {
      const result = await sbInsert('produtos', form);
      const novo = result?.[0] || { ...form, id: gerarId() };
      setProdutos(prev => [...prev, novo]);
      flash();
    } catch { setErro('Erro ao salvar produto.'); }
  }, []);

  const handleUpdateProduto = useCallback(async (form: any) => {
    const { id, ...rest } = form;
    try {
      if (id) await sbUpdate('produtos', id, rest);
      setProdutos(prev => prev.map(p => (p.id === id || p.nome === form.nome) ? form : p));
      flash();
    } catch { setErro('Erro ao atualizar produto.'); }
  }, []);

  const handleDeleteProduto = useCallback(async (id: any) => {
    try {
      if (typeof id === 'number') await sbDelete('produtos', id);
      setProdutos(prev => prev.filter(p => p.id !== id && p.nome !== id));
      flash();
    } catch { setErro('Erro ao remover produto.'); }
  }, []);

  if (carregando) {
    return <div style={{ minHeight: '100vh', background: COLORS.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 700, color: COLORS.coral }}>Conxá</div>
      <div style={{ fontSize: 14, color: COLORS.muted }}>Carregando dados...</div>
      <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.sandDark}`, borderTop: `3px solid ${COLORS.coral}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>;
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: COLORS.sand }}>
        <div style={{ background: COLORS.dark, padding: '0 32px' }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ padding: '18px 0' }}>
              <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 700, color: COLORS.white, lineHeight: 1 }}>Gestão de Produção</div>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginTop: 2 }}>Costureiras & Direcionamento</div>
            </div>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
              {ABAS.map(a => <button key={a.id} onClick={() => setAba(a.id)} style={{ border: 'none', background: aba === a.id ? COLORS.coral : 'transparent', color: aba === a.id ? '#fff' : COLORS.muted, padding: '22px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 0, transition: 'all .2s', borderBottom: aba === a.id ? `3px solid ${COLORS.coralLight}` : '3px solid transparent' }}>{a.label}</button>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {erro && <div style={{ fontSize: 11, color: COLORS.warn, maxWidth: 200 }}>{erro}</div>}
              {salvando && <div style={{ fontSize: 12, color: '#6EE7B7', fontWeight: 600 }}>✓ Salvo</div>}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 32px 48px' }}>
          {aba === 'dashboard' && <Dashboard envios={envios} costureiras={costureiras} colaboradores={colaboradores} />}
          {aba === 'envios' && <Envios envios={envios} costureiras={costureiras} colaboradores={colaboradores} produtos={produtos} onAddEnvio={handleAddEnvio} onUpdateEnvio={handleUpdateEnvio} onDeleteEnvio={handleDeleteEnvio} />}
          {aba === 'costureiras' && <CostureirasList costureiras={costureiras} colaboradores={colaboradores} envios={envios} produtos={produtos} onAdd={handleAddCostureira} onUpdate={handleUpdateCostureira} onDelete={handleDeleteCostureira} />}
          {aba === 'colaboradores' && <Colaboradores colaboradores={colaboradores} costureiras={costureiras} envios={envios} onAdd={handleAddColaborador} onUpdate={handleUpdateColaborador} onDelete={handleDeleteColaborador} />}
          {aba === 'produtos' && <Produtos produtos={produtos} onAdd={handleAddProduto} onUpdate={handleUpdateProduto} onDelete={handleDeleteProduto} />}
          {aba === 'relatorio' && <Relatorio envios={envios} costureiras={costureiras} colaboradores={colaboradores} />}
        </div>
      </div>
    </>
  );
}
