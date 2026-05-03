export function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="border-b border-border/60 bg-gradient-to-b from-cream/40 to-transparent">
      <div className="container-narrow py-16 sm:py-24">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
