export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mx-auto">
      <div className="inline-block max-w-xl text-center justify-center">
        {children}
      </div>
    </section>
  );
}
