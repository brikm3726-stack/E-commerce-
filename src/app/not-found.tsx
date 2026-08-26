import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-5">Erreur 404</p>

      <h1 className="display text-[clamp(3.5rem,16vw,9rem)] leading-none">
        <span className="bg-gradient-to-b from-fg to-fg-3 bg-clip-text text-transparent">
          404
        </span>
      </h1>

      <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-2">
        Cette page n’existe pas ou n’existe plus. Le produit que vous cherchiez a
        peut-être été vendu — notre stock change vite.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link href="/sneakers" className="btn btn-primary">
          Voir la collection
          <ArrowRight size={15} />
        </Link>
        <Link href="/" className="btn btn-secondary">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
