"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Products() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError(true));
  }, []);

  return (
    <section>
      <h1 className="text-gold">{t("productsTitle")}</h1>
      {error && <p>API offline - start the backend server.</p>}
      {!error && !products && <p>{t("loading")}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {products?.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="text-gold" style={{ fontWeight: 700 }}>
              {t("price")}: ₪{product.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
