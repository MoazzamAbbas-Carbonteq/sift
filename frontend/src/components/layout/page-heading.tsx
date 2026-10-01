export function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
