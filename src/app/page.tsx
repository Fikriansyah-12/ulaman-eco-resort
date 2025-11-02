"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TextScroll from "@/components/TextScroll";
import AboutImage from "@/components/AboutImage";

export default function VideoBackground() {
  const [showIframe, setShowIframe] = useState(false);
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowIframe(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const forcePlay = () => {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "playVideo", args: [] }),
      "*"
    );
  };

  const handleLoad = () => {
    setReady(true);
    forcePlay();
    setTimeout(forcePlay, 250);
    setTimeout(forcePlay, 800);
  };

  useEffect(() => {
    const onVis = () => document.visibilityState === "visible" && forcePlay();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const origin =
    typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";
  const EMBED =
    "https://www.youtube-nocookie.com/embed/pqkVOxt7Tk4" +
    `?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=pqkVOxt7Tk4&enablejsapi=1&origin=${origin}`;

  return (
    <main className="w-full">
      {/* === SECTION 1: HERO VIDEO === */}
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Poster (base layer) */}
        <Image
          src="/image/bg-home.avif"  // pastikan file ada di /public/image/bg-home.avif
          alt="Poster"
          fill
          priority
          className="object-cover"
        />

        {/* Video (overlay di atas poster) */}
        {showIframe && (
          <iframe
            ref={iframeRef}
            src={EMBED}
            title="hero-bg"
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={handleLoad}
            style={{
              transform: "scale(1.7)", // crop ala cover
              pointerEvents: "none",
              opacity: ready ? 1 : 0,
              transition: "opacity 400ms ease",
            }}
          />
        )}

      </section>

      <section className="w-full bg-[#F5EFE3]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <TextScroll />
          <AboutImage/>
        </div>
      </section>
    </main>
  );
}
