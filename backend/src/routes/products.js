import { Router } from "express";

const router = Router();

const products = [
  { id: 1, name: "Rose Glow Serum", price: 129 },
  { id: 2, name: "Silk Matte Foundation", price: 149 },
  { id: 3, name: "Golden Hour Palette", price: 179 },
];

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

export default router;
