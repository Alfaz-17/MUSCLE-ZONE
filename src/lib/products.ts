export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  hoverImage: string
  description: string
  longDescription: string
  materials: string[]
  care: string[]
  sizes: { size: string; available: boolean }[]
  colors: { name: string; hex: string; available: boolean }[]
  details: string[]
  madeIn: string
  quantity?: string
  flavors?: string[]
}

export const products: Product[] = [
  {
    id: "whey-protein-isolate",
    name: "Whey Protein Isolate",
    price: 3499,
    category: "Protein",
    image: "/p1.jpeg",
    hoverImage: "/p2.jpeg",
    description: "Pure muscle fuel with 25g protein per serving",
    longDescription:
      "Our premium Whey Protein Isolate delivers 25g of fast-absorbing protein per scoop with minimal fat and carbs. Sourced from grass-fed cows and micro-filtered for maximum purity. Perfect for post-workout recovery and lean muscle building.",
    materials: ["100% Whey Protein Isolate", "Natural flavoring", "Stevia sweetener"],
    care: ["Store in a cool, dry place", "Mix with 200ml water or milk", "Consume within 30 minutes post-workout"],
    sizes: [
      { size: "1 KG", available: true },
      { size: "2 KG", available: true },
      { size: "5 KG", available: true },
    ],
    colors: [
      { name: "Chocolate", hex: "#3E2723", available: true },
      { name: "Vanilla", hex: "#F5F5DC", available: true },
      { name: "Strawberry", hex: "#C62828", available: true },
    ],
    details: ["25g protein per serving", "Low fat & low carb", "Fast absorption", "No added sugar"],
    madeIn: "India",
    quantity: "1 KG",
    flavors: ["Chocolate", "Vanilla", "Strawberry", "Mango"],
  },
  {
    id: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    price: 1299,
    category: "Performance",
    image: "/p3.jpeg",
    hoverImage: "/p4.jpeg",
    description: "Micronized for maximum absorption",
    longDescription:
      "Pharmaceutical-grade Creatine Monohydrate that's micronized for better solubility and absorption. Clinically proven to increase strength, power output, and muscle mass when combined with resistance training.",
    materials: ["100% Pure Creatine Monohydrate", "Micronized particles", "No fillers or additives"],
    care: ["Take 5g daily with water", "Loading phase: 20g/day for 5 days", "Stay well hydrated"],
    sizes: [
      { size: "250g", available: true },
      { size: "500g", available: true },
      { size: "1 KG", available: true },
    ],
    colors: [
      { name: "Unflavored", hex: "#FFFFFF", available: true },
      { name: "Fruit Punch", hex: "#C62828", available: true },
    ],
    details: ["5g per serving", "Micronized formula", "99.9% purity", "Lab tested"],
    madeIn: "India",
    quantity: "250g",
    flavors: ["Unflavored", "Fruit Punch"],
  },
  {
    id: "pre-workout-pro",
    name: "Pre-Workout Pro",
    price: 1899,
    category: "Pre-Workout",
    image: "/p5.jpeg",
    hoverImage: "/p1.jpeg",
    description: "Explosive energy and laser focus",
    longDescription:
      "Engineered for intense workouts, our Pre-Workout Pro delivers a potent blend of caffeine, beta-alanine, and citrulline malate for explosive energy, enhanced endurance, and skin-splitting pumps. Take your training to the next level.",
    materials: ["Caffeine Anhydrous (200mg)", "Beta-Alanine (3.2g)", "L-Citrulline Malate (6g)"],
    care: ["Mix 1 scoop with 250ml water", "Take 20-30 minutes before workout", "Do not exceed 2 scoops daily"],
    sizes: [
      { size: "30 Servings", available: true },
      { size: "60 Servings", available: true },
    ],
    colors: [
      { name: "Blue Raspberry", hex: "#1565C0", available: true },
      { name: "Watermelon", hex: "#C62828", available: true },
      { name: "Green Apple", hex: "#2E7D32", available: true },
    ],
    details: ["200mg caffeine", "Beta-alanine for endurance", "Citrulline for pumps", "No crash formula"],
    madeIn: "India",
    quantity: "30 Servings",
    flavors: ["Blue Raspberry", "Watermelon", "Green Apple"],
  },
  {
    id: "bcaa-recovery",
    name: "BCAA Recovery",
    price: 1599,
    category: "Recovery",
    image: "/p2.jpeg",
    hoverImage: "/p3.jpeg",
    description: "2:1:1 ratio for optimal recovery",
    longDescription:
      "Our BCAA Recovery formula features a scientifically-backed 2:1:1 ratio of Leucine, Isoleucine, and Valine. Enhanced with electrolytes and glutamine for faster recovery, reduced muscle soreness, and improved hydration during intense training.",
    materials: ["L-Leucine (3g)", "L-Isoleucine (1.5g)", "L-Valine (1.5g)", "Electrolyte blend"],
    care: ["Mix 1 scoop with 400ml water", "Sip during workout", "Can be taken on rest days too"],
    sizes: [
      { size: "30 Servings", available: true },
      { size: "60 Servings", available: true },
    ],
    colors: [
      { name: "Mango", hex: "#FF8F00", available: true },
      { name: "Grape", hex: "#6A1B9A", available: true },
      { name: "Lemon Lime", hex: "#9E9D24", available: true },
    ],
    details: ["2:1:1 BCAA ratio", "Added electrolytes", "Zero sugar", "Intra-workout formula"],
    madeIn: "India",
    quantity: "30 Servings",
  },
  {
    id: "mass-gainer-pro",
    name: "Mass Gainer Pro",
    price: 2999,
    category: "Weight Gain",
    image: "/p4.jpeg",
    hoverImage: "/p5.jpeg",
    description: "700 calories per serving for serious gains",
    longDescription:
      "Designed for hardgainers and those looking to pack on serious mass. Each serving delivers 700 calories, 50g protein, and a complex carb blend for sustained energy. Enhanced with digestive enzymes for easy absorption without bloating.",
    materials: ["Whey Protein Concentrate", "Complex Carbohydrate Blend", "MCT Oil", "Digestive Enzymes"],
    care: ["Mix 2 scoops with 500ml milk", "Best taken post-workout or between meals", "Can be used as a meal replacement"],
    sizes: [
      { size: "3 KG", available: true },
      { size: "5 KG", available: true },
    ],
    colors: [
      { name: "Chocolate", hex: "#3E2723", available: true },
      { name: "Banana", hex: "#FDD835", available: true },
      { name: "Cookies & Cream", hex: "#F5F5DC", available: false },
    ],
    details: ["700 cal per serving", "50g protein", "Complex carbs", "Digestive enzymes included"],
    madeIn: "India",
    quantity: "3 KG",
    flavors: ["Chocolate", "Banana", "Cookies & Cream"],
  },
  {
    id: "multivitamin-daily",
    name: "Multivitamin Daily",
    price: 899,
    category: "Vitamins",
    image: "/p1.jpeg",
    hoverImage: "/p2.jpeg",
    description: "Complete daily nutrition in one tablet",
    longDescription:
      "A comprehensive multivitamin formula containing 23 essential vitamins and minerals. Specifically designed for active lifestyles and athletes who need higher micronutrient intake. One tablet daily fills nutritional gaps and supports overall health.",
    materials: ["23 Vitamins & Minerals", "Antioxidant Complex", "Biotin & Zinc"],
    care: ["Take 1 tablet daily with breakfast", "Do not exceed recommended dose", "Store below 25°C"],
    sizes: [
      { size: "60 Tablets", available: true },
      { size: "120 Tablets", available: true },
    ],
    colors: [],
    details: ["23 essential nutrients", "One-a-day formula", "For active lifestyles", "No artificial colors"],
    madeIn: "India",
    quantity: "60 Tablets",
    flavors: ["Unflavored"],
  },
  {
    id: "casein-protein",
    name: "Casein Protein Night",
    price: 2799,
    category: "Protein",
    image: "/p3.jpeg",
    hoverImage: "/p4.jpeg",
    description: "Slow-release protein for overnight recovery",
    longDescription:
      "Micellar Casein Protein provides a slow, sustained release of amino acids over 7-8 hours. Perfect as a before-bed shake to fuel muscle recovery and prevent muscle breakdown while you sleep.",
    materials: ["100% Micellar Casein", "Natural cocoa", "Stevia"],
    care: ["Mix 1 scoop with 250ml milk", "Take 30 minutes before bed", "Shake or blend thoroughly"],
    sizes: [
      { size: "1 KG", available: true },
      { size: "2 KG", available: true },
    ],
    colors: [
      { name: "Rich Chocolate", hex: "#3E2723", available: true },
      { name: "Vanilla Dream", hex: "#F5F5DC", available: true },
    ],
    details: ["24g protein per scoop", "7-8 hour sustained release", "Low sugar", "Before-bed formula"],
    madeIn: "India",
    quantity: "1 KG",
  },
  {
    id: "fat-burner-extreme",
    name: "Fat Burner Extreme",
    price: 1499,
    category: "Weight Loss",
    image: "/p5.jpeg",
    hoverImage: "/p1.jpeg",
    description: "Thermogenic formula for accelerated fat loss",
    longDescription:
      "A powerful thermogenic formula combining green tea extract, caffeine, and L-carnitine for accelerated fat loss. Boosts metabolism, increases energy expenditure, and supports a lean physique when combined with diet and exercise.",
    materials: ["Green Tea Extract (500mg)", "Caffeine (150mg)", "L-Carnitine (1g)", "CLA"],
    care: ["Take 1 capsule with breakfast", "Take 1 capsule with lunch", "Do not take after 4 PM"],
    sizes: [
      { size: "60 Capsules", available: true },
      { size: "120 Capsules", available: true },
    ],
    colors: [],
    details: ["Thermogenic formula", "Boosts metabolism", "Natural ingredients", "No jitters"],
    madeIn: "India",
    quantity: "60 Capsules",
    flavors: ["Unflavored"],
  },
]

export const categories = ["All", "Protein", "Performance", "Pre-Workout", "Recovery", "Weight Gain", "Vitamins", "Weight Loss"]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const current = getProductById(currentId)
  if (!current) return products.slice(0, limit)

  const sameCategory = products.filter((p) => p.id !== currentId && p.category === current.category)
  const others = products.filter((p) => p.id !== currentId && p.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}
