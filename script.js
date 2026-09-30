const products = [
  {id:1,name:"ANKER Soundcore Earbuds A25i",category:"Audio",price:215,rating:4.8,reviews:124,icon:"🎧",badge:"Popular",pop:99},
  {id:2,name:"ANKER Soundcore Earbuds P20i",category:"Audio",price:165,rating:4.7,reviews:86,icon:"🎧",pop:95},
  {id:3,name:"ANKER Soundcore Earbuds V30i",category:"Audio",price:359,rating:4.7,reviews:63,icon:"🎧",pop:94},
  {id:4,name:"Black Shark GT3 Neo Smartwatch",category:"Smart Home",price:159,rating:4.6,reviews:72,icon:"⌚",pop:91},
  {id:5,name:"APPLE AirPods 2nd Generation with ANC",category:"Audio",price:89,old:129,rating:4.7,reviews:210,icon:"🎧",badge:"Sale",pop:90},
  {id:6,name:"DIVOOM Sling Bag with LED Display",category:"Accessories",price:399,old:449,rating:4.6,reviews:195,icon:"🎒",badge:"Sale",pop:89},
  {id:7,name:"Fantech K511 Hunter Pro",category:"Accessories",price:65,old:79,rating:4.6,reviews:49,icon:"⌨️",badge:"Sale",pop:83},
  {id:8,name:"JOYROOM 10,000mAh 20W Magnetic Wireless Powerbank JR-W020",category:"Power Bank",price:135,rating:4.6,reviews:67,icon:"🔋",pop:86},
  {id:9,name:"JOYROOM 20,000mAh 22.5W Fast Charging Powerbank JR-QP192",category:"Power Bank",price:119,rating:4.7,reviews:38,icon:"🔋",badge:"Sale",pop:81},
  {id:10,name:"JOYROOM 65W GaN Ultra Fast Charger Kit",category:"Chargers",price:129,rating:4.8,reviews:118,icon:"🔌",badge:"Sale",pop:78},
  {id:11,name:"JOYROOM JR-PBF27 10,000mAh 22.5W Power Bank",category:"Power Bank",price:89.90,rating:4.7,reviews:91,icon:"🔋",pop:74},
  {id:12,name:"JOYROOM JR-PC1 10,000mAh 22.5W Mini Power Bank",category:"Power Bank",price:79.90,rating:4.6,reviews:156,icon:"🔋",pop:88}
];

const categoryData = [
  ["Audio","🎧"],["Power Bank","🔋"],["Chargers","🔌"],["Accessories","🎒"],["Smart Home","⌚"]
];

