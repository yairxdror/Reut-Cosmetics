import AccessibilityStatement from "@/components/AccessibilityStatement";

export default function AccessibilityPage() {
  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        הצהרת נגישות
      </h1>
      <AccessibilityStatement />
    </section>
  );
}
