import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { itemUrl, money } from '../data/shop';
import { useCart } from '../store/Cart';

export function AddButton({product,detail=false}) {
  const { change,cart }=useCart();
  const [added,setAdded]=useState(false);
  useEffect(()=>{if(!added)return;const timer=setTimeout(()=>setAdded(false),1100);return ()=>clearTimeout(timer);},[added]);
  return <button className="pink" disabled={cart[product.id]>=99} onClick={()=>{change(product.id,1);setAdded(true);}}>
    {cart[product.id]>=99?'В корзине 99 шт.':added?'Добавлено ✓':detail?'Добавить в корзину':'В корзину'}</button>;
}
export function Price({ product }) {
  return <div className="prices"><span>{money(product.price)}</span>{product.oldPrice&&<del>{money(product.oldPrice)}</del>}</div>;
}
export function ProductCard({product}){
  return <article className="product-card"><Link className="card-main" to={itemUrl(product.id)}>
    {product.oldPrice&&<b className="sale">Акция</b>}
    <div className="card-pic"><img loading="lazy" src={product.image} alt={product.name}/></div>
    <h3>{product.name}</h3><Price product={product}/></Link><AddButton product={product}/></article>;
}
const limits = new Map();
export function ProductGrid({items,step=16,remember=true}){
  const {key}=useLocation();
  const [limit,setLimit]=useState(()=>remember ? limits.get(key)||step : step);
  const more=useRef(null);
  useEffect(()=>{if(remember)limits.set(key,limit);},[key,limit,remember]);
  useEffect(()=>{
    const el=more.current;
    if(!el || !window.IntersectionObserver)return;
    const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)setLimit(n=>Math.min(items.length,n+step));});
    io.observe(el);return ()=>io.disconnect();
  },[limit,items.length,step]);
  if(!items.length) return <p className="empty">Подходящих товаров пока нет.</p>;
  return <><div className="product-grid">{items.slice(0,limit).map(p=><ProductCard product={p} key={p.id}/>)}</div>
    {limit<items.length&&<div className="more" ref={more}><button className="plain" onClick={()=>setLimit(n=>n+step)}>Показать ещё ⟳</button></div>}</>;
}
