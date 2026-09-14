// components/public/SectionHeading.tsx — reusable section title + optional text.

type Props = {
  /** One or two words leading the heading, used as a quiet descriptor. */
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Small brass rule above the heading — the section's moment of warmth. */
  bar?: boolean;
};

export default function SectionHeading({
  title,
  description,
  align = "center",
  bar = true,
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const barClass =
    align === "center"
      ? "mx-auto h-1 w-10 rounded-full bg-brand-accent"
      : "h-1 w-10 rounded-full bg-brand-accent";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      {bar ? <div className={`mt-4 ${barClass}`} aria-hidden="true" /> : null}
      {description ? (
        <p className={`mt-4 text-base text-text-secondary ${align === "center" ? "mx-auto max-w-xl" : ""}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}