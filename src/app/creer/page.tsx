"use client";

import { CreateHeader } from "@/components/create/create-header";
import { ProgressSteps } from "@/components/create/progress-steps";
import { OccasionCard } from "@/components/create/occasion-card";
import { Container } from "@/components/ui/container";
import { OCCASIONS } from "@/lib/occasions";

/**
 * Étape 1 du parcours de création : choix de l'occasion.
 * Seule "Anniversaire" est disponible pour l'instant (8 thèmes prêts) —
 * les autres occasions du cahier des charges viendront s'ajouter au fur
 * et à mesure, chacune avec ses propres thèmes.
 */
export default function CreerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CreateHeader />

      <div className="mt-4">
        <ProgressSteps current={1} />
      </div>

      <Container className="flex flex-1 flex-col items-center py-12 sm:py-16">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-tighter text-ink-950 sm:text-4xl">
            Pour quelle occasion ?
          </h1>
          <p className="mt-3 text-base text-ink-500">
            Choisissez le moment que vous voulez célébrer.
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {OCCASIONS.map((occasion, index) => (
            <OccasionCard key={occasion.slug} occasion={occasion} index={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}