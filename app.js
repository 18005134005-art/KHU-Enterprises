/* ================================================================
   KHU Enterprise – app.js
   Full e-commerce + WhatsApp catalog
================================================================ */
'use strict';

const PKR_RATE = 278;
const WA_NUMBER = '923340049278';
const KHU_EMAIL = 'info@khu-enterprise.com';

const state = {
  cart: [],
  wishlist: [],
  filterGroup: 'all',
  filterCategory: '',
  filterGender: '',
  filterMinPrice: 0,
  filterMaxPrice: 500,
  sortBy: 'default',
  search: '',
  viewMode: 'grid',
  heroSlide: 0,
  detailProduct: null,
  detailSize: '',
  detailColor: '',
  detailQty: 1,
  detailImg: 0,
  detailTab: 'description',
  qvProduct: null,
  qvSize: '',
  currency: 'USD',
  rates: { USD: 1, GBP: 1, EUR: 1 }
};

/* ── CURRENCY ─────────────────────────────────────────────────────── */
var _CURRENCY_SYMBOLS = { USD: '$', GBP: '£', EUR: '€' };

function formatPrice(amount) {
  var rate = (state.rates && state.rates[state.currency]) || 1;
  var sym  = _CURRENCY_SYMBOLS[state.currency] || '$';
  var val  = Math.round(amount * rate);
  return sym + val.toLocaleString();
}

function setCurrency(cur) {
  if (!_CURRENCY_SYMBOLS[cur]) return;
  state.currency = cur;
  /* update switcher button states */
  document.querySelectorAll('.cur-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.cur === cur);
  });
  /* re-render any open product detail */
  if (state.detailProduct) openProductDetail(state.detailProduct.id);
  /* re-render product grids */
  if (document.getElementById('productsSection') &&
      document.getElementById('productsSection').classList.contains('active')) {
    filterProducts(state.filterCategory || state.filterGroup);
  }
  renderFeaturedProducts();
  renderBestsellers();
}

function fetchRates() {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.frankfurter.app/latest?from=USD&to=GBP,EUR', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && data.rates) {
            state.rates.GBP = data.rates.GBP || state.rates.GBP;
            state.rates.EUR = data.rates.EUR || state.rates.EUR;
          }
        } catch(e2) {}
      }
    };
    xhr.send();
  } catch(e) {}
}

/* ── SHOW SECTION ───────────────────────────────────────────────── */
/* showSection defined below */

/* filterProducts defined below */

