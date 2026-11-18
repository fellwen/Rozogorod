import React from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { allCollections, art, categories, catalogUrl, categoryById, home, products } from '../data/shop';
import { ProductGrid } from '../components/Products';

function Banner(){return <img className="banner" src={art('yurga_dostavka.jpg')} alt="Доставка цветов и гелиевых шаров в Юрге. Бесплатно при заказе от 3000 рублей."/>;}
export function Home(){
  return <div className="wrap home"><Banner/>
    <nav className="category-grid" aria-label="Категории">{categories.map(c=><Link key={c.id} to={catalogUrl(c.id)}>
      <span className="category-icon"><img src={art(c.icon)} alt=""/></span><span>{c.name}</span>
    </Link>)}</nav>
    <section className="popular"><h1>Доставка цветов Юрга</h1><h2>Самое популярное</h2><ProductGrid items={products.filter(p=>p.popular)} step={8}/></section>
  </div>;
}
export function Crumbs({children}){
  return <nav className="crumbs" aria-label="Хлебные крошки"><Link to={home}>Доставка цветов Юрга</Link> » {children}</nav>;
}
export function NotFound(){
  return <section className="wrap page"><h1>Страница не найдена</h1><Link to={home}>Вернуться на главную</Link></section>;
}
export function Catalog(){
  const {slug}=useParams(),loc=useLocation(),[params,setParams]=useSearchParams();
  const isSearch=loc.pathname.endsWith('/search');
  const collection=allCollections.find(c=>c[0]===slug);
  let name=isSearch?'Поиск по каталогу':slug==='all'?'Все товары':categoryById[slug]?.name||collection?.[1];
  if(!name)return <NotFound/>;
  const q=(params.get('q')||'').trim().toLocaleLowerCase('ru');
  let items=products.filter(p=>{
    if(isSearch)return (p.name+' '+categoryById[p.category]?.name).toLocaleLowerCase('ru').includes(q);
    if(slug==='all')return true;
    if(slug==='actions')return Boolean(p.oldPrice);
    return collection?collection[2](p):p.category===slug;
  });
  const min=params.get('min'), max=params.get('max'), sort=params.get('sort')||'default';
  items=items.filter(p=>(!min||p.price>=Number(min))&&(!max||p.price<=Number(max))&&(!params.has('hit')||p.popular));
  if(sort==='asc')items.sort((a,b)=>a.price-b.price);
  if(sort==='desc')items.sort((a,b)=>b.price-a.price);
  function update(key,value){
    const next=new URLSearchParams(params); if(value)next.set(key,value);else next.delete(key);
    setParams(next,{replace:true,preventScrollReset:true});
  }
  return <section className="wrap catalog-page"><Banner/><h1>{name}</h1><Crumbs>{name}</Crumbs>
    <details className="filters"><summary>Фильтры</summary><div className="filter-fields">
      <label>Цена от, ₽<input type="number" min="0" value={min||''} onChange={e=>update('min',e.target.value)}/></label>
      <label>Цена до, ₽<input type="number" min="0" value={max||''} onChange={e=>update('max',e.target.value)}/></label>
      <label>Сортировка<select value={sort} onChange={e=>update('sort',e.target.value)}><option value="default">По умолчанию</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option></select></label>
      <label className="check"><input type="checkbox" checked={params.has('hit')} onChange={e=>update('hit',e.target.checked?'1':'')}/> Популярный товар</label>
      <button className="plain" onClick={()=>setParams(q?{q}:{},{replace:true})}>Сбросить</button>
    </div></details>
    {isSearch&&<p>По запросу «{q||'все товары'}» найдено: {items.length}</p>}
    <ProductGrid key={loc.pathname+loc.search} items={items}/>
  </section>;
}
