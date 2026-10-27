"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MessageFavorite, Heart, Cake, Diamonds, Gift, Gallery, Sms } from "iconsax-react";

/**
 * Section "Où coller votre QR Code" — mosaïque de supports physiques
 * + mini-démo interactive du moment de découverte.
 *
 * ⚠️ PLACEHOLDERS À REMPLACER (signalés 📷) : les 5 photos de la mosaïque
 * doivent devenir de vraies photos des supports (bijou, cadre, cadeau,
 * carte, bouquet) avec le QR Code visible dessus.
 */

const SUPPORTS = [
    {
        label: "Bijou & collier",
        caption: "Un éclat qui dure",
        icon: Diamonds,
        img: "/images/bijoux.jpg",
        spanClass: "col-span-2 row-span-2",
    },
    {
        label: "Cadre & tableau",
        caption: "Accroché pour toujours",
        icon: Gallery,
        img: "/images/cardre.jpg",
        spanClass: "col-span-2 row-span-1",
    },
    {
        label: "Cadeau emballé",
        caption: "Une surprise en plus",
        icon: Gift,
        img: "/images/cadeau.jpg",
        spanClass: "col-span-1 row-span-1",
    },
    {
        label: "Carte",
        caption: "Un mot qui reste",
        icon: Sms,
        img: "/images/carte.jpg",
        spanClass: "col-span-1 row-span-1",
    },
    {
        label: "Bouquet de fleurs",
        caption: "Une attention en plus",
        icon: Heart,
        img: "/images/bouquet.jpg",
        spanClass: "col-span-2 row-span-1",
    },
];


const CONFETTI_COLORS = [
    "var(--color-joie)",
    "var(--color-amour)",
    "var(--color-gratitude)",
    "var(--color-tendresse)",
    "var(--color-bonheur)",
];

/** Petite explosion de particules colorées, jouée une seule fois à l'ouverture. */
function ConfettiBurst() {
    const particles = Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const distance = 70 + Math.random() * 40;
        return {
            id: i,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            rotate: Math.random() * 360,
        };
    });

    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {particles.map((p) => (
                <m.span
                    key={p.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.4, rotate: p.rotate }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute h-2 w-2 rounded-[2px]"
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
}
const FLOATING_OCCASIONS = [
    { icon: Cake, label: "Anniversaire", bg: "#FFF4D6", fg: "#78350f", position: "left-2 top-4" },
    { icon: Diamonds, label: "Mariage", bg: "#DCF7F1", fg: "#134e4a", position: "right-4 top-16" },
    { icon: Gift, label: "Merci", bg: "#F0E7FE", fg: "#4c1d95", position: "left-8 bottom-10" },
    { icon: Heart, label: "Déclaration", bg: "#FFE3EC", fg: "#831843", position: "right-2 bottom-2" },
];

const REACTIONS = [
    { emoji: "❤️", label: "Aimer" },
    { emoji: "🙏", label: "Merci" },
    { emoji: "😊", label: "Sourire" },
];

/** Barre de réactions type réseau social, avec petit feedback au tap. */
function ReactionBar() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="relative flex items-center gap-2">
            {REACTIONS.map((reaction) => (
                <m.button
                    key={reaction.label}
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setSelected(reaction.label)}
                    aria-label={reaction.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-base transition-colors"
                    style={{
                        backgroundColor:
                            selected === reaction.label ? "var(--color-amour)26" : "var(--color-paper-100)",
                    }}
                >
                    {reaction.emoji}
                </m.button>
            ))}
        </div>
    );
}

const MESSAGE_WORDS =
    "Joyeux anniversaire ! Que cette année t'apporte tout ce que tu mérites. Je pense fort à toi. 💛".split(
        " "
    );

