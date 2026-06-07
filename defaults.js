export const defaultContent = {
  business: {
    name: "Sweet & Salao",
    tagline: "Puerto Rican sweets, savory plates, seafood cups, and street-food favorites.",
    intro: "Sweet & Salao by Chef Carmen LLC serves bold Puerto Rican plates, loaded fries, pastelillos, seafood cups, sweets, and drinks straight from the truck.",
    phone: "386-215-6720 / 386-215-6381",
    email: "sweetandsalaobychefcarmen@gmail.com",
    location: "Deltona, FL and surrounding areas",
    hours: "Follow us for current truck hours and event locations",
    verse: "Todo lo puedo en Cristo que me fortalece. Filipenses 4:13",
    logoImage: "/assets/sweet-salao-logo.png",
    heroImage: "/assets/churrasco-loaded-fries.jpg"
  },
  availability: {
    away: false,
    message: "We're closed today for a catering event. Thank you for your patience!",
    message_es: "Hoy estamos cerrados por un evento de catering. ¡Gracias por su paciencia!",
    backDate: "",
    backTime: ""
  },
  ordering: {
    zelleHandle: "orders@sweetandsalao.com",
    zellePhone: "386-215-6720",
    cashAppHandle: "$SweetSalao",
    cashAppUrl: "https://cash.app/$SweetSalao",
    whatsappNumbers: ["13862156720", "13862156381"],
    doorDashStoreUrl: "https://www.doordash.com/store/sweet-&-salao-by-chef-carmen-llc-deltona-39786349/92142352/?utm_source=mx_share_android",
    pickupInstructions: "Pickup at the truck window. We will text when your order is ready.",
    doorDashInstructions: "Choose DoorDash delivery and we will open the Sweet & Salao DoorDash ordering page so you can complete delivery details there."
  },
  sections: {
    featuredTitle: "Straight from the truck",
    storyTitle: "Sweet, salao, and made by Chef Carmen",
    storyText: "From pastelillos and pinchos to churrasco, seafood cups, flan, and natural juices, the truck brings a full comfort-food menu to Deltona and nearby events. Cooked with love, seasoned with faith."
  },
  products: [
    { id: "chicharrones-de-pollo", name: "Chicharrones de Pollo", category: "Entrees", price: 14, description: "Crispy chicken cracklings. Includes 1 side and salad.", description_es: "Crujientes chicharrones de pollo. Incluye 1 acompañante y ensalada.", image: "/assets/chicharrones-pollo.jpg", available: true, featured: true },
    { id: "pechuga", name: "Pechuga", category: "Entrees", price: 15, description: "Chicken breast. Includes 1 side and salad.", description_es: "Pechuga de pollo. Incluye 1 acompañante y ensalada.", note: "Choose your style: Grill, Empanada, Ajillo, or a la Criolla.", note_es: "Elige tu estilo: a la parrilla, empanada, al ajillo o a la criolla.", image: "/assets/pechuga-grill.jpg", available: true, featured: true },
    { id: "carne-frita", name: "Carne Frita", category: "Entrees", price: 14, description: "Golden fried pork. Includes 1 side and salad.", description_es: "Carne de cerdo frita y doradita. Incluye 1 acompañante y ensalada.", image: "/assets/chicharrones-pollo-plate.jpg", available: true, featured: false },
    { id: "camarones-entree", name: "Camarones", category: "Entrees", price: 17, description: "Shrimp. Includes 1 side and salad.", description_es: "Camarones. Incluye 1 acompañante y ensalada.", note: "Choose your style: Ensalada, Ajillo, or a la Criolla.", note_es: "Elige tu estilo: en ensalada, al ajillo o a la criolla.", image: "/assets/shrimp-amarillo-bowl.jpg", available: true, featured: true },
    { id: "pulpo-entree", name: "Pulpo", category: "Entrees", price: 18, description: "Tender octopus. Includes 1 side and salad.", description_es: "Pulpo tierno. Incluye 1 acompañante y ensalada.", image: "/assets/pulpo-ceviche-plate.jpg", available: true, featured: false },
    { id: "carrucho-entree", name: "Carrucho", category: "Entrees", price: 25, description: "Conch, island style. Includes 1 side and salad.", description_es: "Carrucho al estilo de la isla. Incluye 1 acompañante y ensalada.", image: "/assets/seafood-mofongo-plate.jpg", available: true, featured: false },
    { id: "mariscos-mixtos-entree", name: "Mariscos Mixtos", category: "Entrees", price: 25, description: "Mixed seafood entree. Includes 1 side and salad.", description_es: "Plato de mariscos mixtos. Incluye 1 acompañante y ensalada.", image: "/assets/chicken-salad-plate.jpg", available: true, featured: false },
    { id: "churrasco", name: "Churrasco", category: "Entrees", price: 20, description: "Grilled skirt steak. Includes 1 side and salad.", description_es: "Churrasco a la parrilla. Incluye 1 acompañante y ensalada.", image: "/assets/churrasco-loaded-fries.jpg", available: true, featured: true },
    { id: "mar-y-tierra", name: "Mar y Tierra", category: "Entrees", price: 25, description: "Grilled skirt steak with shrimp or octopus. Includes 1 side and salad.", description_es: "Churrasco a la parrilla con camarones o pulpo. Incluye 1 acompañante y ensalada.", image: "/assets/shrimp-mofongo-cup.jpg", available: true, featured: true },
    { id: "chillo-frito", name: "Chillo Frito", category: "Entrees", price: null, marketPrice: true, description: "Whole fried red snapper. Market price.", description_es: "Chillo entero frito. Precio de mercado.", image: "/assets/fried-fish.jpg", available: true, featured: false },
    { id: "chillo-con-pulpo-o-camarones", name: "Chillo con Pulpo o Camarones", category: "Entrees", price: null, marketPrice: true, description: "Red snapper with octopus or shrimp salad. Market price.", description_es: "Chillo con ensalada de pulpo o camarones. Precio de mercado.", image: null, available: true, featured: false },
    { id: "chillo-relleno-mariscos-mixtos", name: "Chillo Relleno de Mariscos Mixtos", category: "Entrees", price: null, marketPrice: true, description: "Red snapper stuffed with mixed seafood. Market price.", description_es: "Chillo relleno de mariscos mixtos. Precio de mercado.", image: null, available: true, featured: false },

    { id: "pastelillo-de-pollo", name: "Pastelillo de Pollo", category: "Starters", price: 3, description: "Chicken empanada.", description_es: "Pastelillo de pollo.", image: "/assets/pastelillo-pollo.jpg", available: true, featured: false },
    { id: "pastelillo-de-carne", name: "Pastelillo de Carne", category: "Starters", price: 3, description: "Beef empanada.", description_es: "Pastelillo de carne.", image: "/assets/empanada.jpg", available: true, featured: false },
    { id: "pastelillo-de-pizza", name: "Pastelillo de Pizza", category: "Starters", price: 3, description: "Pizza empanada.", description_es: "Pastelillo de pizza.", image: null, available: true, featured: false },
    { id: "pastelillo-de-camarones", name: "Pastelillo de Camarones", category: "Starters", price: 5, description: "Shrimp empanada.", description_es: "Pastelillo de camarones.", image: null, available: true, featured: false },
    { id: "alcapurria-de-carne", name: "Alcapurria de Carne (12\")", category: "Starters", price: 6, description: "12-inch beef alcapurria.", description_es: "Alcapurria de carne de 12 pulgadas.", image: "/assets/alcapurria-carne.jpg", available: true, featured: false },
    { id: "alcapurria-de-jueyes", name: "Alcapurria de Jueyes (12\")", category: "Starters", price: 7, description: "12-inch crab alcapurria.", description_es: "Alcapurria de jueyes de 12 pulgadas.", image: "/assets/alcapurria-handheld.jpg", available: true, featured: false },
    { id: "papas-tostones-locos-pollo", name: "Papas o Tostones Locos de Pollo", category: "Starters", price: 15, description: "Loaded fries or tostones with juicy grilled chicken, rich cheese sauce, bacon bites, ketchup, mayo-ketchup, sour cream, and house chimichurri.", description_es: "Papas o tostones locos con jugoso pollo a la parrilla, rica salsa de queso, trocitos de tocineta, ketchup, mayoketchup, crema agria y chimichurri de la casa.", image: "/assets/chicken-loaded-fries.jpg", available: true, featured: true },
    { id: "papas-tostones-locos-carne-frita", name: "Papas o Tostones Locos de Carne Frita", category: "Starters", price: 14, description: "Loaded fries or tostones with fried pork chunks, rich cheese sauce, bacon bites, ketchup, mayo-ketchup, sour cream, and house chimichurri.", description_es: "Papas o tostones locos con trozos de carne de cerdo frita, rica salsa de queso, trocitos de tocineta, ketchup, mayoketchup, crema agria y chimichurri de la casa.", image: "/assets/papas-locas-carne-frita.jpg", available: true, featured: true },
    { id: "papas-tostones-locos-churrasco", name: "Papas o Tostones Locos de Churrasco", category: "Starters", price: 20, description: "Loaded fries or tostones with grilled skirt steak, rich cheese sauce, bacon bites, ketchup, mayo-ketchup, sour cream, and house chimichurri.", description_es: "Papas o tostones locos con churrasco a la parrilla, rica salsa de queso, trocitos de tocineta, ketchup, mayoketchup, crema agria y chimichurri de la casa.", image: "/assets/papas-locas-churrasco.jpg", available: true, featured: true },
    { id: "papas-tostones-locos-mar-y-tierra", name: "Papas Locas de Mar y Tierra", category: "Starters", price: 25, description: "Loaded fries piled with grilled skirt steak and shrimp, rich cheese sauce, fresh pico, drizzled sauces, and house chimichurri.", description_es: "Papas locas cargadas con churrasco a la parrilla y camarones, rica salsa de queso, pico fresco, salsas y chimichurri de la casa.", image: "/assets/papas-locas-mar-y-tierra.jpg", available: true, featured: true },
    { id: "pinchos-bolitas-mofongo", name: "Pinchos con Bolitas de Mofongo", category: "Starters", price: 16, description: "Two juicy grilled chicken kabobs served with bolitas de mofongo.", description_es: "Dos jugosos pinchos de pollo a la parrilla servidos con bolitas de mofongo.", image: "/assets/pinchos-bolitas-mofongo.jpg", available: true, featured: true },
    { id: "pinchos-papas-locas", name: "Pinchos con Papas Locas", category: "Starters", price: 16, description: "Two juicy grilled chicken kabobs over loaded fries with garlic bread.", description_es: "Dos jugosos pinchos de pollo a la parrilla sobre papas locas con pan de ajo.", image: "/assets/pinchos-papas-locas.jpg", available: true, featured: true },
    { id: "tacos-estilo-cantinflas", name: "Tacos Estilo Cantinflas", category: "Starters", price: 16, description: "Three chicken tacos with creamy mashed potato and chicken cheese sauce. Swap chips for bolitas de mofongo, papas locas, or tostones for $3.", description_es: "Tres tacos de pollo con puré de papa cremoso y salsa de queso con pollo. Cambia los chips por bolitas de mofongo, papas locas o tostones por $3.", image: "/assets/tacos-cantinflas.jpg", available: true, featured: false },

    { id: "vaso-camarones", name: "Vaso de Camarones", category: "Seafood Cups", price: 14, description: "Shrimp seafood cup.", description_es: "Vaso de camarones.", image: "/assets/shrimp-ceviche-cup.jpg", available: true, featured: true },
    { id: "vaso-pulpo", name: "Vaso de Ensalada de Pulpo", category: "Seafood Cups", price: 16, description: "Octopus salad seafood cup.", description_es: "Vaso de ensalada de pulpo.", image: "/assets/vaso-ensalada-pulpo.jpg", available: true, featured: true },
    { id: "vaso-carrucho", name: "Vaso de Carrucho", category: "Seafood Cups", price: 20, description: "Conch seafood cup.", description_es: "Vaso de carrucho.", image: "/assets/shrimp-cup.jpg", available: true, featured: false },
    { id: "vaso-mariscos-mixtos", name: "Vaso de Mariscos Mixtos", category: "Seafood Cups", price: 20, description: "Mixed seafood cup.", description_es: "Vaso de mariscos mixtos.", image: "/assets/ensalada-pulpo.jpg", available: true, featured: false },

    { id: "kids-pechuga-papas", name: "Pechuga Empanada o al Grill con Papas", category: "Kids Menu", price: 7, description: "Breaded or grilled chicken with fries.", description_es: "Pollo empanado o a la parrilla con papas.", image: "/assets/grilled-pechuga-plate.jpg", available: true, featured: false },
    { id: "kids-taco-nachos", name: "Taco Estilo Cantinflas y Nachos con Queso", category: "Kids Menu", price: 7, description: "One chicken taco with warm tortilla chips and cheese sauce.", description_es: "Un taco de pollo con chips de tortilla tibios y salsa de queso.", image: null, available: true, featured: false },
    { id: "kids-mini-papas-locas", name: "Mini Papas Locas", category: "Kids Menu", price: 9, description: "Golden fries with warm cheese, chicken, bacon bits, ketchup, sour cream, and mayo-ketchup.", description_es: "Papas doradas con queso tibio, pollo, trocitos de tocineta, ketchup, crema agria y mayoketchup.", image: "/assets/pork-loaded-fries.jpg", available: true, featured: false },
    { id: "kids-pincho-papas-locas", name: "Pincho de Pollo con Papas Locas", category: "Kids Menu", price: 10, description: "One grilled chicken kabob with a side of loaded fries.", description_es: "Un pincho de pollo a la parrilla con acompañante de papas locas.", image: "/assets/surf-turf-skewers.jpg", available: true, featured: false },

    { id: "flan-de-vainilla", name: "Flan de Vainilla", category: "Sweets", price: 3, description: "Classic vanilla flan.", description_es: "Flan de vainilla clásico.", image: null, available: true, featured: false },
    { id: "flan-de-queso", name: "Flan de Queso", category: "Sweets", price: 3, description: "Creamy cheese flan.", description_es: "Cremoso flan de queso.", image: null, available: true, featured: false },

    { id: "agua-water", name: "Agua / Water", category: "Drinks", price: 2, description: "Bottled water.", description_es: "Agua embotellada.", image: null, available: true, featured: false },
    { id: "sodas", name: "Sodas", category: "Drinks", price: 2, description: "Pepsi, Coke, Sprite, Diet Coke, or Kola Champagne.", description_es: "Pepsi, Coke, Sprite, Diet Coke o Kola Champagne.", image: null, available: true, featured: false },
    { id: "malta-india", name: "Malta India 12oz", category: "Drinks", price: 3, description: "12 oz Malta India.", description_es: "Malta India de 12 oz.", image: null, available: true, featured: false },
    { id: "jugos-naturales", name: "Jugos Naturales Homemade", category: "Drinks", price: 3.5, description: "Homemade natural juices.", description_es: "Jugos naturales hechos en casa.", image: null, available: true, featured: false },

    { id: "tostones", name: "Tostones", category: "Sides", price: 5, description: "Fried green plantains.", description_es: "Tostones de plátano verde.", image: null, available: true, featured: false },
    { id: "tostones-con-ajo", name: "Tostones con Ajo", category: "Sides", price: 6, description: "Fried green plantains with garlic.", description_es: "Tostones de plátano verde con ajo.", image: null, available: true, featured: false },
    { id: "mofongo", name: "Mofongo", category: "Sides", price: 6, description: "Mashed fried plantain side.", description_es: "Acompañante de mofongo.", image: null, available: true, featured: false },
    { id: "bifongo", name: "Bifongo", category: "Sides", price: 7, description: "Mixed plantain mofongo side.", description_es: "Acompañante de bifongo (mezcla de plátano).", image: null, available: true, featured: false },
    { id: "papas-fritas", name: "Papas Fritas", category: "Sides", price: 4, description: "Golden french fries.", description_es: "Papas fritas doradas.", image: null, available: true, featured: false },
    { id: "arroz-mamposteao", name: "Arroz Mamposteao", category: "Sides", price: 7, description: "Rice and beans, island style. Add-on to any plate for $2.", description_es: "Arroz mamposteao al estilo de la isla. Añádelo a cualquier plato por $2.", image: null, available: true, featured: false },
    { id: "aranita-rellena", name: "Arañita Rellena", category: "Sides", price: null, marketPrice: true, description: "Stuffed plantain spider fritter. Ask for today's price.", description_es: "Arañita rellena de plátano. Pregunta por el precio de hoy.", image: null, available: true, featured: false }
  ],
  gallery: [
    "/assets/papas-locas-mar-y-tierra.jpg",
    "/assets/pinchos-papas-locas.jpg",
    "/assets/churrasco-loaded-fries.jpg",
    "/assets/pechuga-grill.jpg",
    "/assets/vaso-ensalada-pulpo.jpg",
    "/assets/chicharrones-pollo.jpg"
  ],
  seo: {
    title: "Sweet & Salao Food Truck | Puerto Rican Eats in Deltona, FL",
    description: "Sweet & Salao by Chef Carmen LLC. Loaded fries, churrasco, seafood cups, pastelillos, flan, and more. Order pickup or DoorDash delivery in Deltona, FL."
  }
};
