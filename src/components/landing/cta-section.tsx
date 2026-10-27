"use client";

import { m } from "framer-motion";
import { ArrowRight } from "iconsax-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * CTA final — bloc plein écran en couleur de marque (violet uni,
 * sans dégradé), pour marquer une vraie rupture visuelle avant le footer
 * et donner un dernier élan avant de quitter la page.
 */
export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 rounded-[2rem] bg-[var(--color-brand-500)] px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <h2 className="max-w-lg text-3xl font-semibold tracking-tighter text-white sm:text-4xl lg:text-5xl">
            Votre prochain moment commence par un mot
          </h2>
          <p className="max-w-sm text-base text-white/80 sm:text-lg">
            Gratuit pour créer votre premier message. Aucun compte requis.
          </p>
          <Button
            size="lg"
            asChild
            className="mt-2 gap-2 border-none bg-white text-[var(--color-brand-500)] hover:bg-white/90"
          >
            <Link href="/creer">
              Créer mon message
              <ArrowRight size={18} variant="Linear" color="var(--color-brand-500)" />
            </Link>
          </Button>
        </m.div>
      </Container>
    </section>
  );
}