/** Mini-démo interactive : reproduit le moment exact vécu par le destinataire. */
function PhoneDemo() {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="relative mx-auto w-full max-w-[240px]">
            <div className="relative aspect-[9/18] w-full overflow-hidden rounded-[2rem] border border-ink-100 bg-paper-50 shadow-float">
                <AnimatePresence mode="wait">
                    {!revealed ? (
                        <m.div
                            key="closed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative flex h-full flex-col items-center justify-between p-6 text-center"
                            style={{ backgroundColor: "var(--color-amour)14" }}
                        >
                            {/* Motifs décoratifs en fond, cohérents avec l'écran ouvert */}
                            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                                <Heart
                                    size={70}
                                    variant="Bold"
                                    color="var(--color-amour)"
                                    style={{ position: "absolute", top: "10%", right: "-12%", opacity: 0.12, transform: "rotate(14deg)" }}
                                />
                                <Heart
                                    size={36}
                                    variant="Bold"
                                    color="var(--color-amour)"
                                    style={{ position: "absolute", bottom: "16%", left: "-6%", opacity: 0.12, transform: "rotate(-10deg)" }}
                                />
                            </div>

                            {/* Badge occasion, identique à l'écran ouvert pour la continuité */}
                            <span
                                className="relative inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                                style={{ backgroundColor: "var(--color-amour)" }}
                            >
                                Anniversaire
                            </span>

                            {/* Contenu central */}
                            <div className="relative flex flex-col items-center gap-5">
                                <div className="relative flex h-20 w-20 items-center justify-center">
                                    {/* Anneau qui pulse doucement, pour donner envie de cliquer */}
                                    <m.span
                                        animate={{ scale: [1, 1.4], opacity: [0.35, 0] }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: "var(--color-amour)" }}
                                    />
                                    <span
                                        className="relative flex h-16 w-16 items-center justify-center rounded-full"
                                        style={{ backgroundColor: "var(--color-amour)26" }}
                                    >
                                        <MessageFavorite size={28} variant="Bold" color="var(--color-amour)" />
                                    </span>
                                </div>

                                <div>
                                    <p className="text-base font-semibold text-ink-950">
                                        Un message vous attend
                                    </p>
                                    <p className="mt-1 text-xs text-ink-500">
                                        De la part de Léa
                                    </p>
                                </div>
                            </div>

                            <Button size="sm" onClick={() => setRevealed(true)} className="relative">
                                Découvrir
                            </Button>
                        </m.div>
                    ) : (
                        <m.div
                            key="open"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative flex h-full flex-col items-center justify-between p-6 text-center"
                            style={{ backgroundColor: "var(--color-amour)14" }}
                        >
                            {/* Motifs décoratifs en fond */}
                            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                                <Heart
                                    size={70}
                                    variant="Bold"
                                    color="var(--color-amour)"
                                    style={{ position: "absolute", top: "8%", left: "-10%", opacity: 0.12, transform: "rotate(-12deg)" }}
                                />
                                <Heart
                                    size={40}
                                    variant="Bold"
                                    color="var(--color-amour)"
                                    style={{ position: "absolute", bottom: "12%", right: "-5%", opacity: 0.12, transform: "rotate(18deg)" }}
                                />
                            </div>

                            <ConfettiBurst />

                            {/* Badge occasion */}
                            <span
                                className="relative inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                                style={{ backgroundColor: "var(--color-amour)" }}
                            >
                                Anniversaire
                            </span>

                            {/* Contenu principal */}
                            <div className="relative flex flex-col items-center gap-4">
                                <span
                                    className="flex h-14 w-14 items-center justify-center rounded-full"
                                    style={{ backgroundColor: "var(--color-amour)26" }}
                                >
                                    <Heart size={26} variant="Bold" color="var(--color-amour)" />
                                </span>

                                {/* Texte révélé mot par mot */}
                                <p className="flex flex-wrap justify-center gap-x-1.5 text-sm font-medium leading-relaxed text-ink-950">
                                    {MESSAGE_WORDS.map((word, i) => (
                                        <m.span
                                            key={i}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                                        >
                                            {word}
                                        </m.span>
                                    ))}
                                </p>
                            </div>

                            {/* Réactions + signature */}
                            <div className="relative flex flex-col items-center gap-3">
                                <ReactionBar />
                                <span className="text-xs font-semibold text-ink-500">Léa</span>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export function PhysicalExperience() {
    return (
        <section id="exemples" className="py-20 sm:py-28">
            <Container>
                <div className="mx-auto max-w-xl text-center">
                    <m.span
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-xs font-semibold uppercase tracking-wide text-ink-300"
                    >
                        Au-delà de l&apos;écran
                    </m.span>
                    <m.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
                        className="mt-2 text-3xl font-semibold tracking-tighter text-ink-950 sm:text-4xl"
                    >
                        Collez-le sur ce que vous offrez déjà
                    </m.h2>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className="mt-4 text-base text-ink-500 sm:text-lg"
                    >
                        Un bijou, un cadre, un bouquet, un simple emballage — votre
                        message les accompagne partout où vous les collez.
                    </m.p>
                </div>

                {/* Mosaïque des supports physiques */}
                <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 auto-rows-[160px] gap-4 sm:auto-rows-[190px] sm:gap-5">
                    {SUPPORTS.map((support, index) => (
                        <m.div
                            key={support.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                            className={`group relative overflow-hidden rounded-3xl shadow-soft transition-shadow duration-300 hover:shadow-float ${support.spanClass}`}
                        >
                            {/* Image avec léger zoom au survol */}
                            <img
                                src={support.img}
                                alt={`Le QR Code appliqué sur : ${support.label}`}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                            />

                            {/* Dégradé sombre en bas — pour la lisibilité du texte, technique éditoriale classique */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(to top, rgba(10,10,12,0.75) 0%, rgba(10,10,12,0.15) 45%, transparent 70%)",
                                }}
                            />

                            {/* Badge icône, en haut à droite */}
                            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                                <support.icon size={15} variant="Bold" color="var(--color-ink-950)" />
                            </span>

                            {/* Texte, en bas */}
                            <div className="absolute inset-x-0 bottom-0 p-4">
                                <p className="text-sm font-semibold text-white sm:text-base">
                                    {support.label}
                                </p>
                                <p className="mt-0.5 text-xs text-white/70">{support.caption}</p>
                            </div>
                        </m.div>
                    ))}
                </div>

                {/* Mini-démo du moment de découverte */}
                <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-16 flex flex-col items-center gap-6 sm:mt-20"
                >
                    <p className="max-w-xs text-center text-sm text-ink-500">
                        Et à chaque scan, la même émotion, exactement comme si vous étiez là.
                    </p>

                    {/* Desktop : pastilles flottantes autour du téléphone */}
                    <div className="relative hidden w-full max-w-2xl py-6 lg:block">
                        {FLOATING_OCCASIONS.map((item, i) => (
                            <m.span
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: [0, -6, 0] }}
                                viewport={{ once: true }}
                                transition={{
                                    opacity: { duration: 0.5, delay: i * 0.1 },
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
                                }}
                                className={`absolute flex select-none items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold shadow-soft ${item.position}`}
                                style={{ backgroundColor: item.bg, color: item.fg }}
                            >
                                <item.icon size={14} variant="Bold" color={item.fg} />
                                {item.label}
                            </m.span>
                        ))}

                        <PhoneDemo />
                    </div>

                    {/* Mobile/tablette : téléphone seul, puis pastilles statiques en dessous */}
                    <div className="flex flex-col items-center gap-6 lg:hidden">
                        <PhoneDemo />
                        <div className="flex flex-wrap justify-center gap-2">
                            {FLOATING_OCCASIONS.map((item) => (
                                <span
                                    key={item.label}
                                    className="flex select-none items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                                    style={{ backgroundColor: item.bg, color: item.fg }}
                                >
                                    <item.icon size={12} variant="Bold" color={item.fg} />
                                    {item.label}
                                </span>
                            ))}
                            {/* Pastille "et bien d'autres" — cohérente avec la section Occasions */}
                            <span className="flex select-none items-center rounded-full bg-paper-100 px-3 py-1.5 text-xs font-semibold text-ink-500">
                                …
                            </span>
                        </div>
                    </div>
                </m.div>
            </Container>
        </section>
    );
}