import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/Cart';
import { catalogUrl, home, itemUrl, money } from '../data/shop';

export default function Cart(){
  const {lines,change,total}=useCart();
  return <section className="wrap page"><h1>Корзина</h1>
    {!lines.length?<div className="box center"><div className="sad">(っ˘̩╭╮˘̩)っ</div><h2>Ваша корзина пуста</h2><p>Загляните в раздел <Link to={catalogUrl('actions')}>«Акции»</Link></p></div>:
    <div className="box"><div className="cart-lines">{lines.map(({product:p,qty})=><article className="cart-line" key={p.id}>
      <Link to={itemUrl(p.id)}><img src={p.image} alt={p.name}/></Link>
      <div className="cart-name"><Link to={itemUrl(p.id)}>{p.name}</Link><small>{money(p.price)} за шт.</small></div>
      <div className="stepper"><button onClick={()=>change(p.id,-1)} aria-label={'Уменьшить количество '+p.name}>−</button><span>{qty}</span><button onClick={()=>change(p.id,1)} disabled={qty>=99} aria-label={'Увеличить количество '+p.name}>+</button></div>
      <strong>{money(p.price*qty)}</strong><button className="remove" aria-label={'Удалить '+p.name} onClick={()=>change(p.id,-qty)}>×</button></article>)}</div>
      <div className="cart-total"><strong>Итого за товары: {money(total)}</strong><Link className="pink" to={home+'/checkout'}>Оформить заказ</Link></div></div>}
    </section>;
}