let cart = JSON.parse(localStorage.getItem("manjoy-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("manjoy-wishlist") || "[]");
let activeSearch = "";

const $ = id => document.getElementById(id);
const money = n => "RM " + n.toLocaleString("en-MY");
const save = () => {
  localStorage.setItem("manjoy-cart", JSON.stringify(cart));
  localStorage.setItem("manjoy-wishlist", JSON.stringify(wishlist));
};




function renderCategories(){
  $("categories").innerHTML = categoryData.map(([name,icon]) =>
    `<button class="category-card" data-cat="${name}"><span class="category-icon">${icon}</span><span>${name}</span></button>`
  ).join("");
  document.querySelectorAll(".category-card").forEach(btn => btn.onclick = () => {
    document.querySelectorAll(".category-filter").forEach(c => c.checked = c.value === btn.dataset.cat);
    renderProducts();
    $("products").scrollIntoView({behavior:"smooth"});
  });
}

function getFilters(){
  const cats = [...document.querySelectorAll(".category-filter:checked")].map(x=>x.value);
  const price = +$("priceRange").value;
  const rating = +document.querySelector('input[name="rating"]:checked').value;
  return {cats,price,rating};
}

function renderProducts(){
  const {cats,price,rating} = getFilters();
  const search = activeSearch.trim().toLowerCase();
  let list = products.filter(p =>
    (!cats.length || cats.includes(p.category)) &&
    p.price <= price &&
    p.rating >= rating &&
    (!search || `${p.name} ${p.category}`.toLowerCase().includes(search))
  );
  const sort = $("sortSelect").value;
  if(sort === "price-low") list.sort((a,b)=>a.price-b.price);
  if(sort === "price-high") list.sort((a,b)=>b.price-a.price);
  if(sort === "rating") list.sort((a,b)=>b.rating-a.rating);
  if(sort === "popular") list.sort((a,b)=>b.pop-a.pop);

  $("resultCount").textContent = `${list.length} product${list.length!==1?"s":""}`;
  $("productGrid").innerHTML = list.length ? list.map(productCard).join("") :
    `<div class="empty" style="grid-column:1/-1">No products match your filters.</div>`;

  document.querySelectorAll(".add-btn").forEach(btn => btn.onclick = () => addToCart(+btn.dataset.id));
  document.querySelectorAll(".heart").forEach(btn => btn.onclick = (e) => { e.stopPropagation(); toggleWishlist(+btn.dataset.id); });
  document.querySelectorAll("[data-product-id]").forEach(el => el.onclick = () => openProductDetail(+el.dataset.productId));
}

function productCard(p){
  const wished = wishlist.includes(p.id);
  return `<article class="product-card">
    ${p.badge ? `<span class="product-badge ${p.badge.startsWith("-")?"sale":""}">${p.badge}</span>` : ""}
    <button class="heart ${wished?"active":""}" data-id="${p.id}">${wished?"♥":"♡"}</button>
    <div class="product-visual" data-product-id="${p.id}" title="View product details">${p.icon}</div>
    <div class="product-info">
      <div class="product-name" data-product-id="${p.id}" title="View product details">${p.name}</div>
      <div class="stars">★★★★★ <span>${p.rating} (${p.reviews})</span></div>
      <div class="price">${money(p.price)} ${p.old?`<span class="old-price">${money(p.old)}</span>`:""}</div>
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    </div>
  </article>`;
}

function openProductDetail(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const wished = wishlist.includes(p.id);
  const badge = p.badge ? `<span class="detail-badge ${p.badge.startsWith("-")?"sale":""}">${p.badge}</span>` : "";
  const descriptions = {
    Smartphones:"A modern smartphone designed for everyday performance, photography, communication and entertainment.",
    Laptops:"A versatile laptop built for study, work, creative tasks and everyday productivity.",
    Audio:"High-quality audio equipment designed for music, calls and immersive entertainment.",
    Accessories:"A practical tech accessory made to improve your everyday setup and device experience.",
    Gaming:"Gaming-focused hardware designed for responsive performance and an enjoyable gaming setup.",
    Monitors:"A clear, responsive display suitable for gaming, study, work and multimedia.",
    Cameras:"A versatile camera for capturing high-quality photos and videos in different situations."
  };
  const specs=[`Category: ${p.category}`,`Rating: ${p.rating}/5 from ${p.reviews} reviews`,`Product type: ${p.category === "Accessories" ? "Tech accessory" : p.category}`,"Availability: In stock","Warranty: 1 year"];
  $("productDetailContent").innerHTML=`<div class="product-detail-grid">
    <div class="detail-visual">${p.icon}</div>
    <div>${badge}<div class="detail-category">${p.category}</div><h2 class="detail-title">${p.name}</h2>
      <div class="detail-rating">★★★★★ <span>${p.rating} (${p.reviews} reviews)</span></div>
      <div class="detail-price">${money(p.price)} ${p.old?`<span class="detail-old-price">${money(p.old)}</span>`:""}</div>
      <p class="detail-description">${descriptions[p.category] || "A quality gadget selected for the MANJOY GADGET online store."}</p>
      <h3 class="detail-section-title">Product Specifications</h3><ul class="spec-list">${specs.map(x=>`<li>${x}</li>`).join("")}</ul>
      <div class="detail-actions"><button class="primary" id="detailAddCart">Add to Cart</button><button class="detail-wish" id="detailWishlist">${wished?"♥ In Wishlist":"♡ Wishlist"}</button></div>
    </div></div>`;
  $("detailAddCart").onclick=()=>addToCart(p.id);
  $("detailWishlist").onclick=()=>{toggleWishlist(p.id);openProductDetail(p.id)};
  $("productModal").classList.add("show");
}

function addToCart(id){
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  save(); renderCart(); updateCounts(); toast("Added to cart ✓");
}

function changeQty(id,delta){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x=>x.id!==id);
  save(); renderCart(); updateCounts();
}

function removeCart(id){
  cart = cart.filter(x=>x.id!==id);
  save(); renderCart(); updateCounts();
}

function renderCart(){
  const items = cart.map(item => ({...products.find(p=>p.id===item.id),qty:item.qty})).filter(Boolean);
  if(!items.length) $("cartItems").innerHTML = `<div class="empty">Your cart is empty.<br>Start shopping and add something you like.</div>`;
  else $("cartItems").innerHTML = items.map(i => `<div class="cart-item">
    <div class="mini-visual">${i.icon}</div><div class="item-main">
      <div class="item-name">${i.name}</div><div class="item-price">${money(i.price)}</div>
      <div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button></div>
    </div><button class="remove" onclick="removeCart(${i.id})">🗑</button>
  </div>`).join("");
  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  $("cartSubtotal").textContent = money(total);
  $("cartTotal").textContent = money(total);
  $("cartTitleCount").textContent = `(${items.reduce((s,i)=>s+i.qty,0)})`;
  $("checkoutTotal").textContent = money(total);
}

function toggleWishlist(id){
  wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  save(); renderProducts(); renderWishlist(); updateCounts();
  toast(wishlist.includes(id) ? "Added to wishlist ♥" : "Removed from wishlist");
}

function renderWishlist(){
  const items = wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  $("wishlistItems").innerHTML = items.length ? items.map(i=>`<div class="wish-item">
    <div class="mini-visual">${i.icon}</div><div class="item-main"><div class="item-name">${i.name}</div><div class="item-price">${money(i.price)}</div>
    <button class="add-btn" data-wish-add="${i.id}">Add to Cart</button></div><button class="remove" onclick="toggleWishlist(${i.id})">♥</button>
  </div>`).join("") : `<div class="empty">Your wishlist is empty.</div>`;
  document.querySelectorAll("[data-wish-add]").forEach(b=>b.onclick=()=>addToCart(+b.dataset.wishAdd));
  $("wishlistTitleCount").textContent = `(${items.length})`;
}

function updateCounts(){
  $("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  $("wishCount").textContent = wishlist.length;
}

function openDrawer(id){
  $(id).classList.add("open"); $("overlay").classList.add("show");
}
function closeAll(){
  document.querySelectorAll(".drawer").forEach(d=>d.classList.remove("open"));
  $("overlay").classList.remove("show");
  $("checkoutModal").classList.remove("show");
  $("productModal").classList.remove("show");
}
function toast(message){
  $("toast").textContent=message; $("toast").classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>$("toast").classList.remove("show"),1800);
}

$("searchInput").addEventListener("input", e=>{activeSearch=e.target.value;renderProducts()});
$("searchBtn").onclick=()=>{activeSearch=$("searchInput").value;renderProducts();$("products").scrollIntoView({behavior:"smooth"})};
$("sortSelect").onchange=renderProducts;
$("priceRange").oninput=e=>{$("priceValue").textContent=money(+e.target.value);renderProducts()};
document.querySelectorAll(".category-filter").forEach(x=>x.onchange=renderProducts);
document.querySelectorAll('input[name="rating"]').forEach(x=>x.onchange=renderProducts);
$("clearFilters").onclick=()=>{
  document.querySelectorAll(".category-filter").forEach(x=>x.checked=false);
  $("priceRange").value=10000;$("priceValue").textContent="RM 10,000";
  document.querySelector('input[name="rating"][value="0"]').checked=true;
  $("searchInput").value="";activeSearch="";renderProducts();
};
$("allCategories").onclick=()=>{$("products").scrollIntoView({behavior:"smooth"});document.querySelectorAll(".category-filter").forEach(x=>x.checked=false);renderProducts()};
document.querySelectorAll(".nav a[data-category]").forEach(a=>a.onclick=()=>{
  document.querySelectorAll(".category-filter").forEach(x=>x.checked=x.value===a.dataset.category);renderProducts();
});
$("cartBtn").onclick=()=>openDrawer("cartDrawer");
$("wishlistBtn").onclick=()=>openDrawer("wishlistDrawer");
$("overlay").onclick=closeAll;
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=closeAll);
$("checkoutBtn").onclick=()=>{
  if(!cart.length){toast("Your cart is empty");return}
  $("checkoutModal").classList.add("show");$("overlay").classList.remove("show");
};
$("checkoutForm").onsubmit=e=>{
  e.preventDefault(); closeAll(); cart=[]; save(); renderCart(); updateCounts(); toast("Order placed successfully! 🎉");
};
$("themeBtn").onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("techshop-theme",document.body.classList.contains("dark")?"dark":"light");
};
if(localStorage.getItem("techshop-theme")==="dark") {
  document.body.classList.add("dark");
}
/* ==============================
   THREE DOT MORE MENU
   ============================== */
const moreBtn = $("moreBtn");
const moreDropdown = $("moreDropdown");
moreBtn.onclick = (event) => {
  event.stopPropagation();
  moreDropdown.classList.toggle("show");
};
document.addEventListener("click", () => {
  moreDropdown.classList.remove("show");
});
/* ==============================
   INITIALIZE WEBSITE
   ============================== */
   // Navigation Dropdown
/* ==============================
   NAVIGATION DROPDOWN
   ============================== */

const categoryMenuBtn = $("categoryMenuBtn");
const categoryMenu = $("categoryMenu");

if (categoryMenuBtn && categoryMenu) {

  categoryMenuBtn.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();

    categoryMenu.classList.toggle("show");

    // Tutup three-dot menu
    if (moreDropdown) {
      moreDropdown.classList.remove("show");
    }
  });

}
/* ==============================
   CLOSE DROPDOWNS WHEN CLICK OUTSIDE
   ============================== */

document.addEventListener("click", () => {

  if (categoryMenu) {
    categoryMenu.classList.remove("show");
  }

  if (moreDropdown) {
    moreDropdown.classList.remove("show");
  }

});

renderCategories();
renderProducts();
renderCart();
renderWishlist();
updateCounts();