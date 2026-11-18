import products from './products.json';

export { products };
export const home = '/yurga';
export const itemUrl = (id) => home + '/item/' + id;
export const catalogUrl = (slug) => home + '/catalog/' + slug;
export const art = (filename) => '/images/site/' + filename;
export const money = (amount) => amount.toLocaleString('ru-RU') + '₽';
export const categories = [
  ['actions', 'Акции', 'special_offers.png'],
  ['68', 'Букеты', 'complete_buket.png'],
  ['1885', 'Букеты с кустовой хризантемой', 'chrysanthemum.png'],
  ['1886', 'Букеты с розами', 'bouquet-rose.png'],
  ['1888', 'Букет на усмотрение флориста', 'bouquets-new.png'],
  ['72', 'Сладости', 'candy.png'],
  ['1784', 'Мыльные розы', 'soap-rose.png'],
  ['71', 'Открытки', 'postcard_s.png'],
  ['70', 'Шарики', 'balloons.png'],
].map(([id, name, icon]) => ({ id, name, icon }));
export const categoryById = Object.fromEntries(categories.map(c => [c.id,c]));
export const productById = Object.fromEntries(products.map(p => [p.id,p]));
export const navigation = [
  ['Главная', home], ['Букет по фото', home + '/bouquet-photo'],
  ['Доставка', home + '/page/dostavka'], ['Оплата', home + '/page/oplata'],
  ['Контакты', home + '/page/contacts'], ['Отзывы', home + '/reviews'],
];
const picks = (...ids) => p => ids.includes(Number(p.id));
export const collections = [
  ['Кому', [
    ['mama','Маме',picks(1936,1954,1963,1981,1935)], ['lubimoy','Любимой',picks(1940,1960,1824,1957)],
    ['partneru','Деловому партнеру',picks(1770,1931,1984)], ['woman','Женщине',picks(1954,1939,1976,1935)],
    ['man','Мужчине',picks(1979,1942,1837)], ['daughter','Дочери',picks(1926,1936,1981)],
  ]],
  ['Повод', [
    ['dr','День рождения',picks(1939,1984,1976,1153,499)], ['denmateri','День матери',picks(1935,1936,1954)],
    ['posledniyzvonok','Последний звонок',picks(1931,1920,1974)], ['pervoesentyabrya','Первое сентября',picks(1935,1841,1931)],
    ['denuchitela','День учителя',picks(1937,1988,1770)], ['noviygod','Новый год',picks(1960,1984,308)],
    ['yubilei','Юбилей',picks(1942,1025,1975)],
  ]],
  ['Цветы', [
    ['rozi','Розы',p=>p.category==='1886'], ['hrizantema','Хризантема',p=>p.category==='1885'],
    ['liliy','Лилия',picks(1950,1972)], ['gipsofila','Гипсофила',picks(1954,1939,1736)],
  ]],
  ['Цены', [
    ['cveti_ne_dorogo','Недорогие цветы',p=>p.price<=2000 && isBouquet(p)],
    ['ot500','От 500 до 1500 рублей',p=>p.price>=500 && p.price<=1500 && isBouquet(p)],
    ['ot1500','От 1500 до 2500',p=>p.price>=1500 && p.price<2500 && isBouquet(p)],
    ['ot2500','От 2500 до 4000',p=>p.price>=2500 && p.price<=4000 && isBouquet(p)],
    ['cveti_dorogo','Дорогие цветы',p=>p.price>4000 && isBouquet(p)],
  ]],
];
function isBouquet(p) { return !['71','72','70'].includes(p.category); }
export const allCollections = collections.flatMap(([, links]) => links);
export const store = {
  city: 'Юрга', street: 'ул. Строительная, 39', phone: '+7-38451-6-63-66', tel: 'tel:+73845166366',
  android: 'https://play.google.com/store/apps/details?id=ru.yugs.apps.store.flowersshop.roz',
  ios: 'https://apps.apple.com/ru/app/id1450783112',
};
