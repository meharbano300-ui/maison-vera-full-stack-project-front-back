import catElectronics from "@/assets/cat-electronics.jpg";
import catFashion from "@/assets/cat-fashion.jpg";
import catHome from "@/assets/cat-home.jpg";
import catBeauty from "@/assets/cat-beauty.jpg";
import catHealth from "@/assets/cat-health.jpg";
import catGroceries from "@/assets/cat-groceries.jpg";

// Originals
import pPhone from "@/assets/p-phone.jpg";
import pLaptop from "@/assets/p-laptop.jpg";
import pHeadphones from "@/assets/p-headphones.jpg";
import pShirt from "@/assets/p-shirt.jpg";

import pSofa from "@/assets/p-sofa.jpg";
import pDinner from "@/assets/p-dinner.jpg";
import pBath from "@/assets/p-bath.jpg";
import pSerum from "@/assets/p-serum.jpg";
import pHair from "@/assets/p-hair.jpg";
import pVitamins from "@/assets/p-vitamins.jpg";
import pFitness from "@/assets/p-fitness.jpg";
import pProduce from "@/assets/p-produce.jpg";
import pDairy from "@/assets/p-dairy.jpg";
import pSnacks from "@/assets/p-snacks.jpg";

// Unique images for every product
import pPhoneCase from "@/assets/p-phone-case.jpg";
import pSmartwatch from "@/assets/p-smartwatch.jpg";
import pBpMonitor from "@/assets/p-bp-monitor.jpg";
import pGlucometer from "@/assets/p-glucometer.jpg";
import pEspresso from "@/assets/p-espresso.jpg";
import pTuxedo from "@/assets/p-tuxedo.jpg";
import pSilkDress from "@/assets/p-silk-dress.jpg";
import pKidsCoat from "@/assets/p-kids-coat.jpg";
import pKidsShoes from "@/assets/p-kids-shoes.jpg";
import pMarbleTable from "@/assets/p-marble-table.jpg";
import pArcLamp from "@/assets/p-arc-lamp.jpg";
import pWallArt from "@/assets/p-wall-art.jpg";
import pBedding from "@/assets/p-bedding.jpg";
import pRetinol from "@/assets/p-retinol.jpg";
import pLipstick from "@/assets/p-lipstick.jpg";
import pSoleilPerfume from "@/assets/p-soleil-perfume.jpg";
import pMagnesium from "@/assets/p-magnesium.jpg";
import pDumbbells from "@/assets/p-dumbbells.jpg";
import pStoneFruit from "@/assets/p-stone-fruit.jpg";
import pEggs from "@/assets/p-eggs.jpg";
import pElderflower from "@/assets/p-elderflower.jpg";
import pOliveOil from "@/assets/p-olive-oil.jpg";
import pPasta from "@/assets/p-pasta.jpg";

// Legacy clutch image kept for the evening clutch
import p3 from "@/assets/product-3.jpg";
import p5 from "@/assets/product-5.jpg";




























export const categoryList = [
{
  slug: "electronics",
  name: "Electronics & Gadgets",
  tagline: "Cutting edge essentials",
  description: "Phones, laptops, wearables, audio and home appliances composed for the modern maison.",
  image: catElectronics,
  subs: [
  "Mobile Phones & Accessories",
  "Laptops & Computers",
  "Smart Watches & Wearables",
  "Headphones & Audio",
  "Home Appliances"]

},
{
  slug: "fashion",
  name: "Fashion & Apparel",
  tagline: "Tailored for every soul",
  description: "Hand finished garments and footwear for men, women and the youngest in the household.",
  image: catFashion,
  subs: ["Men's Fashion", "Women's Fashion", "Kids' Wear"]
},
{
  slug: "home-living",
  name: "Home & Living",
  tagline: "The art of the everyday",
  description: "Furniture, decor, dining and bedding composed to dress the quietest hours of the day.",
  image: catHome,
  subs: ["Furniture", "Home Decor", "Kitchenware & Dining", "Bedding & Bath"]
},
{
  slug: "beauty",
  name: "Beauty & Personal Care",
  tagline: "Rituals of the maison",
  description: "Skincare, haircare, cosmetics and fragrance composed by the houses of Grasse.",
  image: catBeauty,
  subs: ["Skincare", "Haircare", "Cosmetics & Makeup", "Fragrances & Perfumes"]
},
{
  slug: "health",
  name: "Health & Wellness",
  tagline: "The quiet strength",
  description: "Vitamins, fitness and monitoring composed for a slower, stronger life.",
  image: catHealth,
  subs: ["Vitamins & Supplements", "Fitness Equipment", "Personal Health Monitors"]
},
{
  slug: "groceries",
  name: "Groceries & Essentials",
  tagline: "The pantry, curated",
  description: "Fresh produce, dairy, snacks and pantry essentials sourced from artisan houses.",
  image: catGroceries,
  subs: ["Fresh Produce", "Dairy & Eggs", "Snacks & Beverages", "Packaged Foods"]
}];


