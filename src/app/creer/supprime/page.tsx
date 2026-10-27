import Link from "next/link";
import { Trash } from "iconsax-react";
import { Container } from "@/components/ui/container";

export default function DeletedPage() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center gap-5 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-100">
        <Trash size={28} variant="Bold" color="var(--color-ink-300)" />
      </span>
      <div>
        <h1 className="text-xl font-semibold text-ink-950">Message supprimé</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-500">
          Ce message a été définitivement supprimé et n&apos;existe plus.
        </p>
      </div>
      <Link
        href="/creer"
        className="mt-2 rounded-full bg-[var(--color-brand-500)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-600)]"
      >
        Créer un nouveau message
      </Link>
    </Container>
  );
}