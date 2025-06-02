export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js and ShadCN UI.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} NFT Showcase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
