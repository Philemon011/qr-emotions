import { notFound } from "next/navigation";
import { CreateHeader } from "@/components/create/create-header";
import { ProgressSteps } from "@/components/create/progress-steps";
import { ThemeCard } from "@/components/create/theme-card";
import { Container } from "@/components/ui/container";
import { getOccasion } from "@/lib/occasions";

/**
 * Étape 2 du parcours : choix du thème, pour l'occasion sélectionnée.
 * `notFound()` si le slug d'occasion dans l'URL n'existe pas — évite
 * d'afficher une page vide/cassée sur une URL invalide.
 */
export default async function OccasionPage({
  params,
}: {
  params: Promise<{ occasion: string }>;
}) {
  const { occasion: occasionSlug } = await params;
  const occasion = getOccasion(occasionSlug);

  if (!occasion) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CreateHeader backHref="/creer" />

      <div className="mt-4">
        <ProgressSteps current={2} />
      </div>

      <Container className="flex flex-1 flex-col items-center py-12 sm:py-16">
        <div className="max-w-md text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: occasion.color }}
          >
            {occasion.emoji} {occasion.label}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tighter text-ink-950 sm:text-4xl">
            Quel style vous ressemble ?
          </h1>
          <p className="mt-3 text-base text-ink-500">
            Chaque thème a sa propre ambiance — choisissez celle qui correspond au moment.
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {occasion.themes.map((theme, index) => (
            <ThemeCard
              key={theme.slug}
              occasionSlug={occasion.slug}
              theme={theme}
              index={index}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}