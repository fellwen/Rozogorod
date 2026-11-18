import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { home, store } from '../data/shop';
import { NotFound } from './Catalog';

export function Info() {
  const {slug}=useParams();
  const pages={
    dostavka:['Доставка',<><h2>Доставка цветов по Юрге</h2><p>Курьеры доставляют заказы с 9:00 до 21:00. Время и район можно выбрать при оформлении.</p><p>На странице условий магазина указана бесплатная доставка по городу от 5 000 ₽. На главном баннере указан порог 3 000 ₽. Стоимость доставки уточняют при подтверждении заказа.</p></>],
    oplata:['Оплата',<><h2>Способы оплаты</h2><ul><li>Оплата по банку Сбербанк</li><li>Оплата по банку Тинькофф</li><li>Перевод на карту</li></ul><p>В демонстрационной версии заказ завершается локальным подтверждением.</p></>],
    contacts:['Контакты',<><h2>Магазин в Юрге</h2><p>{store.city}, {store.street}</p><a href={store.tel}>{store.phone}</a><p><Link to={home+'/page/dostavka'}>Условия доставки</Link></p></>],
  };
  const page=pages[slug];if(!page)return <NotFound/>;
  return <section className="wrap page"><h1>{page[0]}</h1><div className="box prose">{page[1]}</div></section>;
}
export function Reviews(){
  const [reviews,setReviews]=useState(()=>{try{const rows=JSON.parse(localStorage.getItem('rozogorod.reviews.v1'));return Array.isArray(rows)?rows.filter(r=>typeof r?.name==='string'&&typeof r.text==='string'):[];}catch{return [];}});
  const [saved,setSaved]=useState(false);
  function add(e){
    e.preventDefault();const form=e.currentTarget;const fields=new FormData(form);
    const name=String(fields.get('name')).trim(), text=String(fields.get('review')).trim();
    if(!name||!text)return;
    const next=[{id:Date.now(),name,text,date:new Date().toLocaleDateString('ru-RU')},...reviews];
    setReviews(next);try{localStorage.setItem('rozogorod.reviews.v1',JSON.stringify(next));}catch{}
    form.reset();setSaved(true);
  }
  return <section className="wrap page"><h1>Отзывы покупателей</h1><div className="box prose">
    {reviews.map(r=><article className="review" key={r.id}><strong>{r.name}</strong><small>{r.date}</small><p>{r.text}</p></article>)}
    {!reviews.length&&<p>В этой версии магазина пока нет отзывов.</p>}
    <form className="review-form" onSubmit={add}><h2>Оставить отзыв</h2><label>Ваше имя<input name="name" required maxLength={70}/></label>
    <label>Ваш отзыв<textarea name="review" required rows="3" maxLength={800}/></label><small>Отзыв сохраняется только в вашем браузере.</small><button className="pink">Сохранить отзыв</button>{saved&&<p role="status">Отзыв сохранён.</p>}</form>
  </div></section>;
}