/* ── PRODUCTS ───────────────────────────────────────────────────── */
const products = [
  /* SUMMER TRACKSUITS */
  { id:1, name:"Breeze Summer Tracksuit – Men", category:"summer-tracksuits", group:"hosiery", gender:"men",
    priceUSD:65, origUSD:82,
    image:"images/products/tracksuit-summer-men-1.jpg",
    cdnImage:"images/products/tracksuit-summer-men-1.jpg",
    images:["images/products/tracksuit-summer-men-2.jpg","images/products/tracksuit-summer-men-3.jpg","images/products/tracksuit-summer-men-4.jpg","images/products/tracksuit-summer-men-5.jpg","images/products/tracksuit-summer-men-6.jpg","images/products/tracksuit-summer-men-7.jpg"],
    rating:4.8, reviews:214, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#2E86C1","#27AE60"],
    description:"Lightweight breathable summer tracksuit crafted from moisture-wicking fabric. Perfect for casual wear and light workouts.",
    specs:{Material:"65% Polyester / 35% Cotton",Fit:"Regular",Season:"Summer",Care:"Machine wash cold",Closure:"Drawstring + Zip",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:true },

  { id:2, name:"Breeze Summer Tracksuit – Women", category:"summer-tracksuits", group:"hosiery", gender:"women",
    priceUSD:68, origUSD:88,
    image:"images/products/tracksuit-summer-women-1.jpg",
    cdnImage:"images/products/tracksuit-summer-women-1.jpg",
    images:["images/products/tracksuit-summer-women-2.jpg","images/products/tracksuit-summer-women-3.jpg","images/products/tracksuit-summer-women-4.jpg","images/products/tracksuit-summer-women-5.jpg","images/products/tracksuit-summer-women-6.jpg"],
    rating:4.7, reviews:189, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#F8C8D4","#FFFFFF","#2E86C1"],
    description:"Feminine cut summer tracksuit with elastic waistband and side pockets. Breathable and stylish for any occasion.",
    specs:{Material:"70% Polyester / 30% Cotton",Fit:"Slim",Season:"Summer",Care:"Machine wash cold",Closure:"Elastic waist + Zip",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:3, name:"Classic Polo Tracksuit – Unisex", category:"summer-tracksuits", group:"hosiery", gender:"unisex",
    priceUSD:72, origUSD:null,
    image:"images/products/tracksuit-polo-unisex-1.jpg",
    cdnImage:"images/products/tracksuit-polo-unisex-1.jpg",
    images:["images/products/tracksuit-polo-unisex-2.jpg","images/products/tracksuit-polo-unisex-3.jpg","images/products/tracksuit-polo-unisex-4.jpg","images/products/tracksuit-polo-unisex-5.jpg"],
    rating:4.6, reviews:142, badge:"new",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#FFFFFF","#8B0000"],
    description:"Classic polo-collar tracksuit ideal for summer mornings. Premium stitching and durable fabric for long-lasting wear.",
    specs:{Material:"100% Cotton Pique",Fit:"Regular",Season:"Summer",Care:"Machine wash warm",Closure:"Polo collar + Drawstring",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:false },

  /* WINTER TRACKSUITS */
  { id:4, name:"Thermal Winter Tracksuit – Men", category:"winter-tracksuits", group:"hosiery", gender:"men",
    priceUSD:89, origUSD:112,
    image:"images/products/tracksuit-winter-men-1.jpg",
    cdnImage:"images/products/tracksuit-winter-men-1.jpg",
    images:["images/products/tracksuit-winter-men-2.jpg","images/products/tracksuit-winter-men-3.jpg","images/products/tracksuit-winter-men-4.jpg","images/products/tracksuit-winter-men-5.jpg"],
    rating:4.9, reviews:312, badge:"sale",
    sizes:["S","M","L","XL","XXL","XXXL"], colors:["#1A1A1A","#2C3E50","#4A235A"],
    description:"Heavy-weight fleece-lined winter tracksuit. Superior warmth with anti-pilling fleece inner lining.",
    specs:{Material:"80% Cotton / 20% Polyester Fleece",Fit:"Regular",Season:"Winter",Care:"Machine wash cold gentle",Closure:"Full zip + Drawstring",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:5, name:"Cozy Fleece Tracksuit – Women", category:"winter-tracksuits", group:"hosiery", gender:"women",
    priceUSD:92, origUSD:118,
    image:"images/products/tracksuit-fleece-women-1.jpg",
    cdnImage:"images/products/tracksuit-fleece-women-1.jpg",
    images:["images/products/tracksuit-fleece-women-2.jpg","images/products/tracksuit-fleece-women-3.jpg","images/products/tracksuit-fleece-women-4.jpg","images/products/tracksuit-fleece-women-5.jpg"],
    rating:4.8, reviews:267, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#D4A0A0","#2C3E50","#FFFFFF"],
    description:"Plush winter tracksuit with soft fleece lining, ribbed cuffs and a flattering tapered leg silhouette.",
    specs:{Material:"75% Cotton / 25% Polyester Fleece",Fit:"Slim",Season:"Winter",Care:"Machine wash cold",Closure:"Half zip + Elastic waist",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:true },

  { id:6, name:"Pro Winter Set – Unisex", category:"winter-tracksuits", group:"hosiery", gender:"unisex",
    priceUSD:98, origUSD:null,
    image:"images/products/tracksuit-winter-unisex-1.jpg",
    cdnImage:"images/products/tracksuit-winter-unisex-1.jpg",
    images:["images/products/tracksuit-winter-unisex-2.jpg","images/products/tracksuit-winter-unisex-3.jpg","images/products/tracksuit-winter-unisex-4.jpg","images/products/tracksuit-winter-unisex-5.jpg","images/products/tracksuit-winter-unisex-6.jpg","images/products/tracksuit-winter-unisex-7.jpg","images/products/tracksuit-winter-unisex-8.jpg"],
    rating:4.7, reviews:198, badge:"new",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#27AE60","#2E86C1"],
    description:"Professional grade winter training set with 4-way stretch and windproof outer layer. Ideal for outdoor athletes.",
    specs:{Material:"90% Polyester / 10% Elastane",Fit:"Athletic",Season:"Winter",Care:"Machine wash cold",Closure:"Full zip + Drawstring",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:false },

  /* SPORTS TRACKSUITS */
  { id:7, name:"Elite Sports Tracksuit – Men", category:"sports-tracksuits", group:"hosiery", gender:"men",
    priceUSD:85, origUSD:108,
    image:"images/products/tracksuit-sports-men-1.jpg",
    cdnImage:"images/products/tracksuit-sports-men-1.jpg",
    images:["images/products/tracksuit-sports-men-2.jpg","images/products/tracksuit-sports-men-3.jpg","images/products/tracksuit-sports-men-4.jpg","images/products/tracksuit-sports-men-5.jpg","images/products/tracksuit-sports-men-6.jpg"],
    rating:4.9, reviews:421, badge:"bestseller",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#C0392B","#2E86C1"],
    description:"Competition-grade sports tracksuit with reflective piping, zip pockets and athletic tapered fit. Built for performance.",
    specs:{Material:"100% Polyester Microfiber",Fit:"Athletic",Season:"All Season",Care:"Machine wash cold",Closure:"Full zip + Drawstring",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  /* PUFFER JACKETS */
  { id:8, name:"Arctic Puffer Jacket – Men", category:"puffer-jackets", group:"hosiery", gender:"men",
    priceUSD:112, origUSD:142,
    image:"images/products/puffer-arctic-men-1.jpg",
    cdnImage:"images/products/puffer-arctic-men-1.jpg",
    images:["images/products/puffer-arctic-men-2.jpg","images/products/puffer-arctic-men-3.jpg","images/products/puffer-arctic-men-4.jpg","images/products/puffer-arctic-men-5.jpg","images/products/puffer-arctic-men-6.jpg"],
    rating:4.8, reviews:189, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#2C3E50","#6C3483"],
    description:"Ultra-warm arctic puffer jacket with 650-fill down insulation. Packable design fits into its own pocket.",
    specs:{Material:"Outer: 100% Nylon / Fill: 650-fill Down",Fit:"Regular",Season:"Winter",Care:"Dry clean recommended",Closure:"Full zip + Snap",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:true },

  { id:9, name:"Quilted Puffer Jacket – Women", category:"puffer-jackets", group:"hosiery", gender:"women",
    priceUSD:118, origUSD:148,
    image:"images/products/puffer-quilted-women-1.jpg",
    cdnImage:"images/products/puffer-quilted-women-1.jpg",
    images:["images/products/puffer-quilted-women-2.jpg","images/products/puffer-quilted-women-3.jpg","images/products/puffer-quilted-women-4.jpg"],
    rating:4.7, reviews:234, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#F8C8D4","#1A1A1A","#2E86C1"],
    description:"Chic quilted puffer with cinched waist and detachable hood. The perfect blend of fashion and warmth.",
    specs:{Material:"Outer: 100% Polyester / Fill: Synthetic Down",Fit:"Slim",Season:"Winter",Care:"Machine wash cold",Closure:"Full zip",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  { id:46, name:"Hooded Puffer Vest – Men", category:"puffer-jackets", group:"hosiery", gender:"men",
    priceUSD:92, origUSD:118,
    image:"images/products/puffer-vest-men-1.jpg",
    cdnImage:"images/products/puffer-vest-men-1.jpg",
    images:["images/products/puffer-vest-men-2.jpg","images/products/puffer-vest-men-3.jpg","images/products/puffer-vest-men-4.jpg","images/products/puffer-vest-men-5.jpg","images/products/puffer-vest-men-6.jpg"],
    rating:4.6, reviews:142, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#2C3E50","#27AE60"],
    description:"Sleeveless hooded puffer vest with synthetic down fill. Lightweight and ideal for layering in cold weather.",
    specs:{Material:"Outer: 100% Nylon / Fill: Synthetic Down",Fit:"Regular",Season:"Autumn/Winter",Care:"Machine wash cold",Closure:"Full zip",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:true },

  { id:47, name:"Long Down Puffer Coat – Women", category:"puffer-jackets", group:"hosiery", gender:"women",
    priceUSD:138, origUSD:175,
    image:"images/products/puffer-coat-women-1.jpg",
    cdnImage:"images/products/puffer-coat-women-1.jpg",
    images:["images/products/puffer-coat-women-2.jpg","images/products/puffer-coat-women-3.jpg","images/products/puffer-coat-women-4.jpg","images/products/puffer-coat-women-5.jpg","images/products/puffer-coat-women-6.jpg","images/products/puffer-coat-women-7.jpg"],
    rating:4.8, reviews:267, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#F8C8D4","#2C3E50"],
    description:"Floor-length down puffer coat with faux-fur trimmed hood. Maximum warmth with an elegant silhouette.",
    specs:{Material:"Outer: 100% Polyester / Fill: 80/20 Down",Fit:"Relaxed",Season:"Winter",Care:"Dry clean recommended",Closure:"Full zip + Snap",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:true },

  { id:48, name:"Packable Lightweight Puffer – Unisex", category:"puffer-jackets", group:"hosiery", gender:"unisex",
    priceUSD:98, origUSD:null,
    image:"images/products/puffer-packable-1.jpg",
    cdnImage:"images/products/puffer-packable-1.jpg",
    images:["images/products/puffer-packable-2.jpg","images/products/puffer-packable-3.jpg","images/products/puffer-packable-4.jpg","images/products/puffer-packable-5.jpg","images/products/puffer-packable-6.jpg"],
    rating:4.7, reviews:198, badge:"new",
    sizes:["XS","S","M","L","XL","XXL"], colors:["#C0392B","#1A1A1A","#2E86C1","#F39C12"],
    description:"Ultra-lightweight puffer that packs into its own pocket. Perfect for travel and outdoor adventures. Water-resistant shell.",
    specs:{Material:"Outer: 100% Ripstop Nylon / Fill: Synthetic",Fit:"Regular",Season:"All Season",Care:"Machine wash cold",Closure:"Full zip",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:false },

  /* UPPERS */
  { id:10, name:"Classic Hoodie – Unisex", category:"uppers", group:"hosiery", gender:"unisex",
    priceUSD:55, origUSD:null,
    image:"images/products/hoodie-unisex-1.jpg",
    cdnImage:"images/products/hoodie-unisex-1.jpg",
    images:["images/products/hoodie-unisex-2.jpg","images/products/hoodie-unisex-3.jpg","images/products/hoodie-unisex-4.jpg","images/products/hoodie-unisex-5.jpg"],
    rating:4.6, reviews:378, badge:null,
    sizes:["XS","S","M","L","XL","XXL"], colors:["#808080","#1A1A1A","#C0392B","#2E86C1"],
    description:"Everyday comfort hoodie with kangaroo pocket and adjustable drawstring hood. Soft brushed interior for maximum comfort.",
    specs:{Material:"80% Cotton / 20% Polyester",Fit:"Oversized",Season:"All Season",Care:"Machine wash warm",Closure:"Pullover",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:false },

  { id:11, name:"Athletic Sweatshirt – Men", category:"uppers", group:"hosiery", gender:"men",
    priceUSD:48, origUSD:62,
    image:"images/products/sweatshirt-men-1.jpg",
    cdnImage:"images/products/sweatshirt-men-1.jpg",
    images:["images/products/sweatshirt-men-2.jpg","images/products/sweatshirt-men-3.jpg","images/products/sweatshirt-men-4.jpg","images/products/sweatshirt-men-5.jpg"],
    rating:4.5, reviews:156, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#27AE60","#F39C12"],
    description:"Crewneck athletic sweatshirt with ribbed cuffs and hem. Moisture management fabric keeps you dry during workouts.",
    specs:{Material:"60% Cotton / 40% Polyester",Fit:"Regular",Season:"All Season",Care:"Machine wash cold",Closure:"Pullover",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:true },

  /* TROUSERS */
  { id:12, name:"Jogger Trousers – Unisex", category:"trousers", group:"hosiery", gender:"unisex",
    priceUSD:38, origUSD:null,
    image:"images/products/jogger-trousers-1.jpg",
    cdnImage:"images/products/jogger-trousers-1.jpg",
    images:["images/products/jogger-trousers-2.jpg","images/products/jogger-trousers-3.jpg","images/products/jogger-trousers-4.jpg","images/products/jogger-trousers-5.jpg","images/products/jogger-trousers-6.jpg"],
    rating:4.6, reviews:298, badge:null,
    sizes:["XS","S","M","L","XL","XXL"], colors:["#808080","#1A1A1A","#2C3E50"],
    description:"Tapered jogger trousers with deep side pockets and elastic ankle cuffs. Versatile enough for gym or street wear.",
    specs:{Material:"65% Cotton / 35% Polyester",Fit:"Tapered",Season:"All Season",Care:"Machine wash cold",Closure:"Elastic + Drawstring",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:false },

  /* LEGGINGS */
  { id:13, name:"High-Waist Leggings – Women", category:"leggings", group:"hosiery", gender:"women",
    priceUSD:42, origUSD:54,
    image:"images/products/leggings-highwaist-1.jpg",
    cdnImage:"images/products/leggings-highwaist-1.jpg",
    images:["images/products/leggings-highwaist-2.jpg","images/products/leggings-highwaist-3.jpg","images/products/leggings-highwaist-4.jpg"],
    rating:4.9, reviews:512, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#2E86C1","#8E44AD"],
    description:"Squat-proof high-waist leggings with hidden pocket. 4-way stretch fabric provides unrestricted movement.",
    specs:{Material:"75% Nylon / 25% Elastane",Fit:"Compression",Season:"All Season",Care:"Machine wash cold",Closure:"Elastic waistband",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:14, name:"Printed Leggings – Women", category:"leggings", group:"hosiery", gender:"women",
    priceUSD:38, origUSD:null,
    image:"images/products/leggings-printed-1.jpg",
    cdnImage:"images/products/leggings-printed-1.jpg",
    images:["images/products/leggings-printed-2.jpg","images/products/leggings-printed-3.jpg","images/products/leggings-printed-4.jpg","images/products/leggings-printed-5.jpg","images/products/leggings-printed-6.jpg","images/products/leggings-printed-7.jpg"],
    rating:4.7, reviews:287, badge:"new",
    sizes:["XS","S","M","L","XL"], colors:["#E91E63","#9C27B0","#1A1A1A"],
    description:"Bold printed leggings with moisture-wicking technology. Flatlock seams eliminate chafing during high-intensity sessions.",
    specs:{Material:"80% Polyester / 20% Elastane",Fit:"Compression",Season:"All Season",Care:"Machine wash cold",Closure:"Elastic waistband",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:false },

  /* TIGHTS */
  { id:15, name:"Thermal Running Tights – Men", category:"tights", group:"hosiery", gender:"men",
    priceUSD:45, origUSD:58,
    image:"images/products/tights-running-men-1.jpg",
    cdnImage:"images/products/tights-running-men-1.jpg",
    images:["images/products/tights-running-men-2.jpg","images/products/tights-running-men-3.jpg","images/products/tights-running-men-4.jpg","images/products/tights-running-men-5.jpg","images/products/tights-running-men-6.jpg","images/products/tights-running-men-7.jpg","images/products/tights-running-men-8.jpg"],
    rating:4.6, reviews:143, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#2C3E50","#C0392B"],
    description:"Thermal compression tights with brushed inner surface. Reflective details for safe night running.",
    specs:{Material:"85% Polyester / 15% Elastane",Fit:"Compression",Season:"Winter",Care:"Machine wash cold",Closure:"Elastic waistband",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:true },


  /* GYM SETS */
  { id:19, name:"Power Gym Set – Women", category:"gym-sets", group:"hosiery", gender:"women",
    priceUSD:55, origUSD:null,
    image:"images/products/gym-set-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=85&auto=format&fit=crop",
    images:["images/products/gym-set-women-2.jpg","images/products/gym-set-women-3.jpg","images/products/gym-set-women-4.jpg","images/products/gym-set-women-5.jpg"],
    rating:4.9, reviews:378, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#C0392B","#8E44AD"],
    description:"Complete 3-piece gym set including sports bra, leggings, and zip-up jacket. Seamless construction for maximum comfort.",
    specs:{Material:"88% Nylon / 12% Elastane",Fit:"Compression",Season:"All Season",Care:"Machine wash cold",Set:"Bra + Leggings + Jacket",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:20, name:"Core Training Set – Men", category:"gym-sets", group:"hosiery", gender:"men",
    priceUSD:52, origUSD:68,
    image:"images/products/gym-set-men-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1591741543032-bf439b4fd46c?w=600&q=85&auto=format&fit=crop",
    images:["images/products/gym-set-men-2.jpg","images/products/gym-set-men-3.jpg","images/products/gym-set-men-4.jpg","images/products/gym-set-men-5.jpg","images/products/gym-set-men-6.jpg"],
    rating:4.7, reviews:245, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#2E86C1","#27AE60"],
    description:"2-piece gym set with compression shorts and performance tank. Engineered for high-intensity training sessions.",
    specs:{Material:"90% Polyester / 10% Elastane",Fit:"Athletic",Season:"All Season",Care:"Machine wash cold",Set:"Tank + Shorts",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  { id:21, name:"Yoga Flow Set – Women", category:"gym-sets", group:"hosiery", gender:"women",
    priceUSD:58, origUSD:null,
    image:"images/products/yoga-flow-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1618863952355-b79fb3947919?w=600&q=85&auto=format&fit=crop",
    images:["images/products/yoga-flow-women-2.jpg","images/products/yoga-flow-women-3.jpg","images/products/yoga-flow-women-4.jpg","images/products/yoga-flow-women-5.jpg"],
    rating:4.8, reviews:312, badge:"new",
    sizes:["XS","S","M","L","XL"], colors:["#D4E6F1","#FDEBD0","#1A1A1A"],
    description:"Buttery soft yoga set with 4-way stretch. High-neck sports bra and wide-waistband leggings for seamless movement.",
    specs:{Material:"92% Polyester / 8% Elastane",Fit:"Slim",Season:"All Season",Care:"Machine wash cold",Set:"Bra + Leggings",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:false },

  /* COMPRESSION */
  { id:22, name:"Pro Compression Tights – Unisex", category:"compression", group:"hosiery", gender:"unisex",
    priceUSD:38, origUSD:48,
    image:"images/products/compression-tights-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1594737626072-90dc274bc2bd?w=600&q=85&auto=format&fit=crop",
    images:["images/products/compression-tights-2.jpg","images/products/compression-tights-3.jpg"],
    rating:4.8, reviews:201, badge:"sale",
    sizes:["XS","S","M","L","XL","XXL"], colors:["#1A1A1A","#C0392B","#2E86C1"],
    description:"Medical-grade graduated compression tights. Reduce muscle fatigue, speed up recovery and improve performance.",
    specs:{Material:"80% Nylon / 20% Elastane",Compression:"20-30 mmHg",Fit:"Compression",Care:"Machine wash cold",Feature:"Graduated compression",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:true },

  /* GYM SHORTS */
  { id:23, name:"Performance Gym Shorts – Men", category:"gym-shorts", group:"hosiery", gender:"men",
    priceUSD:28, origUSD:36,
    image:"images/products/gym-shorts-men-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1591741543032-bf439b4fd46c?w=600&q=85&auto=format&fit=crop",
    images:["images/products/gym-shorts-men-2.jpg","images/products/gym-shorts-men-3.jpg","images/products/gym-shorts-men-4.jpg","images/products/gym-shorts-men-5.jpg"],
    rating:4.6, reviews:334, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#808080","#2E86C1"],
    description:"Lightweight 7-inch gym shorts with inner liner and zippered back pocket. Built for heavy lifting and CrossFit.",
    specs:{Material:"100% Polyester",Fit:"Athletic",Length:"7 inch",Care:"Machine wash cold",Feature:"Inner liner + zip pocket",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  { id:24, name:"Biker Shorts – Women", category:"gym-shorts", group:"hosiery", gender:"women",
    priceUSD:28, origUSD:null,
    image:"images/products/biker-shorts-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1618863952355-b79fb3947919?w=600&q=85&auto=format&fit=crop",
    images:["images/products/biker-shorts-women-2.jpg","images/products/biker-shorts-women-3.jpg","images/products/biker-shorts-women-4.jpg","images/products/biker-shorts-women-5.jpg","images/products/biker-shorts-women-6.jpg","images/products/biker-shorts-women-7.jpg"],
    rating:4.8, reviews:445, badge:"new",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#8E44AD","#C0392B"],
    description:"High-waist biker shorts with tummy control panel. Squat-proof, fade-resistant fabric for studio to street style.",
    specs:{Material:"78% Nylon / 22% Elastane",Fit:"Compression",Length:"Mid-thigh",Care:"Machine wash cold",Feature:"Tummy control",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:false },

  /* SPORTS BRA */
  { id:25, name:"Impact Sports Bra – Women", category:"sports-bra", group:"hosiery", gender:"women",
    priceUSD:32, origUSD:42,
    image:"images/products/sports-bra-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=85&auto=format&fit=crop",
    images:["images/products/sports-bra-women-2.jpg","images/products/sports-bra-women-3.jpg","images/products/sports-bra-women-4.jpg"],
    rating:4.7, reviews:523, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#C0392B","#F39C12"],
    description:"High-impact sports bra with underwire support and moisture-wicking cups. Full coverage and adjustable straps.",
    specs:{Material:"85% Nylon / 15% Elastane",Support:"High Impact",Feature:"Underwire + adjustable straps",Care:"Machine wash cold",Closure:"Hook & eye",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  /* RUNNING */
  { id:26, name:"Marathon Running Set – Unisex", category:"running", group:"hosiery", gender:"unisex",
    priceUSD:48, origUSD:62,
    image:"images/products/running-set-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1758684051308-79deb143305a?w=600&q=85&auto=format&fit=crop",
    images:["images/products/running-set-2.jpg","images/products/running-set-3.jpg"],
    rating:4.8, reviews:267, badge:"sale",
    sizes:["XS","S","M","L","XL","XXL"], colors:["#1A1A1A","#F39C12","#27AE60"],
    description:"Aerodynamic running set with reflective details and ventilation panels. Race-day performance in every stride.",
    specs:{Material:"88% Polyester / 12% Elastane",Fit:"Athletic",Feature:"Reflective + ventilation",Care:"Machine wash cold",Set:"Top + Shorts",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  /* YOGA */
  { id:27, name:"Zen Yoga Collection – Women", category:"yoga", group:"hosiery", gender:"women",
    priceUSD:45, origUSD:null,
    image:"images/products/yoga-zen-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1618863952355-b79fb3947919?w=600&q=85&auto=format&fit=crop",
    images:["images/products/yoga-zen-women-2.jpg","images/products/yoga-zen-women-3.jpg"],
    rating:4.9, reviews:389, badge:"new",
    sizes:["XS","S","M","L","XL"], colors:["#D4E6F1","#FAD7A0","#D2B4DE"],
    description:"Mindful yoga collection crafted from organic cotton blend. Ultra-soft, non-restrictive fit for deep stretches and inversions.",
    specs:{Material:"60% Organic Cotton / 35% Polyester / 5% Elastane",Fit:"Relaxed",Feature:"Eco-friendly",Care:"Machine wash cold",Set:"Top + Leggings",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:false },

  /* FOOTBALL */
  { id:28, name:"Pro Football Kit – Men", category:"football", group:"hosiery", gender:"men",
    priceUSD:45, origUSD:58,
    image:"images/products/football-kit-men-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1611122261270-3171e87a5567?w=600&q=85&auto=format&fit=crop",
    images:["images/products/football-kit-men-2.jpg","images/products/football-kit-men-3.jpg","images/products/football-kit-men-4.jpg","images/products/football-kit-men-5.jpg","images/products/football-kit-men-6.jpg"],
    rating:4.8, reviews:198, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#C0392B","#2E86C1"],
    description:"Professional football kit with mesh ventilation panels and heat-pressed badge. Lightweight and durable for match play.",
    specs:{Material:"100% Recycled Polyester",Fit:"Athletic",Feature:"Mesh ventilation + heat-press logo",Care:"Machine wash cold",Set:"Jersey + Shorts + Socks",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  /* WOMEN SWIMWEAR */
  { id:29, name:"Paradise One-Piece Swimsuit", category:"womens-swim", group:"hosiery", gender:"women",
    priceUSD:48, origUSD:62,
    image:"images/products/swimsuit-onepiece-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1603259618142-2330101e3489?w=600&q=85&auto=format&fit=crop",
    images:["images/products/swimsuit-onepiece-2.jpg","images/products/swimsuit-onepiece-3.jpg"],
    rating:4.9, reviews:312, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1ABC9C","#E91E63","#1A1A1A"],
    description:"Elegant one-piece swimsuit with tummy-control lining and UV50+ protection. Designed for pool and ocean alike.",
    specs:{Material:"80% Nylon / 20% Elastane",UV:"UPF 50+",Feature:"Tummy control lining",Care:"Rinse after use, hand wash",Chlorine:"Resistant",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  
  { id:31, name:"Sport Tankini – Women", category:"womens-swim", group:"hosiery", gender:"women",
    priceUSD:42, origUSD:null,
    image:"images/products/tankini-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1515023677547-593d7638cbd6?w=600&q=85&auto=format&fit=crop",
    images:["images/products/tankini-women-2.jpg","images/products/tankini-women-3.jpg","images/products/tankini-women-4.jpg","images/products/tankini-women-5.jpg","images/products/tankini-women-6.jpg"],
    rating:4.6, reviews:178, badge:"new",
    sizes:["XS","S","M","L","XL"], colors:["#2E86C1","#1A1A1A","#27AE60"],
    description:"Athletic tankini with built-in shelf bra and swim shorts. Ideal for active water sports and lap swimming.",
    specs:{Material:"82% Polyester / 18% Elastane",Feature:"Built-in bra + shorts",Care:"Rinse after use, hand wash",UV:"UPF 50+",Chlorine:"Resistant",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:false },

  /* MEN SWIMWEAR */
  { id:32, name:"Elite Swim Trunks – Men", category:"mens-swim", group:"hosiery", gender:"men",
    priceUSD:35, origUSD:45,
    image:"images/products/swim-trunks-men-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1742151587835-94164e732b9d?w=600&q=85&auto=format&fit=crop",
    images:["images/products/swim-trunks-men-2.jpg","images/products/swim-trunks-men-3.jpg"],
    rating:4.7, reviews:289, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#2E86C1","#1A1A1A","#F39C12"],
    description:"Quick-dry swim trunks with inner mesh brief and side pockets. Classic boardshort length for beach or pool.",
    specs:{Material:"100% Polyester",Dry:"Quick-dry",Feature:"Mesh brief + side pockets",Care:"Machine wash cold",Length:"Board short",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  { id:33, name:"Pro Competition Jammers – Men", category:"mens-swim", group:"hosiery", gender:"men",
    priceUSD:38, origUSD:null,
    image:"images/products/jammers-men-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1571057258217-9124504d60ab?w=600&q=85&auto=format&fit=crop",
    images:["images/products/jammers-men-2.jpg","images/products/jammers-men-3.jpg"],
    rating:4.8, reviews:134, badge:"new",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#2E86C1","#C0392B"],
    description:"Competition-grade jammers with compression fit and hydrodynamic seams. FINA approved for competitive swimming.",
    specs:{Material:"78% Nylon / 22% Elastane",Feature:"Hydrodynamic seams",Care:"Rinse after use, hand wash",Approval:"FINA approved",UV:"UPF 50+",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:false },

  /* RASH GUARDS */
  
  /* LEATHER JACKETS */
  { id:35, name:"Classic Biker Jacket – Men", category:"leather-jackets", group:"leather", gender:"men",
    priceUSD:158, origUSD:199,
    image:"images/lj-biker-black-front.jpg",
    cdnImage:"https://images.unsplash.com/photo-1700993443944-c88c9360b9cf?w=600&q=85&auto=format&fit=crop",
    images:["images/lj-biker-black-flatlay.jpg","images/lj-biker-black-man.jpg"],
    rating:4.9, reviews:412, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#4A235A","#8B4513"],
    description:"Genuine full-grain leather biker jacket with asymmetric zip and quilted lining. A timeless wardrobe staple.",
    specs:{Material:"100% Full-Grain Leather",Lining:"Quilted polyester",Hardware:"YKK zippers",Care:"Professional leather clean",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:36, name:"Bomber Leather Jacket – Men", category:"leather-jackets", group:"leather", gender:"men",
    priceUSD:168, origUSD:null,
    image:"images/lj-bomber-brown-man.jpg",
    cdnImage:"https://images.unsplash.com/photo-1688685567150-f3f6bf7c17e1?w=600&q=85&auto=format&fit=crop",
    images:["images/lj-bomber-brown-mannequin.jpg","images/lj-bomber-brown-close.jpg"],
    rating:4.8, reviews:234, badge:"new",
    sizes:["S","M","L","XL","XXL"], colors:["#8B4513","#1A1A1A","#2C3E50"],
    description:"Classic leather bomber with rib-knit collar, cuffs and hem. Premium lambskin leather for buttery soft feel.",
    specs:{Material:"100% Lambskin Leather",Lining:"Satin",Hardware:"Brass zippers",Care:"Leather conditioner recommended",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:false, onSale:false },

  { id:37, name:"Moto Leather Jacket – Women", category:"leather-jackets", group:"leather", gender:"women",
    priceUSD:158, origUSD:199,
    image:"images/lj-women-moto-burgundy.jpg",
    cdnImage:"https://images.unsplash.com/photo-1726639348774-4945431498ac?w=600&q=85&auto=format&fit=crop",
    images:["images/lj-women-moto-black.jpg","images/lj-biker-black-man.jpg"],
    rating:4.9, reviews:345, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#4A235A","#8B0000"],
    description:"Edgy women's moto jacket with cropped silhouette, stud detailing and multiple zip pockets. Statement-making leather.",
    specs:{Material:"100% Top-Grain Leather",Lining:"Quilted satin",Hardware:"Gunmetal hardware",Care:"Professional leather clean",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  /* LEATHER COATS */
  
  /* LEATHER VESTS */
  { id:39, name:"Cafe Racer Jacket – Men", category:"leather-jackets", group:"leather", gender:"men",
    priceUSD:145, origUSD:188,
    image:"images/lj-cafe-racer-khaki.jpg",
    cdnImage:"https://images.unsplash.com/photo-1700993443944-c88c9360b9cf?w=600&q=85&auto=format&fit=crop",
    images:["images/lj-cafe-racer-khaki2.jpg","images/lj-cafe-racer-black-man.jpg"],
    rating:4.6, reviews:198, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#4A235A"],
    description:"Classic biker vest with snap-front closure and two front pockets. Perfect for layering over hoodies or shirts.",
    specs:{Material:"100% Full-Grain Leather",Closure:"Snap buttons",Pockets:"2 front + 2 side",Care:"Leather conditioner",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  /* LEATHER BAGS */
  { id:40, name:"Voyager Leather Duffle", category:"leather-bags", group:"leather", gender:"unisex",
    priceUSD:135, origUSD:172,
    image:"images/products/bag-messenger-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1525103504173-8dc1582c7430?w=600&q=85&auto=format&fit=crop",
    images:["https://images.unsplash.com/photo-1544511196-1646449a253b?w=700&q=85&auto=format&fit=crop","https://images.unsplash.com/photo-1515023677547-593d7638cbd6?w=700&q=85&auto=format&fit=crop"],
    rating:4.9, reviews:267, badge:"sale",
    sizes:["One Size"], colors:["#8B4513","#1A1A1A","#4A235A"],
    description:"Handcrafted full-grain leather duffle with brass fittings. Spacious main compartment with shoe pocket and adjustable strap.",
    specs:{Material:"Full-Grain Leather",Lining:"Canvas",Hardware:"Brass",Dimensions:"55x30x28cm",Care:"Leather conditioner",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:41, name:"Classic Messenger Bag", category:"leather-bags", group:"leather", gender:"unisex",
    priceUSD:98, origUSD:null,
    image:"images/products/bag-messenger-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1544511196-1646449a253b?w=600&q=85&auto=format&fit=crop",
    images:["images/products/bag-messenger-2.jpg","images/products/bag-messenger-3.jpg","images/products/bag-messenger-4.jpg","images/products/bag-messenger-5.jpg","images/products/bag-messenger-6.jpg"],
    rating:4.7, reviews:312, badge:"new",
    sizes:["One Size"], colors:["#8B4513","#1A1A1A"],
    description:"Vintage-inspired messenger bag with laptop sleeve and multiple organizer pockets. Fits 15-inch laptop.",
    specs:{Material:"Crazy Horse Leather",Lining:"Canvas",Hardware:"Antique brass",Laptop:"Fits 15 inch",Care:"Leather conditioner",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:false },

  { id:42, name:"Mini Crossbody Bag – Women", category:"leather-bags", group:"leather", gender:"women",
    priceUSD:78, origUSD:98,
    image:"images/products/bag-crossbody-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1569484221992-2a453658fff3?w=600&q=85&auto=format&fit=crop",
    images:["images/products/bag-crossbody-women-2.jpg","images/products/bag-crossbody-women-3.jpg","images/products/bag-crossbody-women-4.jpg","images/products/bag-crossbody-women-5.jpg"],
    rating:4.8, reviews:445, badge:"sale",
    sizes:["One Size"], colors:["#C0392B","#1A1A1A","#8B4513","#D4AC0D"],
    description:"Compact crossbody bag with adjustable chain strap and magnetic clasp. Multiple card slots and inner zip pocket.",
    specs:{Material:"Genuine Leather",Lining:"Suede",Hardware:"Gold-tone",Dimensions:"20x15x8cm",Care:"Leather conditioner",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  /* LEATHER BELTS */
  { id:43, name:"Premium Leather Belt – Unisex", category:"leather-belts", group:"leather", gender:"unisex",
    priceUSD:48, origUSD:62,
    image:"images/belt-black-pair.jpg",
    cdnImage:"https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=85&auto=format&fit=crop",
    images:["images/belt-brown-stitched.jpg","https://images.unsplash.com/photo-1677326764757-62ad261030bf?w=700&q=85&auto=format&fit=crop"],
    rating:4.7, reviews:389, badge:"sale",
    sizes:["S (28-32)","M (33-36)","L (37-40)","XL (41-44)"], colors:["#1A1A1A","#8B4513","#D4AC0D"],
    description:"Full-grain leather belt with solid brass buckle. 35mm width, ideal for dress and casual wear.",
    specs:{Material:"Full-Grain Leather",Width:"35mm",Buckle:"Solid brass",Care:"Leather conditioner",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:true, onSale:true },

  /* LEATHER WALLETS */
  { id:44, name:"Bifold Leather Wallet – Men", category:"leather-wallets", group:"leather", gender:"men",
    priceUSD:42, origUSD:55,
    image:"images/wallet-black-bifold.jpg",
    cdnImage:"https://images.unsplash.com/photo-1624811532681-e58a7e25f273?w=600&q=85&auto=format&fit=crop",
    images:["images/wallet-croc-burgundy.jpg","images/wallet-croc-brown-open.jpg"],
    rating:4.8, reviews:623, badge:"sale",
    sizes:["One Size"], colors:["#1A1A1A","#8B4513","#4A235A"],
    description:"Slim bifold wallet with 8 card slots, 2 bill compartments and RFID blocking technology. Handstitched for durability.",
    specs:{Material:"Full-Grain Leather",Cards:"8 slots",Feature:"RFID blocking",Closure:"Bifold",Care:"Leather conditioner",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:true, bestseller:true, onSale:true },

  { id:45, name:"Croc-Embossed Wallet – Women", category:"leather-wallets", group:"leather", gender:"women",
    priceUSD:45, origUSD:null,
    image:"images/wallet-croc-blue-long.jpg",
    cdnImage:"https://images.unsplash.com/photo-1677326764757-62ad261030bf?w=600&q=85&auto=format&fit=crop",
    images:["images/wallet-croc-teal.jpg","images/wallet-croc-blue-open.jpg"],
    rating:4.7, reviews:334, badge:"new",
    sizes:["One Size"], colors:["#C0392B","#1A1A1A","#D4AC0D","#8B4513"],
    description:"Elegant zip-around wallet with 12 card slots, coin pouch and 2 note compartments. Luxury leather feel.",
    specs:{Material:"Genuine Leather",Cards:"12 slots",Feature:"Coin pouch + zip closure",Closure:"Zip-around",Care:"Leather conditioner",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Packaging"},
    featured:false, bestseller:false, onSale:false },
  /* LEATHER VESTS */
  { id:49, name:"Classic Biker Vest – Men", category:"leather-vests", group:"leather", gender:"men",
    priceUSD:108, origUSD:138,
    image:"images/products/vest-leather-men-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=85&auto=format&fit=crop",
    images:["images/products/vest-leather-men-2.jpg","images/products/vest-leather-men-3.jpg","images/products/vest-leather-men-4.jpg","images/products/vest-leather-men-5.jpg"],
    rating:4.8, reviews:167, badge:"sale",
    sizes:["S","M","L","XL","XXL"], colors:["#1A1A1A","#8B4513","#4A235A"],
    description:"Genuine full-grain leather biker vest with snap-front closure, two chest pockets and two side pockets. A wardrobe staple for motorcycle enthusiasts and fashion-forward buyers alike. Fully customisable with your logo or label.",
    specs:{Material:"100% Full-Grain Leather",Closure:"Snap buttons",Pockets:"2 chest + 2 side",Lining:"Polyester",Care:"Leather conditioner",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Lining"},
    featured:true, bestseller:true, onSale:true },

  { id:50, name:"Fashion Leather Vest – Women", category:"leather-vests", group:"leather", gender:"women",
    priceUSD:98, origUSD:128,
    image:"images/products/vest-leather-women-1.jpg",
    cdnImage:"https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=85&auto=format&fit=crop",
    images:["images/products/vest-leather-women-2.jpg","images/products/vest-leather-women-3.jpg","images/products/vest-leather-women-4.jpg","images/products/vest-leather-women-5.jpg","images/products/vest-leather-women-6.jpg"],
    rating:4.7, reviews:134, badge:"sale",
    sizes:["XS","S","M","L","XL"], colors:["#1A1A1A","#8B0000","#8B4513"],
    description:"Cropped genuine leather vest with lapel collar and asymmetric zip detail. Effortlessly elevates any outfit from casual to edgy. Available in custom colours and sizes for wholesale buyers.",
    specs:{Material:"100% Top-Grain Leather",Closure:"Asymmetric zip",Fit:"Cropped",Lining:"Satin",Care:"Professional leather clean",Origin:"Pakistan",MOQ:"50 pcs per style","Lead Time":"20–25 working days",Customise:"Logo / Label / Colour / Fit"},
    featured:true, bestseller:false, onSale:true },
];

/* ── HELPERS ─────────────────────────────────────────────────────── */
function usd(p)     { return formatPrice(p.priceUSD); }
function usdOrig(p) { return p.origUSD ? formatPrice(p.origUSD) : null; }
function discount(p){ return p.origUSD ? Math.round((1 - p.priceUSD / p.origUSD) * 100) : 0; }

function stars(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '<span class="stars">' +
    '<i class="fas fa-star"></i>'.repeat(full) +
    (half ? '<i class="fas fa-star-half-alt"></i>' : '') +
    '<i class="far fa-star"></i>'.repeat(empty) +
    '<span class="rating-num">' + r.toFixed(1) + '</span></span>';
}

function waLink(p) {
  const msg = encodeURIComponent(
    'Hi KHU Enterprise! I would like to inquire about:\n*' + p.name + '*\nRetail price: ' + usd(p) + ' | Wholesale available\nPlease advise on availability, sizes, colours and shipping.'
  );
  return 'https://wa.me/' + WA_NUMBER + '?text=' + msg;
}

function sampleLink(p) {
  var msg = encodeURIComponent(
    'Hi KHU Enterprise! I would like to request a sample of:\n*' + p.name + '*\nPlease advise on sample cost, lead time and shipping.'
  );
  return 'https://wa.me/' + WA_NUMBER + '?text=' + msg;
}

function emailLink(p) {
  const subject = encodeURIComponent('Product Inquiry – ' + p.name);
  const body    = encodeURIComponent(
    'Hi KHU Enterprise,\n\nI am interested in the following product:\n\n'
    + 'Product: ' + p.name + '\n'
    + 'Price: ' + usd(p) + '\n\n'
    + 'Please provide information on:\n'
    + '- Available sizes and colours\n'
    + '- Wholesale pricing (if ordering in bulk)\n'
    + '- Shipping options to my country\n'
    + '- Lead time for custom orders\n\n'
    + 'Thank you!'
  );
  return 'mailto:' + KHU_EMAIL + '?subject=' + subject + '&body=' + body;
}

/* getFiltered defined below */

/* ── PRODUCT CARD ────────────────────────────────────────────────── */
function productCard(p, mini) {
  var inWish  = state.wishlist.indexOf(p.id) !== -1;
  var discPct = discount(p);
  var badge   = p.badge
    ? '<div class="prod-badges"><span class="badge-'+p.badge+'">'+(p.badge==='sale'?'-'+discPct+'%':p.badge.toUpperCase())+'</span></div>'
    : '';
  var sizes   = (!mini && p.sizes && p.sizes.length)
    ? '<div class="prod-sizes">'+p.sizes.slice(0,4).map(function(s){ return '<span class="size-chip">'+s+'</span>'; }).join('')+'</div>'
    : '';
  return '<div class="product-card" onclick="openProductDetail('+p.id+')">'
    +'<div class="product-img-wrap">'
      +'<img src="'+p.image+'" data-cdn="'+p.cdnImage+'" alt="'+p.name+'" loading="lazy" onerror="var c=this.getAttribute(\'data-cdn\');if(c&&!this.dataset.t){this.dataset.t=1;this.src=c;}else{this.onerror=null;this.src=\'https://placehold.co/600x800/f5f0eb/C9A84C?text=\'+encodeURIComponent(this.alt);}">'
      +badge
      +'<div class="prod-actions">'
        +'<button class="prod-action-btn'+(inWish?' wishlisted':'')+'" onclick="event.stopPropagation();toggleWishItem('+p.id+')" title="Wishlist">'
          +'<i class="fa'+(inWish?'s':'r')+' fa-heart"></i>'
        +'</button>'
        +'<button class="prod-action-btn" onclick="event.stopPropagation();openQV('+p.id+')" title="Quick View">'
          +'<i class="fas fa-eye"></i>'
        +'</button>'
      +'</div>'
    +'</div>'
    +'<div class="product-info">'
      +'<p class="prod-cat">'+p.category.replace(/-/g,' ')+'</p>'
      +'<h3 class="prod-name">'+p.name+'</h3>'
      +'<div class="prod-rating"><span class="prod-stars">'+stars(p.rating)+'</span><span>('+p.reviews+')</span></div>'
      +'<div class="prod-price">'
        +'<div class="price-row">'
          +'<span class="price-usd">'+usd(p)+'</span>'
          +(p.origUSD?'<span class="price-orig-usd">'+usdOrig(p)+'</span><span class="price-disc">-'+discPct+'%</span>':'')
        +'</div>'

      +'</div>'
      +sizes
      +'<div class="prod-btns">'
        +'<button class="btn-add-cart" onclick="event.stopPropagation();openProductDetail('+p.id+')">'
          +'<i class="fas fa-search"></i> Details'
        +'</button>'
        +'<a class="btn-wa-prod" href="'+waLink(p)+'" target="_blank" onclick="event.stopPropagation()" title="Send Inquiry via WhatsApp">'
          +'<i class="fab fa-whatsapp"></i>'
        +'</a>'
      +'</div>'
    +'</div>'
  +'</div>';
}

function renderFeaturedProducts() {
  const g = document.getElementById('featuredGrid');
  if (!g) return;
  g.innerHTML = products.filter(function(p){ return p.featured; }).slice(0, 8).map(function(p){ return productCard(p); }).join('');
}

function renderBestsellers() {
  const g = document.getElementById('bestsellersGrid');
  if (!g) return;
  g.innerHTML = products.filter(function(p){ return p.bestseller; }).slice(0, 8).map(function(p){ return productCard(p); }).join('');
}

function renderProductsPage() {
  const g = document.getElementById('productsGrid');
  if (!g) return;
  const list = getFiltered();
  const countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = list.length + ' product' + (list.length !== 1 ? 's' : '');
  g.innerHTML = list.length
    ? list.map(function(p){ return productCard(p); }).join('')
    : '<p style="grid-column:1/-1;text-align:center;color:#888;padding:60px 20px">No products found. <button onclick="clearAllFilters()" style="color:var(--gold);font-weight:600">Clear filters</button></p>';
}
/* ================================================================
   SECTION NAVIGATION
   HTML sections: id="homeSection", "productsSection", etc.
================================================================ */
/* -------------------------------------------------------
   SECTION NAVIGATION  — hash-based (works on file:// too)
   Writing location.hash creates a real browser history entry,
   so the back/forward buttons work without pushState.
------------------------------------------------------- */
var _currentSection = 'home';

function showSection(name) {
  var id = name + 'Section';
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.toggle('active', s.id === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileNav();
  if (name === 'products')  renderProductsPage();
  if (name === 'sale')      renderSalePage();
  if (name === 'checkout')  buildCheckoutSummary();

  /* Update URL hash — this creates a history entry automatically */
  _currentSection = name;
  try {
    if (window.location.hash !== '#' + name) {
      window.location.hash = name;
    }
  } catch(e) { /* silent fail if file:// restricts hash */ }
}

// called from nav links: filterProducts('summer-tracksuits')
// also filterProducts('hosiery','','') for group-level
function filterProducts(categoryOrGroup, subcat, gender) {
  // If it's a known group keyword, set group filter
  var groups = ['hosiery', 'leather'];
  var cat = categoryOrGroup || '';
  if (groups.indexOf(cat) !== -1) {
    state.filterGroup    = cat;
    state.filterCategory = subcat || '';
  } else {
    state.filterGroup    = 'all';
    state.filterCategory = cat;
  }
  state.filterGender = gender || '';
  showSection('products');
}

/* ================================================================
   SALE PAGE
================================================================ */
function renderSalePage() {
  var g = document.getElementById('saleGrid');
  if (!g) return;
  g.innerHTML = products.filter(function(p){ return p.onSale; })
               .map(function(p){ return productCard(p); }).join('');
}

/* ================================================================
   FILTERS  (HTML uses checkboxes + radio + range slider)
================================================================ */
function applyFilters() {
  // Read checked category checkboxes
  var checked = [];
  document.querySelectorAll('.filters-sidebar input[type=checkbox]:checked').forEach(function(cb){
    if (cb.value !== 'all') checked.push(cb.value);
  });
  if (checked.length === 0) {
    state.filterGroup    = 'all';
    state.filterCategory = '';
  } else if (checked.length === 1) {
    var v = checked[0];
    if (v === 'hosiery' || v === 'leather') {
      state.filterGroup    = v;
      state.filterCategory = '';
    } else {
      state.filterGroup    = 'all';
      state.filterCategory = v;
    }
  } else {
    state.filterGroup    = 'all';
    state.filterCategory = '';
  }

  // Gender radio
  var genderRadio = document.querySelector('.filters-sidebar input[name=gender]:checked');
  state.filterGender = genderRadio ? genderRadio.value : 'all';

  // Sort
  var sortEl = document.getElementById('sortSelect');
  if (sortEl) {
    var sortMap = { 'price-low':'price-asc', 'price-high':'price-desc', 'name-az':'name', 'rating':'rating', 'newest':'newest' };
    state.sortBy = sortMap[sortEl.value] || 'default';
  }

  renderProductsPage();
}

function clearAllFilters() {
  state.filterGroup    = 'all';
  state.filterCategory = '';
  state.filterGender   = '';
  state.filterMinPrice = 0;
  state.filterMaxPrice = 500;
  state.sortBy         = 'default';
  state.search         = '';

  var inp = document.getElementById('searchInput');
  if (inp) inp.value = '';

  // Reset checkboxes
  document.querySelectorAll('.filters-sidebar input[type=checkbox]').forEach(function(cb){
    cb.checked = (cb.value === 'all');
  });
  // Reset gender radio
  var allGender = document.querySelector('input[name=gender][value="all"]');
  if (allGender) allGender.checked = true;

  // Reset price range
  var range = document.getElementById('priceRange');
  if (range) { range.value = 200; updatePriceFilter(200); }

  // Reset sort
  var sortEl = document.getElementById('sortSelect');
  if (sortEl) sortEl.value = 'default';

  renderProductsPage();
}

function updatePriceFilter(val) {
  state.filterMaxPrice = parseFloat(val) || 200;
  var label = document.getElementById('priceMax');
  if (label) label.textContent = '$' + Math.round(state.filterMaxPrice);
  renderProductsPage();
}

// Override getFiltered to use correct sort keys
function getFiltered() {
  var list = products.slice();

  if (state.filterGroup && state.filterGroup !== 'all') {
    list = list.filter(function(p){ return p.group === state.filterGroup; });
  }
  if (state.filterCategory) {
    list = list.filter(function(p){ return p.category === state.filterCategory; });
  }
  if (state.filterGender && state.filterGender !== 'all') {
    list = list.filter(function(p){ return p.gender === state.filterGender || p.gender === 'unisex'; });
  }
  if (state.filterMaxPrice < 500) {
    list = list.filter(function(p){ return p.priceUSD <= state.filterMaxPrice; });
  }
  if (state.search) {
    var q = state.search;
    list = list.filter(function(p){
      return p.name.toLowerCase().indexOf(q) !== -1 ||
             p.category.indexOf(q) !== -1 ||
             p.description.toLowerCase().indexOf(q) !== -1;
    });
  }

  switch (state.sortBy) {
    case 'price-asc':  list.sort(function(a,b){ return a.priceUSD - b.priceUSD; }); break;
    case 'price-desc': list.sort(function(a,b){ return b.priceUSD - a.priceUSD; }); break;
    case 'rating':     list.sort(function(a,b){ return b.rating - a.rating; }); break;
    case 'name':       list.sort(function(a,b){ return a.name.localeCompare(b.name); }); break;
    case 'newest':     list.sort(function(a,b){ return b.id - a.id; }); break;
  }
  return list;
}

function setView(mode) {
  var g = document.getElementById('productsGrid');
  if (g) g.classList.toggle('list-view', mode === 'list');
  document.getElementById('gridViewBtn') && document.getElementById('gridViewBtn').classList.toggle('active', mode === 'grid');
  document.getElementById('listViewBtn') && document.getElementById('listViewBtn').classList.toggle('active', mode === 'list');
}

function toggleFiltersSidebar() {
  var s = document.getElementById('filtersSidebar');
  if (s) s.classList.toggle('open');
}


/* ================================================================
   PRODUCT DETAIL — correct CSS classes from style.css
   .gal-main / .gal-thumbs / .gal-thumb / .spec-table / .size-btn.selected
================================================================ */
function openProductDetail(id) {
  var p = products.find(function(x){ return x.id===id; });
  if (!p) return;
  state.detailProduct = p;
  state.detailSize    = '';
  state.detailColor   = '';
  state.detailQty     = 1;

  var wrap = document.getElementById('productDetailContent');
  if (!wrap) return;

  var imgs   = (p.images && p.images.length) ? p.images : [p.image, p.image];
  var thumbs = imgs.map(function(img,i){
    return '<div class="gal-thumb'+(i===0?' active':'')+'" onclick="switchGalImg('+i+')">'
      +'<img src="'+img+'" alt="view '+(i+1)+'" loading="lazy" onerror="this.onerror=null;this.src=\'https://placehold.co/120x120/f5f0eb/C9A84C?text=view\'">'
    +'</div>';
  }).join('');

  var sizesBtns = (p.sizes||[]).map(function(s){
    return '<button class="size-btn" data-size="'+s+'" onclick="selSize(this.dataset.size)">'+s+'</button>';
  }).join('');

  var colorDots = (p.colors||[]).map(function(c){
    return '<span class="color-dot" style="background:'+c+';width:22px;height:22px;border-radius:50%;display:inline-block;cursor:pointer;border:2px solid transparent;margin-right:6px;transition:border .2s" '
      +'data-color="'+c+'" onclick="selColor(this.dataset.color)"></span>';
  }).join('');

  var inWish  = state.wishlist.indexOf(p.id) !== -1;
  var discPct = discount(p);
  var origRow = p.origUSD
    ? '<span class="pd-price-orig">'+usdOrig(p)+'</span><span class="pd-price-disc">−'+discPct+'% OFF</span>'
    : '';

  wrap.innerHTML =
    '<button class="btn-outline" id="pdBackBtn" onclick="showSection(\'products\')" style="margin-bottom:24px"><i class="fas fa-arrow-left"></i> Back to Products</button>'+
    '<div class="pd-grid">' +
      '<div class="pd-gallery">' +
        '<div class="gal-main" id="galMain">' +
          '<img id="pdMainImg" src="'+imgs[0]+'" alt="'+p.name+'" onerror="this.onerror=null;this.src=\'https://placehold.co/600x800/f5f0eb/C9A84C?text='+encodeURIComponent(p.name.substring(0,15))+'\'">' +
        '</div>' +
        '<div class="gal-thumbs" id="galThumbs">'+thumbs+'</div>' +
      '</div>' +
      '<div class="pd-info">' +
        '<p class="pd-cat">'+p.category.replace(/-/g,' ').toUpperCase()+'</p>' +
        '<h1 class="pd-name">'+p.name+'</h1>' +
        '<div class="pd-rating">'+stars(p.rating)+'<span class="pd-rev-count" style="color:#888;font-size:.85rem">('+p.reviews+' reviews)</span></div>' +
        '<div class="pd-price" style="margin-bottom:22px">' +
          '<div class="price-row">' +
            '<span class="pd-price-usd">'+usd(p)+'</span>' +
            origRow +
          '</div>' +

        '</div>' +
        '<div class="pd-size-sel">' +
          '<h4>Size <a href="#" onclick="return false" style="font-size:.75rem">Size Guide</a></h4>' +
          '<div id="pdSizes" style="display:flex;flex-wrap:wrap;gap:8px">'+sizesBtns+'</div>' +
        '</div>' +
        '<div class="pd-color-sel">' +
          '<h4>Colour</h4>' +
          '<div id="pdColors">'+colorDots+'</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:22px">' +
          '<span style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:1px">Qty</span>' +
          '<div style="display:flex;align-items:center;border:1.5px solid var(--border);border-radius:8px;overflow:hidden">' +
            '<button onclick="chDetailQty(-1)" style="width:36px;height:36px;font-size:1.1rem;background:none;border:none;cursor:pointer">−</button>' +
            '<span id="detailQtyDisplay" style="min-width:32px;text-align:center;font-weight:700">1</span>' +
            '<button onclick="chDetailQty(1)"  style="width:36px;height:36px;font-size:1.1rem;background:none;border:none;cursor:pointer">+</button>' +
          '</div>' +
        '</div>' +
        '<div style="background:linear-gradient(135deg,#f8f4ee,#fff8f0);border:1px solid #e8d5b0;border-radius:12px;padding:16px;margin-bottom:22px">' +
          '<p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9a7a3a;margin-bottom:10px"><i class="fas fa-tag"></i> Wholesale Available — Min. 50 pcs per style</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
            '<a class="btn-whatsapp" href="'+waLink(p)+'" target="_blank" rel="noopener" style="flex:1;min-width:150px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:7px"><i class="fab fa-whatsapp"></i> WhatsApp Inquiry</a>' +
            '<a class="btn-outline" href="'+emailLink(p)+'" style="flex:1;min-width:150px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:12px 18px;border:2px solid var(--dark);border-radius:8px;font-weight:700;font-size:.88rem"><i class="fas fa-envelope"></i> Email Inquiry</a>' +
          '</div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
            '<a class="btn-whatsapp" href="'+sampleLink(p)+'" target="_blank" rel="noopener" style="flex:1;min-width:150px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:7px;background:#2d8653"><i class="fab fa-whatsapp"></i> Request a Sample</a>' +
          '</div>' +
          '<p style="font-size:.72rem;color:#888;margin:0"><i class="fas fa-info-circle"></i> Single custom piece available — premium pricing applies. Inquire via WhatsApp.</p>' +
        '</div>' +
        '<button class="pd-wish-toggle" id="pdWishBtn" onclick="toggleWishItem('+p.id+')" style="background:none;border:1.5px solid var(--border);border-radius:8px;padding:9px 18px;cursor:pointer;font-size:.85rem;font-weight:600;display:flex;align-items:center;gap:7px;margin-bottom:28px">' +
          '<i class="fa'+(inWish?'s':'r')+' fa-heart" style="color:'+(inWish?'var(--red)':'inherit')+'"></i> '+(inWish?'Saved':'Save to Wishlist') +
        '</button>' +
        '<div style="border-bottom:1.5px solid var(--border);margin-bottom:16px;display:flex;gap:0">' +
          '<button class="tab-btn active" data-tab="desc" onclick="switchTab(this.dataset.tab)" style="padding:10px 20px;font-weight:600;font-size:.85rem;border:none;background:none;cursor:pointer;border-bottom:2.5px solid var(--gold)">Description</button>' +
          '<button class="tab-btn" data-tab="specs" onclick="switchTab(this.dataset.tab)" style="padding:10px 20px;font-weight:600;font-size:.85rem;border:none;background:none;cursor:pointer;border-bottom:2.5px solid transparent">Specs</button>' +
          '<button class="tab-btn" data-tab="shipping" onclick="switchTab(this.dataset.tab)" style="padding:10px 20px;font-weight:600;font-size:.85rem;border:none;background:none;cursor:pointer;border-bottom:2.5px solid transparent">Shipping</button>' +
        '</div>' +
        '<div class="pd-tab-content" id="pdTabContent"><p class="pd-desc">'+p.description+'</p></div>' +
      '</div>' +
    '</div>';

  showSection('productDetail');
}

function switchGalImg(idx) {
  var p    = state.detailProduct; if (!p) return;
  var imgs = (p.images && p.images.length) ? p.images : [p.image, p.image];
  var main = document.getElementById('pdMainImg');
  if (main) main.src = imgs[idx];
  document.querySelectorAll('#galThumbs .gal-thumb').forEach(function(t,i){ t.classList.toggle('active',i===idx); });
}

function selSize(s) {
  state.detailSize = s;
  document.querySelectorAll('#pdSizes .size-btn').forEach(function(b){
    b.classList.toggle('selected', b.dataset.size===s);
  });
}

function selColor(c) {
  state.detailColor = c;
  document.querySelectorAll('#pdColors .color-dot').forEach(function(dot){
    dot.style.border = dot.dataset.color===c ? '2px solid var(--dark)' : '2px solid transparent';
  });
}

function chDetailQty(d) {
  state.detailQty = Math.max(1, (state.detailQty||1)+d);
  var el = document.getElementById('detailQtyDisplay');
  if (el) el.textContent = state.detailQty;
}

function switchTab(tab) {
  var p = state.detailProduct; if (!p) return;
  document.querySelectorAll('.tab-btn').forEach(function(b){
    var active = b.dataset.tab===tab;
    b.classList.toggle('active', active);
    b.style.borderBottomColor = active ? 'var(--gold)' : 'transparent';
  });
  var c = document.getElementById('pdTabContent'); if (!c) return;
  if (tab==='desc') {
    c.innerHTML = '<p class="pd-desc">'+p.description+'</p>';
  } else if (tab==='specs') {
    var rows = Object.entries(p.specs||{}).map(function(e){
      return '<tr><td>'+e[0]+'</td><td>'+e[1]+'</td></tr>';
    }).join('');
    c.innerHTML = '<table class="spec-table"><tbody>'+rows+'</tbody></table>';
  } else {
    c.innerHTML = '<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:12px">'
      +'<li><i class="fas fa-globe-europe" style="color:var(--gold);width:20px"></i> <strong>Europe / UK:</strong> 8–12 business days via DHL / FedEx</li>'
      +'<li><i class="fas fa-globe-americas" style="color:var(--gold);width:20px"></i> <strong>USA / Canada:</strong> 10–14 business days via FedEx / UPS</li>'
      +'<li><i class="fas fa-bolt" style="color:var(--gold);width:20px"></i> <strong>Express Worldwide:</strong> 4–6 business days — surcharge applies</li>'
      +'<li><i class="fas fa-shipping-fast" style="color:var(--gold);width:20px"></i> <strong>Free Shipping:</strong> On orders over $150 USD</li>'
      +'<li><i class="fas fa-clock" style="color:var(--gold);width:20px"></i> <strong>Custom / Wholesale:</strong> 20–25 working days production + shipping</li>'
      +'<li><i class="fas fa-undo" style="color:var(--gold);width:20px"></i> <strong>Returns:</strong> Contact us within 14 days of receipt via WhatsApp or email</li>'
      +'<li style="background:#f8f4ee;padding:10px;border-radius:8px;margin-top:4px"><i class="fas fa-info-circle" style="color:var(--gold);width:20px"></i> We ship from Pakistan — all orders placed via WhatsApp or email inquiry. No physical store in EU/UK/USA.</li>'
      +'</ul>';
  }
}

function addDetailToCart() {
  var p = state.detailProduct; if (!p) return;
  if (!state.detailSize && p.sizes.length) { showToast('Please select a size','warning'); return; }
  addToCart(p.id, state.detailSize, state.detailColor, state.detailQty);
  showToast(p.name+' added to bag!','success');
  toggleCart(true);
}

/* ================================================================
   QUICK VIEW
   HTML: id="quickViewOverlay" (overlay), id="quickViewModal" (modal),
         id="quickViewContent" (body), close via closeQuickView()
================================================================ */
function openQV(id) {
  var p = products.find(function(x){ return x.id===id; });
  if (!p) return;
  state.qvProduct = p; state.qvSize = '';

  var content = document.getElementById('quickViewContent');
  if (!content) return;

  var badge = p.badge ? '<span class="prod-badge badge-'+p.badge+'">'+(p.badge==='sale'?'-'+discount(p)+'%':p.badge)+'</span>' : '';
  var sizes = (p.sizes||[]).map(function(s){
    return '<button class="size-btn" data-size="'+s+'" onclick="'
      +'this.parentElement.querySelectorAll(\'.size-btn\').forEach(function(b){b.classList.remove(\'active\')});'
      +'this.classList.add(\'active\');state.qvSize=\''+s+'\'">'+s+'</button>';
  }).join('');

  content.innerHTML =
    '<div class="qv-grid">' +
      '<div class="qv-img" style="position:relative">' +
        '<img src="'+p.image+'" alt="'+p.name+'" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src=\'https://placehold.co/500x600/f5f0eb/C9A84C?text='+encodeURIComponent(p.name.substring(0,15))+'\'">'+badge+
      '</div>' +
      '<div style="padding:8px 0">' +
        '<p style="font-size:.8rem;color:var(--gold);font-weight:600;letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px">'+p.category.replace(/-/g,' ')+'</p>' +
        '<h2 style="font-family:var(--serif);font-size:1.5rem;font-weight:700;margin-bottom:8px">'+p.name+'</h2>' +
        '<div style="margin-bottom:12px">'+stars(p.rating)+'<span style="color:#888;font-size:.85rem;margin-left:6px">('+p.reviews+' reviews)</span></div>' +
        '<div style="display:flex;gap:10px;align-items:center;margin-bottom:16px">' +
          '<span style="font-size:1.5rem;font-weight:800;color:var(--gold)">'+usd(p)+'</span>' +

          (p.origUSD?'<span style="text-decoration:line-through;color:#bbb;font-size:.9rem">'+usdOrig(p)+'</span>':'') +
        '</div>' +
        '<p style="color:#666;font-size:.9rem;line-height:1.6;margin-bottom:16px">'+p.description.substring(0,140)+'…</p>' +
        '<p style="font-size:.85rem;font-weight:600;margin-bottom:8px">Select Size:</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px">'+sizes+'</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button class="btn-primary" onclick="qvAddToCart()" style="flex:1;min-width:130px"><i class="fas fa-shopping-bag"></i> Add to Bag</button>' +
          '<a class="btn-whatsapp" href="'+waLink(p)+'" target="_blank" style="flex:1;min-width:130px;text-align:center;text-decoration:none"><i class="fab fa-whatsapp"></i> WhatsApp</a>' +
        '</div>' +
        '<button onclick="closeQuickView();openProductDetail('+p.id+')" style="margin-top:10px;background:none;border:none;color:var(--gold);cursor:pointer;font-size:.85rem;font-weight:600;text-decoration:underline">View Full Details →</button>' +
      '</div>' +
    '</div>';

  var overlay = document.getElementById('quickViewOverlay');
  var modal   = document.getElementById('quickViewModal');
  if (overlay) overlay.classList.add('active');
  if (modal)   modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function qvAddToCart() {
  var p = state.qvProduct; if (!p) return;
  if (!state.qvSize && p.sizes.length) { showToast('Please select a size','warning'); return; }
  addToCart(p.id, state.qvSize, '', 1);
  showToast(p.name+' added to bag!','success');
  closeQuickView(); toggleCart(true);
}

// HTML calls closeQuickView() via onclick
function closeQuickView() {
  var overlay = document.getElementById('quickViewOverlay');
  var modal   = document.getElementById('quickViewModal');
  if (overlay) overlay.classList.remove('active');
  if (modal)   modal.classList.remove('active');
  document.body.style.overflow = '';
}
// Alias so internal calls work too
var closeQV = closeQuickView;

/* ================================================================
   CART
   HTML IDs: cartSidebar, cartOverlay, cartItems (body), cartFooter,
             cartBadge (badge), cartSubtotalUSD, cartSubtotalPKR, cartWhatsApp
================================================================ */
function addToCart(id, size, color, qty) {
  qty = qty || 1;
  var ex = state.cart.find(function(i){ return i.id===id&&i.size===size&&i.color===color; });
  if (ex) { ex.qty += qty; } else { state.cart.push({id:id,size:size,color:color,qty:qty}); }
  saveCart(); updateCartBadge(); renderCartSidebar();
}

function quickAdd(id) {
  var p = products.find(function(x){ return x.id===id; }); if (!p) return;
  addToCart(id, p.sizes.length ? p.sizes[0] : '', '', 1);
  showToast(p.name+' added to bag!','success');
  toggleCart(true);
}

function rmFromCart(id, size, color) {
  state.cart = state.cart.filter(function(i){ return !(i.id===id&&i.size===size&&i.color===color); });
  saveCart(); updateCartBadge(); renderCartSidebar();
}

function chCartQty(id, size, color, delta) {
  var item = state.cart.find(function(i){ return i.id===id&&i.size===size&&i.color===color; });
  if (!item) return;
  item.qty = Math.max(1, item.qty+delta);
  saveCart(); updateCartBadge(); renderCartSidebar();
}

function saveCart() {
  try { localStorage.setItem('khu_cart2', JSON.stringify(state.cart)); } catch(e){}
}
function saveWishlist() {
  try { localStorage.setItem('khu_wishlist2', JSON.stringify(state.wishlist)); } catch(e){}
}

function updateCartBadge() {
  var total = state.cart.reduce(function(s,i){ return s+i.qty; }, 0);
  var b = document.getElementById('cartBadge');
  if (b) { b.textContent = total; b.style.display = total ? 'flex' : 'none'; }
}

function renderCartSidebar() {
  var body   = document.getElementById('cartItems');
  var footer = document.getElementById('cartFooter');
  if (!body) return;

  if (!state.cart.length) {
    body.innerHTML =
      '<div class="cart-empty" style="text-align:center;padding:40px 20px">' +
        '<i class="fas fa-shopping-bag" style="font-size:3rem;color:#ddd;display:block;margin-bottom:12px"></i>' +
        '<p style="color:#888;margin-bottom:16px">Your bag is empty</p>' +
        '<button class="btn-primary" onclick="toggleCart(false);showSection(\'products\')">Shop Now</button>' +
      '</div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = state.cart.map(function(item) {
    var p = products.find(function(x){ return x.id===item.id; }); if (!p) return '';
    return '<div class="cart-item" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f0f0f0">' +
      '<img src="'+p.image+'" style="width:70px;height:70px;object-fit:cover;border-radius:8px" loading="lazy">' +
      '<div style="flex:1;min-width:0">' +
        '<p style="font-weight:600;font-size:.9rem;margin-bottom:4px">'+p.name+'</p>' +
        (item.size?'<p style="font-size:.8rem;color:#888">Size: '+item.size+'</p>':'') +
        '<div style="display:flex;gap:6px;margin:4px 0">' +
          '<span style="color:var(--gold);font-weight:700">'+usd(p)+'</span>' +

        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:6px">' +
          '<button onclick="chCartQty('+p.id+',\''+item.size+'\',\''+item.color+'\',-1)" style="width:24px;height:24px;border:1px solid #ddd;border-radius:4px;background:#fff;cursor:pointer;font-size:14px">−</button>' +
          '<span style="font-weight:600;min-width:20px;text-align:center">'+item.qty+'</span>' +
          '<button onclick="chCartQty('+p.id+',\''+item.size+'\',\''+item.color+'\',1)" style="width:24px;height:24px;border:1px solid #ddd;border-radius:4px;background:#fff;cursor:pointer;font-size:14px">+</button>' +
          '<button onclick="rmFromCart('+p.id+',\''+item.size+'\',\''+item.color+'\')" style="margin-left:auto;background:none;border:none;color:#e74c3c;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  var totalUSD = state.cart.reduce(function(s,item){
    var p = products.find(function(x){return x.id===item.id;}); return s+(p?p.priceUSD*item.qty:0);
  },0);
  var totalPKR = Math.round(totalUSD * PKR_RATE);

  if (footer) {
    footer.style.display = 'block';
    var usdEl = document.getElementById('cartSubtotalUSD');
    var pkrEl = document.getElementById('cartSubtotalPKR');
    var waEl  = document.getElementById('cartWhatsApp');
    if (usdEl) usdEl.textContent = '$'+totalUSD.toFixed(2);
    if (pkrEl) pkrEl.textContent = 'PKR '+totalPKR.toLocaleString();
    if (waEl) {
      var cartMsg = 'Hi KHU Enterprise! My cart:\n' +
        state.cart.map(function(item){
          var p=products.find(function(x){return x.id===item.id;});
          return p ? '- '+p.name+' x'+item.qty+' ('+usd(p)+')' : '';
        }).filter(Boolean).join('\n') +
        '\nTotal: $'+totalUSD.toFixed(2)+' / PKR '+totalPKR.toLocaleString();
      waEl.href = 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(cartMsg);
    }
  }
}

function toggleCart(open) {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;
  var isOpen = (open !== undefined) ? open : !sidebar.classList.contains('open');
  sidebar.classList.toggle('active', isOpen);
  if (overlay) overlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) renderCartSidebar();
}

/* ================================================================
   WISHLIST
   HTML IDs: wishlistSidebar, wishlistOverlay, wishlistItems, wishlistBadge
================================================================ */
function toggleWishItem(id) {
  var idx = state.wishlist.indexOf(id);
  if (idx === -1) { state.wishlist.push(id); showToast('Added to wishlist!','success'); }
  else            { state.wishlist.splice(idx,1); showToast('Removed from wishlist','info'); }
  saveWishlist(); updateWishlistBadge(); renderWishlistSidebar();
  // update heart on open detail page
  var btn = document.getElementById('pdWishBtn');
  if (btn && state.detailProduct && state.detailProduct.id===id) {
    var inW = state.wishlist.indexOf(id) !== -1;
    btn.className = 'pd-wish-btn'+(inW?' active':'');
    btn.innerHTML = '<i class="fa'+(inW?'s':'r')+' fa-heart"></i>';
  }
}

function updateWishlistBadge() {
  var count = state.wishlist.length;
  var b = document.getElementById('wishlistBadge');
  if (b) { b.textContent = count; b.style.display = count ? 'flex' : 'none'; }
  var c = document.getElementById('wishlistCount');
  if (c) c.textContent = count ? '('+count+')' : '';
}

function renderWishlistSidebar() {
  var body = document.getElementById('wishlistItems'); if (!body) return;
  if (!state.wishlist.length) {
    body.innerHTML =
      '<div style="text-align:center;padding:40px 20px">' +
        '<i class="far fa-heart" style="font-size:3rem;color:#ddd;display:block;margin-bottom:12px"></i>' +
        '<p style="color:#888;margin-bottom:16px">Your wishlist is empty</p>' +
        '<button class="btn-primary" onclick="toggleWishlist(false);showSection(\'products\')">Browse Products</button>' +
      '</div>';
    return;
  }
  body.innerHTML = state.wishlist.map(function(id) {
    var p = products.find(function(x){return x.id===id;}); if (!p) return '';
    return '<div class="cart-item" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f0f0f0">' +
      '<img src="'+p.image+'" style="width:70px;height:70px;object-fit:cover;border-radius:8px" loading="lazy">' +
      '<div style="flex:1;min-width:0">' +
        '<p style="font-weight:600;font-size:.9rem;margin-bottom:4px">'+p.name+'</p>' +
        '<div style="display:flex;gap:6px;margin:4px 0">' +
          '<span style="color:var(--gold);font-weight:700">'+usd(p)+'</span>' +

        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:8px">' +
          '<button class="btn-primary" style="padding:6px 12px;font-size:.8rem" onclick="quickAdd('+p.id+')"><i class="fas fa-shopping-bag"></i> Add</button>' +
          '<button style="padding:6px 10px;background:none;border:1px solid #ddd;border-radius:6px;cursor:pointer;color:#e74c3c;font-size:.8rem" onclick="toggleWishItem('+p.id+')"><i class="fas fa-trash"></i></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function toggleWishlist(open) {
  var sidebar = document.getElementById('wishlistSidebar');
  var overlay = document.getElementById('wishlistOverlay');
  if (!sidebar) return;
  var isOpen = (open !== undefined) ? open : !sidebar.classList.contains('open');
  sidebar.classList.toggle('active', isOpen);
  if (overlay) overlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) renderWishlistSidebar();
}

/* ================================================================
   CHECKOUT
   HTML IDs: checkoutSection, co_fname, co_lname, co_phone, co_address,
             co_city, co_country, checkoutItems, summarySubtotal,
             summaryShipping, summaryTotal, orderSuccessSection
================================================================ */
function buildCheckoutSummary() {
  if (!state.cart.length) { showSection('products'); showToast('Your bag is empty!','warning'); return; }

  var itemsEl   = document.getElementById('checkoutItems');
  var subTotEl  = document.getElementById('summarySubtotal');
  var shipEl    = document.getElementById('summaryShipping');
  var totalEl   = document.getElementById('summaryTotal');

  var totalUSD = state.cart.reduce(function(s,item){
    var p=products.find(function(x){return x.id===item.id;}); return s+(p?p.priceUSD*item.qty:0);
  },0);
  var ship  = totalUSD >= 50 ? 0 : 9.99;
  var grand = totalUSD + ship;

  if (itemsEl) {
    itemsEl.innerHTML = state.cart.map(function(item){
      var p=products.find(function(x){return x.id===item.id;}); if (!p) return '';
      return '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #f5f5f5;align-items:center">' +
        '<img src="'+p.image+'" style="width:50px;height:50px;object-fit:cover;border-radius:6px">' +
        '<div style="flex:1"><p style="font-size:.85rem;font-weight:600;margin-bottom:2px">'+p.name+'</p>' +
        (item.size?'<p style="font-size:.75rem;color:#888">'+item.size+' × '+item.qty+'</p>':'<p style="font-size:.75rem;color:#888">Qty: '+item.qty+'</p>') +
        '</div>' +
        '<span style="font-weight:700;color:var(--gold)">$'+(p.priceUSD*item.qty).toFixed(2)+'</span>' +
      '</div>';
    }).join('');
  }
  if (subTotEl) subTotEl.textContent = '$'+totalUSD.toFixed(2)+' / PKR '+Math.round(totalUSD*PKR_RATE).toLocaleString();
  if (shipEl)   shipEl.textContent   = ship===0 ? 'FREE' : '$'+ship.toFixed(2);
  if (totalEl)  totalEl.innerHTML    = '<strong>$'+grand.toFixed(2)+'</strong> <small style="color:#888">/ PKR '+Math.round(grand*PKR_RATE).toLocaleString()+'</small>';
}

function showCheckout() {
  showSection('checkout');
}

function placeOrder(e) {
  if (e) e.preventDefault();
  if (!state.cart.length) { showToast('Your bag is empty!','warning'); return; }

  var fname   = (document.getElementById('co_fname')  ||{}).value || '';
  var lname   = (document.getElementById('co_lname')  ||{}).value || '';
  var phone   = (document.getElementById('co_phone')  ||{}).value || '';
  var address = (document.getElementById('co_address')||{}).value || '';
  var city    = (document.getElementById('co_city')   ||{}).value || '';
  var country = (document.getElementById('co_country')||{}).value || '';

  var totalUSD = state.cart.reduce(function(s,item){
    var p=products.find(function(x){return x.id===item.id;}); return s+(p?p.priceUSD*item.qty:0);
  },0);
  var lines = state.cart.map(function(item){
    var p=products.find(function(x){return x.id===item.id;});
    return p ? '  • '+p.name+(item.size?' ('+item.size+')':'')+' ×'+item.qty+' — '+usd(p) : '';
  }).filter(Boolean).join('\n');

  var msg = 'Hi KHU Enterprise! 🛍️\n\n'
    +'*New Order*\n'
    +'Name: '+(fname+' '+lname).trim()+'\n'
    +'Phone: '+phone+'\n'
    +'Address: '+address+', '+city+', '+country+'\n\n'
    +'*Items:*\n'+lines+'\n\n'
    +'*Total: $'+totalUSD.toFixed(2)+' / PKR '+Math.round(totalUSD*PKR_RATE).toLocaleString()+'*\n\n'
    +'Please confirm and share payment details.';

  window.open('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(msg),'_blank');

  // Generate order number and show success
  var orderNum = 'KHU-'+Date.now().toString().slice(-6);
  var numEl = document.getElementById('orderNumber');
  if (numEl) numEl.textContent = orderNum;

  state.cart = [];
  saveCart();
  updateCartBadge();
  showSection('orderSuccess');
}

/* ================================================================
   HERO SLIDER
   HTML IDs: heroSlides (container), heroDots; classes: hero-slide, hero-dot
================================================================ */
var _heroTimer = null;

function changeSlide(dir) {
  var slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  state.heroSlide = (state.heroSlide + dir + slides.length) % slides.length;
  goToSlide(state.heroSlide);
}

function goToSlide(idx) {
  document.querySelectorAll('.hero-slide').forEach(function(s,i){ s.classList.toggle('active',i===idx); });
  document.querySelectorAll('.dot').forEach(function(d,i){ d.classList.toggle('active',i===idx); });
  state.heroSlide = idx;
}

function startHeroSlider() {
  if (_heroTimer) clearInterval(_heroTimer);
  _heroTimer = setInterval(function(){ changeSlide(1); }, 5000);
}

/* ================================================================
   SEARCH
   HTML IDs: searchOverlay (bar), searchInput
================================================================ */
function toggleSearch() {
  var bar = document.getElementById('searchOverlay'); if (!bar) return;
  var isOpen = bar.classList.toggle('active');
  if (isOpen) { var inp=document.getElementById('searchInput'); if(inp) setTimeout(function(){inp.focus();},50); }
}

function liveSearch(val) {
  state.search = val.trim().toLowerCase();
  if (state.search.length > 1) { showSection('products'); }
  else if (!state.search)      { renderProductsPage(); }
}

/* ================================================================
   MOBILE NAV
   HTML IDs: hamburgerBtn, mobileNav, mobOverlay; close btn inline
================================================================ */
function initMobileNav() {
  var btn = document.getElementById('hamburgerBtn');
  var nav = document.getElementById('mobileNav');
  var ov  = document.getElementById('mobOverlay');

  if (btn) btn.addEventListener('click', function(){
    if (nav) nav.classList.add('active');
    if (ov)  ov.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  // expand/collapse accordion items in mobile nav
  document.querySelectorAll('.mob-expand > a').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    });
  });
}

function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  var ov  = document.getElementById('mobOverlay');
  if (nav) nav.classList.remove('active');
  if (ov)  ov.classList.remove('active');
  document.body.style.overflow = '';
}

/* ================================================================
   SALE COUNTDOWN
================================================================ */
function startSaleCountdown() {
  var el = document.getElementById('saleCountdown'); if (!el) return;
  var endDate;
  try {
    var saved = localStorage.getItem('khu_sale_end');
    endDate = saved ? new Date(saved) : null;
    if (!endDate || endDate < new Date()) {
      endDate = new Date(Date.now() + 3*24*60*60*1000);
      localStorage.setItem('khu_sale_end', endDate.toISOString());
    }
  } catch(e) { endDate = new Date(Date.now() + 3*24*60*60*1000); }

  function tick() {
    var diff = endDate - Date.now();
    if (diff <= 0) diff = 0;
    var d=Math.floor(diff/86400000),
        h=Math.floor((diff%86400000)/3600000),
        m=Math.floor((diff%3600000)/60000),
        s=Math.floor((diff%60000)/1000);
    el.innerHTML = [[d,'Days'],[h,'Hours'],[m,'Mins'],[s,'Secs']].map(function(x){
      return '<span class="cd-unit"><span class="cd-num">'+String(x[0]).padStart(2,'0')+'</span><span class="cd-lbl">'+x[1]+'</span></span>';
    }).join('');
  }
  tick(); setInterval(tick, 1000);
}

/* ================================================================
   FORM HANDLERS
================================================================ */
function subscribeNewsletter(e) {
  if (e) e.preventDefault();
  var inp = document.querySelector('.newsletter input[type=email]');
  if (!inp || !inp.value) return;
  showToast('Thanks for subscribing! 🎉','success');
  inp.value = '';
}

function submitContact(e) {
  if (e) e.preventDefault();
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var btn = form.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  if (typeof emailjs !== 'undefined') {
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_CONTACT_TEMPLATE_ID', form)
      .then(function() {
        showToast("Message sent! We\'ll respond within 24 hours.", 'success');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
      }, function(err) {
        showToast('Could not send — please email us directly at info@khu-enterprise.com', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
      });
  } else {
    /* EmailJS not loaded — fallback to WhatsApp */
    var name = (form.querySelector('[name=name]') || {}).value || '';
    var msg  = (form.querySelector('[name=message]') || {}).value || '';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Hi KHU Enterprise!\n' + name + '\n' + msg), '_blank');
    showToast("Opening WhatsApp — EmailJS not configured yet.", 'info');
    form.reset();
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
  }
}

function submitWholesale(e) {
  if (e) e.preventDefault();
  var form = document.querySelector('.wholesale-form');
  if (!form) return;
  var btn = form.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  if (typeof emailjs !== 'undefined') {
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_WHOLESALE_TEMPLATE_ID', form)
      .then(function() {
        showToast('Wholesale inquiry sent! We\'ll respond within 24 hours.', 'success');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }
      }, function(err) {
        /* fallback to WhatsApp on EmailJS error */
        var name = (form.querySelector('input[type=text]') || {}).value || 'there';
        var msg = 'Hi KHU Enterprise! Wholesale Inquiry from: ' + name + '. Please contact me.';
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
        showToast('EmailJS error — redirected to WhatsApp.', 'info');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }
      });
  } else {
    var name = (form.querySelector('input[type=text]') || {}).value || 'there';
    var msg = 'Hi KHU Enterprise! 📦 Wholesale Inquiry\n\nName: ' + name + '\nPlease contact me to discuss bulk pricing and terms.';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
    showToast('Redirecting to WhatsApp for your wholesale inquiry!', 'success');
    form.reset();
    if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }
  }
}

/* ================================================================
   TOAST — uses pre-built #toast div (class: toast / toast.show / toast.success etc.)
================================================================ */

/* ================================================================
   TOAST -- uses pre-built #toast div (class: toast / toast.show / toast.success etc.)
================================================================ */
var _toastTimer = null;
function showToast(msg, type) {var t = document.getElementById('toast');
  if (!t) return;
  clearTimeout(_toastTimer);
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' toast-' + type : '');
  _toastTimer = setTimeout(function() { t.className = 'toast'; }, 3000);
}

/* ================================================================
   INITIALISATION -- runs on DOMContentLoaded
================================================================ */
document.addEventListener('DOMContentLoaded', function() {

  /* --- Load saved cart & wishlist from localStorage --- */
  try {
    var savedCart = localStorage.getItem('khu_cart2');
    if (savedCart) state.cart = JSON.parse(savedCart);
  } catch(e) { state.cart = []; }
  try {
    var savedWish = localStorage.getItem('khu_wishlist2');
    if (savedWish) state.wishlist = JSON.parse(savedWish);
  } catch(e) { state.wishlist = []; }

  /* --- Render home page grids --- */
  renderFeaturedProducts();
  renderBestsellers();

  /* --- Start hero slider & sale countdown --- */
  startHeroSlider();
  startSaleCountdown();

  /* --- Init mobile nav --- */
  initMobileNav();

  /* --- Fetch live currency rates (Frankfurter / ECB) --- */
  fetchRates();

  /* --- Update badges --- */
  updateCartBadge();
  updateWishlistBadge();

  /* --- Handle browser back/forward via hashchange --- */
  var _validSections = ['home','products','sale','wholesale','about','contact','checkout','productDetail','orderSuccess'];
  window.addEventListener('hashchange', function() {
    var hash = window.location.hash.replace('#', '');
    if (hash && _validSections.indexOf(hash) !== -1 && hash !== _currentSection) {
      showSection(hash);
    } else if (!hash) {
      showSection('home');
    }
  });

  /* --- Read URL hash on first load --- */
  var initHash = window.location.hash.replace('#', '');
  if (initHash && _validSections.indexOf(initHash) !== -1) {
    showSection(initHash);
  } else {
    showSection('home');
  }
});
