export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 py-8  w-full">
      <div className="inline-block mx-6">{children}</div>
    </section>
  );
}
