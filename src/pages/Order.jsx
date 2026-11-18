import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { home, money, store } from '../data/shop';
import { useCart } from '../store/Cart';
import Cart from './Cart';

function PhotoPicker({files,onChange}) {
  const [images,setImages]=useState([]),[error,setError]=useState('');
  const input=useRef(null);
  useEffect(()=>{const urls=files.map(f=>URL.createObjectURL(f)); setImages(urls);
    return ()=>urls.forEach(u=>URL.revokeObjectURL(u));},[files]);
  function append(selected){
    const additions=Array.from(selected);
    if(additions.some(f=>!['image/jpeg','image/png'].includes(f.type))){setError('Выберите изображения JPG или PNG.');return;}
    if(additions.length+files.length>4){setError('Можно приложить до четырёх фотографий.');return;}
    setError('');onChange([...files,...additions]);
  }
  return <div><input hidden type="file" accept="image/jpeg,image/png" multiple ref={input} onChange={e=>{append(e.target.files);e.target.value='';}}/>
    <button type="button" className="drop-zone" onClick={()=>input.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();append(e.dataTransfer.files);}}>Перенесите фотографии сюда<br/>или нажмите для выбора файлов<small>До 4 изображений JPG или PNG</small></button>
    {error&&<p role="alert">{error}</p>}<div className="thumbnails">{files.map((f,i)=><div key={i}><img src={images[i]} alt={f.name}/><button type="button" aria-label={'Удалить '+f.name} onClick={()=>onChange(files.filter((_,j)=>i!==j))}>×</button></div>)}</div></div>;
}
const deliveryAreas=['По центру г. Юрга','Киргородок','Пристань','Военный городок','Вокзал по 1','Зимник','п. Сар-Саз','Вокзал по 6','СМП Ирина','д. Талая','д. Безменово','п. Даманский','Юрга 2','п. Речной','Вверх-Тайменка','с. Пятково','п. Юргинский','с. Проскоково','Болотное','Яшкино'];
function today() {
  const d=new Date();
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
function Phone({label}) {return <label>{label}<input required type="tel" pattern={String.raw`[\d\s\+\(\)\-]{6,22}`} placeholder="+7" autoComplete="off" minLength={6}/></label>;}
export default function Order({byPhoto=false}){
  const [mode,setMode]=useState('courier'),[files,setFiles]=useState([]),[error,setError]=useState(''),[receipt,setReceipt]=useState(null);
  const {lines,total,clear}=useCart();
  function submit(e){
    e.preventDefault();
    if(byPhoto&&!files.length){setError('Приложите хотя бы одну фотографию.');return;}
    setReceipt({number:Date.now().toString(36).toUpperCase(),total,mode});
    if(!byPhoto)clear();
    window.scrollTo(0,0);
  }
  if(receipt)return <section className="wrap page"><div className="box center"><h1>{byPhoto?'Заявка по фото подготовлена':'Демонстрационный заказ оформлен'}</h1><p>Номер {receipt.number}</p>
    {!byPhoto&&<p>Сумма товаров: {money(receipt.total)}</p>}<p>Это локальное подтверждение. Магазин заявку не получал.</p><Link to={home}>На главную</Link></div></section>;
  if(!byPhoto&&!lines.length)return <Cart/>;
  return <section className="wrap page"><h1>{byPhoto?'Заказ букета по фото':'Оформление заказа'}</h1>
    <form className="box order" onSubmit={submit}>
      {byPhoto&&<><ol className="photo-steps"><li>Загрузите фотографию букета</li><li>Дождитесь оценки флориста</li><li>Оплатите счёт</li><li>Мы доставляем</li></ol>
        <PhotoPicker files={files} onChange={next=>{setFiles(next);setError('');}}/></>}
      <fieldset><legend>Способ получения</legend><div className="radio-row">{[['pickup','Самовывоз'],['courier','Доставка курьером']].map(([value,label])=><label key={value}><input type="radio" name="mode" checked={mode===value} onChange={()=>setMode(value)}/> {label}</label>)}</div></fieldset>
      <div className="row row-cols-1 row-cols-md-2 g-3"><label>Ваше имя<input required maxLength={90}/></label><Phone label="Ваш номер телефона"/>
        {mode==='courier'&&<><label>Имя получателя<input required maxLength={90}/></label><Phone label="Телефон получателя"/>
          <label>Район доставки<select required defaultValue=""><option disabled value="">Выберите район</option>{deliveryAreas.map(a=><option key={a}>{a}</option>)}</select></label>
          <label>Адрес доставки<input required maxLength={200}/></label><label className="check"><input type="checkbox"/> Подарить анонимно</label></>}
      </div>
      {mode==='pickup'&&<p>Самовывоз: {store.city}, {store.street}.</p>}
      <div className="row row-cols-1 row-cols-md-2 g-3"><label>Дата {mode==='pickup'?'самовывоза':'доставки'}<input type="date" required min={today()}/></label>
        <label>Время<select>{Array.from({length:12},(_,i)=><option key={i}>{i+9}:00 – {i+10}:00</option>)}</select></label></div>
      <label>Комментарий к заказу<textarea rows="3" maxLength={700}/></label>
      {!byPhoto&&<p className="order-total">Товары: {money(total)}</p>}
      <small>Демонстрационная форма. Данные остаются в этом браузере, оплата не взимается.</small>
      {error&&<p role="alert">{error}</p>}<button className="pink">{byPhoto?'Подготовить заявку':'Подтвердить демозаказ'}</button>
    </form></section>;
}
