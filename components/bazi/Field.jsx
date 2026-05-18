export function Field({ label, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
