import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { art, catalogUrl, categoryById, productById, products } from '../data/shop';
import { AddButton, Price, ProductCard } from '../components/Products';
import { Dialog } from '../components/Layout';
import { Crumbs, NotFound } from './Catalog';

export default function Product(){
  const {id}=useParams(), product=productById[id];
  const [zoom,setZoom]=useState(false);
  if(!product)return <NotFound/>;
  const cat=categoryById[product.category];
  const related=products.filter(p=>p.category===cat.id&&p.id!==id).slice(0,4);
  return <section className="wrap detail"><Crumbs><Link to={catalogUrl(cat.id)}>{cat.name}</Link> » {product.name}</Crumbs>
    <div className="product-panel"><h1><Link to={catalogUrl(cat.id)} aria-label="К категории">←</Link> {product.name}</h1>
      <div className="detail-columns"><button className="photo" onClick={()=>setZoom(true)}><img src={product.largeImage||product.image} alt={product.name}/><small>Увеличить ⌕</small></button>
        <div><Price product={product}/><AddButton product={product} detail/>
          <h3>Описание товара</h3><p>{product.description||product.name+'. Раздел «'+cat.name+'».'}</p></div></div>
      <h2>Дополните букет приятной мелочью</h2><div className="extras">{['71','72','68'].map(id=>{const c=categoryById[id];return <Link key={id} to={catalogUrl(id)}><img src={art(c.icon)} alt=""/>{c.name}</Link>;})}</div>
    </div>
    {related.length>0&&<><h2 className="center">Рекомендуем также</h2><div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></>}
    {zoom&&<Dialog title={product.name} close={()=>setZoom(false)}><img className="zoom-image" src={product.largeImage||product.image} alt={product.name}/></Dialog>}
  </section>;
}
