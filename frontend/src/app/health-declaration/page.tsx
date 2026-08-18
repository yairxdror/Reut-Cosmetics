import HealthDeclarationForm from "@/components/HealthDeclarationForm";

export default function HealthDeclarationPage() {
  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        הצהרת בריאות
      </h1>
      <p style={{ textAlign: "center" }}>
        <span className="form-required">*</span> שאלות המסומנות בכוכבית אדומה הן שאלות חובה.
      </p>
      <HealthDeclarationForm />
    </section>
  );
}
