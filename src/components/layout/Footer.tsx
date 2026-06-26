// Minimal dark footer.
export function Footer() {
  return (
    <footer
      className="border-t py-12"
      style={{ backgroundColor: "#111111", borderColor: "rgba(255,255,255,0.1)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between md:px-10">
        <img
          src="/logio.png"
          alt="Trippin'"
          className="h-7 w-auto"
          style={{ filter: "invert(1) brightness(2)" }}
        />
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter" }}>
          Built at hackathon 2026
        </p>
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter" }}>
          trippin.app
        </p>
      </div>
    </footer>
  );
}
