export default function Spinner({ size = 32 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} role="status" aria-label="טוען" />;
}
