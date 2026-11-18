import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { art, categories, catalogUrl, collections, home, navigation, store } from '../data/shop';
import { useCart } from '../store/Cart';

export function StoreBadges() {
  return <div className="badges">{[[store.android,'google-play-badge.png','Google Play'],[store.ios,'app-store-badge.png','App Store']].map(([url,img,label])=>
    <a key={label} href={url} target="_blank" rel="noreferrer"><img src={art(img)} alt={label}/></a>)}</div>;
}
function Payments() {return <ul className="pay-list"><li>Оплата по банку Сбербанк</li><li>Оплата по банку Тинькофф</li><li>Перевод на карту</li></ul>;}
function Header() {
  const [cityOpen,setCityOpen]=useState(false);
  return <>
    <header className="mast"><div className="wrap mast-grid">
      <Link to={home} className="brand"><img src={art('header_logo.png')} alt="Rozogorod — главная"/></Link>
      <div className="app-group"><strong>Приложение "Rozogorod"</strong><StoreBadges/></div>
      <div className="payment-group"><strong>Способы оплаты</strong><Payments/></div>
      <div className="contacts"><strong>Контакты</strong><Link to={home+'/page/contacts'}>{store.city}<br/> {store.street}</Link>
        <a href={store.tel}>{store.phone}</a><button className="plain" onClick={()=>setCityOpen(true)}>Выбрать город</button></div>
    </div></header>
    {cityOpen && <Dialog title="Выберите город доставки" close={()=>setCityOpen(false)}>
      <button className="pink" onClick={()=>setCityOpen(false)}>Юрга</button>
    </Dialog>}
    <nav className="primary" aria-label="Основное меню"><div className="wrap nav-row"><div className="main-links">{navigation.map(([name,url])=><Link key={url} to={url}>{name}</Link>)}</div>
      <div className="social">{[['vk.png','https://vk.com/buket42/','ВКонтакте'],['odnoklassniki.png','https://ok.ru/profile/559271571590','Одноклассники']].map(([img,url,label])=><a href={url} key={url} target="_blank" rel="noreferrer"><img src={art(img)} alt={label}/></a>)}</div>
    </div></nav>
  </>;
}
export function Dialog({title,close,children}) {
  const ref=useRef(null);
  useEffect(()=>{const el=ref.current; el.showModal(); return ()=>el.close();},[]);
  return <dialog ref={ref} onCancel={close} onClick={e=>{if(e.target===ref.current)close();}} aria-label={title}>
    <div className="dialog-inner"><button className="dialog-x" aria-label="Закрыть" onClick={close}>×</button><h2>{title}</h2>{children}</div>
  </dialog>;
}
function Toolbar() {
  const {count}=useCart(), loc=useLocation(), navigate=useNavigate();
  const [open,setOpen]=useState(false), [term,setTerm]=useState('');
  const menu=useRef(null);
  useEffect(()=>{setOpen(false); setTerm(new URLSearchParams(loc.search).get('q')||'');},[loc.key]);
  useEffect(()=>{
    if(!open)return;
    const pointer=e=>{if(!menu.current?.contains(e.target))setOpen(false);};
    const escape=e=>{if(e.key==='Escape'){setOpen(false);menu.current?.querySelector('button')?.focus();}};
    document.addEventListener('pointerdown',pointer);document.addEventListener('keydown',escape);
    return ()=>{document.removeEventListener('pointerdown',pointer);document.removeEventListener('keydown',escape);};
  },[open]);
  return <div className="toolbar"><div className="wrap tools">
    <div ref={menu} className="menu-holder"><button className="catalog-toggle" onClick={()=>setOpen(!open)} aria-label="Каталог товаров" aria-expanded={open}><i className="burger"/><span>Каталог товаров ⌄</span></button>
      {open&&<nav className="menu-pop">{categories.map(c=><Link key={c.id} to={catalogUrl(c.id)}>{c.name}</Link>)}<Link to={home+'/catalog/all'}>Все товары</Link></nav>}</div>
    <form className="search" role="search" onSubmit={e=>{e.preventDefault();navigate(home+'/search?q='+encodeURIComponent(term.trim()));}}><input value={term} onChange={e=>setTerm(e.target.value)} aria-label="Поиск по каталогу"/><button aria-label="Найти"><span className="glyph" aria-hidden="true">&#xe003;</span></button></form>
    <Link className="cart-link plain" to={home+'/cart'}><b>{count}</b><span className="glyph" aria-hidden="true">&#xe116;</span> Корзина</Link>
  </div></div>;
}
export function Collections() {
  return <section className="wrap directory" aria-label="Подборки букетов">{collections.map(([title,links])=><div key={title}><h2>{title}</h2>{links.map(([id,name])=><Link key={id} to={catalogUrl(id)}>{name}</Link>)}</div>)}</section>;
}
function Footer() {
  return <footer><div className="wrap"><div className="foot-grid">
    <div><strong>Каталог</strong>{categories.map(c=><Link key={c.id} to={catalogUrl(c.id)}>{c.name}</Link>)}</div>
    <div><strong>Контакты</strong><p>{store.city}, {store.street}</p><a href={store.tel}>{store.phone}</a><Link to={home+'/page/dostavka'}>Условия доставки</Link><Link to={home+'/page/contacts'}>Контакты магазина</Link></div>
    <div><strong>Способы оплаты</strong><Payments/><img className="pay-icons" src={art('icons_with_robocassa.png')} alt="Способы оплаты"/></div>
    <div><strong>Приложение "Rozogorod"</strong><StoreBadges/><Link to={home+'/reviews'}>Отзывы покупателей</Link></div></div>
    <p className="footnote">Учебная версия Rozogorod · Юрга</p></div></footer>;
}
const positions = new Map();
function ScrollManager() {
  const {key,pathname}=useLocation(), action=useNavigationType();
  const previousPath=useRef(null);
  useLayoutEffect(()=>{
    const y=action==='POP' ? positions.get(key)||0 : 0;
    if(action!=='REPLACE'||previousPath.current!==pathname)window.scrollTo(0,y);
    previousPath.current=pathname;
    const record=()=>positions.set(key,window.scrollY);
    window.addEventListener('scroll',record,{passive:true});
    return ()=>window.removeEventListener('scroll',record);
  },[key,pathname,action]);
  return null;
}
export default function Layout(){
  const loc=useLocation();
  useEffect(()=>{document.title=(document.querySelector('main h1')?.textContent||'Доставка цветов Юрга')+' | Rozogorod';},[loc.pathname,loc.search]);
  return <><Header/><Toolbar/><main><Outlet/></main><Collections/><Footer/><ScrollManager/></>;
}
