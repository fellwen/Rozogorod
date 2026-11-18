import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { CartProvider } from './store/Cart';
import { Catalog, Home, NotFound } from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Order from './pages/Order';
import { Info, Reviews } from './pages/Info';
import './vendor/bootstrap/bootstrap-grid.css';
import './styles.css';

if ('scrollRestoration' in history) history.scrollRestoration='manual';
createRoot(document.getElementById('root')).render(
  <BrowserRouter><CartProvider><Routes>
    <Route path="/" element={<Navigate replace to="/yurga"/>}/>
    <Route path="/yurga" element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path="catalog/:slug" element={<Catalog/>}/>
      <Route path="search" element={<Catalog/>}/>
      <Route path="item/:id" element={<Product/>}/>
      <Route path="cart" element={<Cart/>}/>
      <Route path="checkout" element={<Order key="checkout"/>}/>
      <Route path="bouquet-photo" element={<Order key="photo" byPhoto/>}/>
      <Route path="page/:slug" element={<Info/>}/>
      <Route path="reviews" element={<Reviews/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
    <Route path="*" element={<NotFound/>}/>
  </Routes></CartProvider></BrowserRouter>
);