export const products = [
// ============ Electronics ============
{ id: "atelier-phone-pro", name: "Atelier Phone Pro", tagline: "Titanium edition, 256GB", category: "Electronics & Gadgets", subcategory: "Mobile Phones & Accessories", color: "Black", price: 1299, oldPrice: 1499, rating: 4.8, reviews: 423, image: pPhone, badge: "New", description: "A flagship smartphone hand assembled in a brushed titanium chassis with a ceramic shield front and a triple lens system tuned for low light editorial photography.", details: ["6.7 inch ProMotion OLED", "Triple 48MP lens system", "Titanium unibody", "All day battery, 5G ready"] },
{ id: "leather-phone-case", name: "Saffiano Leather Case", tagline: "Hand stitched in Florence", category: "Electronics & Gadgets", subcategory: "Mobile Phones & Accessories", color: "Cognac", price: 180, rating: 4.6, reviews: 189, image: pPhoneCase, description: "A Saffiano leather case stitched by hand in Florence with gold debossed corners and a microfiber lined interior.", details: ["Italian Saffiano leather", "Hand stitched corners", "MagSafe compatible", "Lifetime patina warranty"] },
{ id: "noir-laptop-15", name: "Noir Laptop 15", tagline: "M3 chip, 32GB, 1TB", category: "Electronics & Gadgets", subcategory: "Laptops & Computers", color: "Black", price: 2890, rating: 4.9, reviews: 116, image: pLaptop, badge: "Editor's choice", description: "A 15 inch retina laptop in a CNC milled aluminum shell, tuned for studio work with a 32GB memory pool and a 1TB SSD.", details: ["15 inch Liquid Retina XDR", "M3 Max, 32GB unified memory", "1TB NVMe SSD", "Up to 22 hours battery"] },
{ id: "horizon-smartwatch", name: "Horizon Smartwatch", tagline: "Sapphire glass, titanium body", category: "Electronics & Gadgets", subcategory: "Smart Watches & Wearables", color: "Black", price: 749, oldPrice: 899, rating: 4.7, reviews: 312, image: pSmartwatch, description: "A premium smartwatch with a sapphire crystal and a titanium body, tuned with a precision heart rate sensor and ECG.", details: ["Sapphire crystal display", "Titanium chassis", "Always on OLED", "36h battery, GPS, ECG"] },
{ id: "atelier-headphones", name: "Atelier Over Ear Headphones", tagline: "Adaptive ANC, 60h battery", category: "Electronics & Gadgets", subcategory: "Headphones & Audio", color: "Black", price: 549, rating: 4.8, reviews: 542, image: pHeadphones, badge: "Bestseller", description: "Studio tuned over ear headphones with adaptive noise cancellation, leather wrapped earcups and a 60 hour battery.", details: ["Adaptive ANC", "Hi Res audio, LDAC", "Memory foam, lambskin earcups", "60 hour playback"] },
{ id: "salon-espresso", name: "Salon Espresso Machine", tagline: "Brass group head, 15 bar", category: "Electronics & Gadgets", subcategory: "Home Appliances", color: "Gold", price: 1890, rating: 4.6, reviews: 84, image: pEspresso, description: "A semi automatic espresso machine in brushed brass with a PID controlled brewhead and a steam wand for milk craft.", details: ["15 bar pump", "PID temperature control", "Brass group head", "Steam wand, hot water tap"] },

// ============ Fashion ============
{ id: "tailored-white-shirt", name: "Tailored White Shirt", tagline: "Egyptian cotton poplin", category: "Fashion & Apparel", subcategory: "Men's Fashion", color: "Ivory", price: 220, rating: 4.7, reviews: 312, image: pShirt, badge: "Essential", description: "A slim cut shirt in 120 thread Egyptian poplin with a hand turned collar and mother of pearl buttons.", details: ["120s Egyptian cotton", "Hand turned collar", "Mother of pearl buttons", "Made in Milan"], sizes: ["S", "M", "L", "XL"] },
{ id: "midnight-tuxedo", name: "Midnight Tuxedo Jacket", tagline: "Wool with silk shawl", category: "Fashion & Apparel", subcategory: "Men's Fashion", color: "Black", price: 1840, rating: 4.9, reviews: 64, image: pTuxedo, description: "A single button shawl lapel tuxedo cut from a midnight wool and silk blend, half canvased and hand finished.", details: ["Wool silk midnight", "Half canvas construction", "Silk shawl lapel", "Made in Florence"], sizes: ["46", "48", "50", "52", "54"] },
{ id: "champagne-silk-dress", name: "Champagne Silk Dress", tagline: "Bias cut, hand draped", category: "Fashion & Apparel", subcategory: "Women's Fashion", color: "Ivory", price: 1620, oldPrice: 1890, rating: 4.9, reviews: 148, image: pSilkDress, badge: "New", description: "An off shoulder bias cut silk dress with a hand draped V neck and a sculpted train.", details: ["100% mulberry silk", "Bias cut godets", "Hand draped neckline", "Atelier finished"], sizes: ["XS", "S", "M", "L"] },
{ id: "evening-clutch-vesper", name: "Vesper Evening Clutch", tagline: "Calf leather, gold trim", category: "Fashion & Apparel", subcategory: "Women's Fashion", color: "Ivory", price: 980, rating: 4.7, reviews: 198, image: p3, description: "A handheld evening clutch in vegetable tanned calfskin with a hand polished gold frame.", details: ["Vegetable tanned calf", "Gold plated frame", "Silk lining", "Hand finished"] },
{ id: "petit-navy-coat", name: "Petit Navy Coat", tagline: "Wool, brass buttons", category: "Fashion & Apparel", subcategory: "Kids' Wear", color: "Navy", price: 420, rating: 4.8, reviews: 92, image: pKidsCoat, badge: "Atelier Junior", description: "A double breasted children's wool coat with brass buttons and a soft satin lining.", details: ["100% lambswool", "Brass buttons", "Satin lining", "Made in Florence"], sizes: ["2Y", "4Y", "6Y", "8Y"] },
{ id: "junior-leather-shoes", name: "Junior Leather Shoes", tagline: "Hand lasted in Italy", category: "Fashion & Apparel", subcategory: "Kids' Wear", color: "Black", price: 240, rating: 4.6, reviews: 78, image: pKidsShoes, description: "Hand lasted derby shoes in soft calfskin with a leather sole, made for first grand occasions.", details: ["Calfskin leather", "Hand stitched welt", "Leather sole", "Made in Italy"], sizes: ["28", "29", "30", "31", "32"] },

// ============ Home & Living ============
{ id: "cream-velvet-armchair", name: "Cream Velvet Armchair", tagline: "Sculpted, walnut base", category: "Home & Living", subcategory: "Furniture", color: "Ivory", price: 2480, oldPrice: 2890, rating: 4.8, reviews: 56, image: pSofa, badge: "Limited", description: "A sculpted lounge armchair in heavyweight cotton velvet with a hand turned walnut base.", details: ["Italian cotton velvet", "Walnut hardwood base", "Down filled cushion", "Made to order, 6 weeks"] },
{ id: "marble-coffee-table", name: "Carrara Coffee Table", tagline: "Solid marble, brass base", category: "Home & Living", subcategory: "Furniture", color: "Ivory", price: 1890, rating: 4.7, reviews: 41, image: pMarbleTable, description: "A round coffee table topped with veined Carrara marble on a brushed brass tripod base.", details: ["Carrara marble top", "Brushed brass base", "120cm diameter", "Hand polished edge"] },
{ id: "brass-arc-lamp", name: "Brass Arc Floor Lamp", tagline: "Linen shade, dimmable", category: "Home & Living", subcategory: "Home Decor", color: "Gold", price: 690, rating: 4.6, reviews: 134, image: pArcLamp, description: "A sculptural arc lamp with a brushed brass arm and a hand stitched linen shade.", details: ["Brushed brass arm", "Linen shade", "Dimmable bulb", "Marble base"] },
{ id: "linen-wall-art", name: "Travertine Wall Frame", tagline: "Hand poured, framed", category: "Home & Living", subcategory: "Home Decor", color: "Ivory", price: 320, rating: 4.5, reviews: 67, image: pWallArt, description: "A hand poured travertine panel in a walnut shadow frame, signed by the artisan.", details: ["Hand cast travertine", "Walnut shadow frame", "Signed and numbered", "60 x 80 cm"] },
{ id: "porcelain-dinner-set", name: "Porcelain Dinner Set", tagline: "Gold rimmed, 24 piece", category: "Home & Living", subcategory: "Kitchenware & Dining", color: "Ivory", price: 890, rating: 4.9, reviews: 188, image: pDinner, badge: "Bestseller", description: "A 24 piece bone china set with a hand painted gold rim, dishwasher safe.", details: ["Fine bone china", "24 carat gold rim", "Service for 6", "Dishwasher safe"] },
{ id: "egyptian-cotton-towels", name: "Egyptian Cotton Towels", tagline: "Set of 6, 700gsm", category: "Home & Living", subcategory: "Bedding & Bath", color: "Ivory", price: 280, oldPrice: 340, rating: 4.8, reviews: 421, image: pBath, description: "A set of six 700gsm Egyptian cotton towels, woven in Portugal with hand finished hems.", details: ["700gsm Egyptian cotton", "Hand finished hem", "Set of 6", "Woven in Portugal"] },
{ id: "linen-bedding-set", name: "Stonewashed Linen Bedding", tagline: "Belgian flax, queen", category: "Home & Living", subcategory: "Bedding & Bath", color: "Ivory", price: 590, rating: 4.7, reviews: 256, image: pBedding, description: "A stonewashed Belgian flax linen bedding set in quiet ivory, softening with every wash.", details: ["100% Belgian flax linen", "Stonewashed finish", "Queen size", "Mother of pearl buttons"] },

// ============ Beauty ============
{ id: "amber-vitamin-c-serum", name: "Amber Vitamin C Serum", tagline: "20% L-ascorbic, 30ml", category: "Beauty & Personal Care", subcategory: "Skincare", color: "Amber", price: 145, rating: 4.8, reviews: 612, image: pSerum, badge: "Bestseller", description: "A 20 percent L ascorbic acid serum stabilized with ferulic acid and vitamin E, in a glass dropper bottle.", details: ["20% L-ascorbic acid", "Ferulic acid stabilized", "30ml glass dropper", "Composed in Grasse"] },
{ id: "midnight-retinol", name: "Midnight Retinol", tagline: "Encapsulated, 30ml", category: "Beauty & Personal Care", subcategory: "Skincare", color: "Black", price: 180, rating: 4.7, reviews: 348, image: pRetinol, description: "A slow release encapsulated retinol in a hyaluronic and squalane base, for nightly renewal.", details: ["Encapsulated retinol", "Squalane base", "Fragrance free", "30ml glass"] },
{ id: "argan-hair-oil", name: "Argan Hair Oil", tagline: "Cold pressed, 50ml", category: "Beauty & Personal Care", subcategory: "Haircare", color: "Amber", price: 95, rating: 4.6, reviews: 489, image: pHair, description: "A cold pressed Moroccan argan oil in an amber dropper bottle, for shine and softness.", details: ["Moroccan argan oil", "Cold pressed", "50ml glass", "Vegan and cruelty free"] },
{ id: "satin-lipstick-rouge", name: "Satin Lipstick, Rouge", tagline: "Hand turned brass case", category: "Beauty & Personal Care", subcategory: "Cosmetics & Makeup", color: "Rose Gold", price: 65, rating: 4.7, reviews: 1024, image: pLipstick, badge: "Cult", description: "A satin finish lipstick in a hand turned brass case, refillable and engraved.", details: ["Satin matte finish", "Refillable brass case", "8 hour wear", "Hand engraved"] },
{ id: "amber-eau-de-parfum", name: "Ambre Eau de Parfum", tagline: "Amber, oud, vanilla", category: "Beauty & Personal Care", subcategory: "Fragrances & Perfumes", color: "Amber", price: 240, rating: 4.7, reviews: 891, image: p5, description: "An amber rich oriental, slow burning with Madagascan vanilla and Laotian oud.", details: ["100ml extrait", "Top bergamot, pink pepper", "Heart rose, oud", "Base amber, vanilla, musk"] },
{ id: "soleil-eau-de-parfum", name: "Soleil Eau de Parfum", tagline: "Neroli, jasmine, musk", category: "Beauty & Personal Care", subcategory: "Fragrances & Perfumes", color: "Gold", price: 240, rating: 4.8, reviews: 612, image: pSoleilPerfume, badge: "Bestseller", description: "A luminous floral composed in Grasse, opening on neroli and closing on white musk.", details: ["100ml extrait", "Top neroli, bergamot", "Heart jasmine, tuberose", "Base white musk, cedar"] },

// ============ Health ============
{ id: "daily-vitamin-trio", name: "Daily Vitamin Trio", tagline: "D3, B12, Omega 3", category: "Health & Wellness", subcategory: "Vitamins & Supplements", color: "Amber", price: 65, rating: 4.7, reviews: 542, image: pVitamins, badge: "Daily", description: "A 30 day program of vitamin D3, B12 and Omega 3 capsules in an amber glass bottle.", details: ["30 day supply", "Third party tested", "Non GMO", "Glass packaging"] },
{ id: "magnesium-glycinate", name: "Magnesium Glycinate", tagline: "400mg, 90 capsules", category: "Health & Wellness", subcategory: "Vitamins & Supplements", color: "Amber", price: 38, rating: 4.8, reviews: 718, image: pMagnesium, description: "A highly absorbable magnesium glycinate, 400mg per dose, for rest and recovery.", details: ["400mg per serving", "90 capsules", "Glycinate form", "Non GMO"] },
{ id: "leather-yoga-mat", name: "Leather Yoga Mat", tagline: "Hand stitched, brass strap", category: "Health & Wellness", subcategory: "Fitness Equipment", color: "Cognac", price: 380, rating: 4.6, reviews: 124, image: pFitness, badge: "Atelier", description: "A vegetable tanned leather topped yoga mat with a brass buckle carry strap.", details: ["Vegetable tanned leather", "Natural rubber base", "Brass buckle strap", "6mm cushioning"] },
{ id: "atelier-dumbbells", name: "Atelier Leather Dumbbells", tagline: "Pair, 5kg, brass core", category: "Health & Wellness", subcategory: "Fitness Equipment", color: "Cognac", price: 290, rating: 4.7, reviews: 86, image: pDumbbells, description: "A pair of brass core dumbbells wrapped in hand stitched leather, 5kg each.", details: ["5kg each, pair", "Brass core", "Leather wrapped", "Hand stitched"] },
{ id: "digital-bp-monitor", name: "Digital BP Monitor", tagline: "Bluetooth, app synced", category: "Health & Wellness", subcategory: "Personal Health Monitors", color: "Black", price: 145, rating: 4.5, reviews: 254, image: pBpMonitor, description: "A clinical grade upper arm blood pressure monitor with bluetooth sync to your phone.", details: ["Clinical accuracy", "Bluetooth sync", "Stores 60 readings", "USB C charging"] },
{ id: "smart-glucometer", name: "Smart Glucometer Kit", tagline: "20 strips, app synced", category: "Health & Wellness", subcategory: "Personal Health Monitors", color: "Black", price: 89, rating: 4.4, reviews: 192, image: pGlucometer, description: "A compact glucometer with bluetooth sync, 20 strips and a lancing device included.", details: ["Bluetooth sync", "20 strips included", "Lancing device", "Carry case"] },

// ============ Groceries ============
{ id: "heirloom-tomato-basket", name: "Heirloom Tomato Basket", tagline: "1.5kg, vine ripened", category: "Groceries & Essentials", subcategory: "Fresh Produce", color: "Amber", price: 18, rating: 4.8, reviews: 421, image: pProduce, badge: "Fresh today", description: "A 1.5kg woven basket of heirloom tomatoes, vine ripened and delivered same day.", details: ["1.5kg net weight", "Vine ripened", "Same day delivery", "Sourced locally"] },
{ id: "stone-fruit-box", name: "Stone Fruit Box", tagline: "Peach, fig, plum", category: "Groceries & Essentials", subcategory: "Fresh Produce", color: "Amber", price: 28, rating: 4.6, reviews: 188, image: pStoneFruit, description: "A seasonal stone fruit box with white peach, black fig and Italian plum.", details: ["2kg net", "Seasonal selection", "Hand picked", "Compostable packaging"] },
{ id: "farmhouse-milk", name: "Farmhouse Glass Milk", tagline: "1L, organic, whole", category: "Groceries & Essentials", subcategory: "Dairy & Eggs", color: "Ivory", price: 6, rating: 4.7, reviews: 612, image: pDairy, description: "A 1 litre glass bottle of whole organic milk from a single source farm.", details: ["1L glass bottle", "Whole organic", "Single farm source", "Returnable bottle"] },
{ id: "free-range-eggs", name: "Free Range Eggs", tagline: "Dozen, pasture raised", category: "Groceries & Essentials", subcategory: "Dairy & Eggs", color: "Ivory", price: 9, rating: 4.8, reviews: 488, image: pEggs, description: "A dozen pasture raised eggs from heritage breed hens, in a recycled paper carton.", details: ["12 large eggs", "Pasture raised", "Heritage breed", "Recycled carton"] },
{ id: "single-origin-chocolate", name: "Single Origin Chocolate", tagline: "75%, Madagascar", category: "Groceries & Essentials", subcategory: "Snacks & Beverages", color: "Black", price: 12, rating: 4.9, reviews: 712, image: pSnacks, badge: "Bestseller", description: "A 75 percent dark chocolate bar from a single Madagascan plantation, bean to bar.", details: ["75% cacao", "Single origin Madagascar", "Bean to bar", "Hand wrapped"] },
{ id: "sparkling-elderflower", name: "Sparkling Elderflower", tagline: "750ml glass", category: "Groceries & Essentials", subcategory: "Snacks & Beverages", color: "Gold", price: 8, rating: 4.6, reviews: 245, image: pElderflower, description: "A 750ml bottle of sparkling elderflower pressed from hand foraged flowers.", details: ["750ml glass", "Hand foraged elderflower", "Lightly sparkling", "Non alcoholic"] },
{ id: "tuscan-olive-oil", name: "Tuscan Olive Oil", tagline: "500ml, first cold press", category: "Groceries & Essentials", subcategory: "Packaged Foods", color: "Gold", price: 32, rating: 4.9, reviews: 354, image: pOliveOil, badge: "Cult", description: "A first cold pressed Tuscan extra virgin olive oil from a single grove harvest.", details: ["500ml dark glass", "First cold press", "Single grove", "Harvest dated"] },
{ id: "stone-ground-pasta", name: "Stone Ground Bronze Pasta", tagline: "500g, durum wheat", category: "Groceries & Essentials", subcategory: "Packaged Foods", color: "Amber", price: 9, rating: 4.7, reviews: 188, image: pPasta, description: "A 500g pack of bronze die cut pasta from stone ground Italian durum wheat.", details: ["500g pack", "Bronze die cut", "Stone ground durum", "Made in Gragnano"] }];


// All distinct subcategories
export const allSubcategories = Array.from(new Set(products.map((p) => p.subcategory)));

export const categories = ["All", ...categoryList.map((c) => c.name)];
export const colors = ["Ivory", "Black", "Gold", "Amber", "Rose Gold", "Cognac", "Navy"];

export const getProduct = (id) => products.find((p) => p.id === id);
export const getCategory = (slug) => categoryList.find((c) => c.slug === slug);
export const getCategoryByName = (name) => categoryList.find((c) => c.name === name);