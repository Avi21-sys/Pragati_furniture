// components/public/SectionHeading.tsx — reusable section title + optional text.

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base text-brand-text-muted">{description}</p>
      ) : null}
    </div>
  );
}