"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  className?: string;
  duration?: number;     // durasi animasi (detik)
  easing?: string;       // ease GSAP, mis. "power2.inOut"
  autoplay?: boolean;    // auto jalan
  interval?: number;     // jeda autoplay (ms)
  variant?: "slide" | "fade"; // jenis transisi
  showDots?: boolean;
  showControls?: boolean;
}

export default function ImageCarousel({
  images,
  className,
  duration = 0.55,
  easing = "power2.inOut",
  autoplay = false,
  interval = 3500,
  variant = "slide",
  showDots = true,
  showControls = true,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  // refs DOM
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const currentImgRef = useRef<HTMLImageElement | null>(null);
  const nextImgRef = useRef<HTMLImageElement | null>(null);

  // state & guard
  const blockRef = useRef(false);                 // cegah spam klik saat animasi
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);        // kalau user interaksi, jeda autoplay sementara

  // swipe gesture
  const startX = useRef(0);
  const deltaX = useRef(0);
  const dragging = useRef(false);

  // === Animasi helper ===
  const animateTo = (nextIdx: number, dir: 1 | -1) => {
    if (blockRef.current) return;
    if (!currentImgRef.current || !nextImgRef.current) return;
    if (nextIdx === index) return;

    blockRef.current = true;
    userInteractedRef.current = true; // hentikan autoplay sementara

    const curr = currentImgRef.current;
    const next = nextImgRef.current;

    // set sumber gambar
    next.src = images[nextIdx] ?? "";

    // Reset posisi awal layer
    if (variant === "slide") {
      gsap.set(next, {
        xPercent: dir === 1 ? 20 : -20,
        opacity: 0,
        zIndex: 2,
        willChange: "transform, opacity",
      });
      gsap.set(curr, { xPercent: 0, opacity: 1, zIndex: 1, willChange: "transform, opacity" });
    } else {
      // fade-only
      gsap.set(next, { opacity: 0, zIndex: 2, willChange: "opacity" });
      gsap.set(curr, { opacity: 1, zIndex: 1, willChange: "opacity" });
    }

    const tl = gsap.timeline({
      defaults: { duration, ease: easing },
      onComplete: () => {
        // commit gambar current = next
        curr.src = next.src;
        gsap.set(curr, { xPercent: 0, opacity: 1, zIndex: 1, clearProps: "willChange" });
        gsap.set(next, { xPercent: 0, opacity: 0, zIndex: 0, clearProps: "willChange" });
        blockRef.current = false;
        setIndex(nextIdx);
      },
    });

    if (variant === "slide") {
      tl.to(curr, { xPercent: dir === 1 ? -15 : 15, opacity: 0 }, 0);
      tl.to(next, { xPercent: 0, opacity: 1 }, 0);
    } else {
      tl.to(curr, { opacity: 0 }, 0);
      tl.to(next, { opacity: 1 }, 0);
    }
  };

  const nextImage = () => {
    const nextIdx = (index + 1) % images.length;
    animateTo(nextIdx, 1);
  };
  const prevImage = () => {
    const nextIdx = (index - 1 + images.length) % images.length;
    animateTo(nextIdx, -1);
  };

  // === Preload awal current ===
  useEffect(() => {
    if (currentImgRef.current) {
      currentImgRef.current.src = images[0] ?? "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // === Autoplay ===
  const clearTimer = () => {
    if (autoplayTimer.current) {
      clearTimeout(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };
  const schedule = () => {
    if (!autoplay || images.length <= 1) return;
    clearTimer();
    autoplayTimer.current = setTimeout(() => {
      nextImage();
      schedule();
    }, interval);
  };

  useEffect(() => {
    schedule();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, interval, index, images.length]);

  // pause/resume saat pointer masuk/keluar
  const onMouseEnter = () => {
    clearTimer();
  };
  const onMouseLeave = () => {
    if (!userInteractedRef.current) schedule();
    // kalau user habis interaksi, delay 1 interval sebelum jalan lagi
    if (userInteractedRef.current) {
      setTimeout(() => {
        userInteractedRef.current = false;
        schedule();
      }, interval);
    }
  };

  // === Keyboard nav ===
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (blockRef.current) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  // === Swipe (pointer/touch) ===
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      deltaX.current = 0;
      el.setPointerCapture?.(e.pointerId);
      clearTimer();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      deltaX.current = e.clientX - startX.current;
      // geser “live” sedikit biar terasa
      if (!currentImgRef.current || !nextImgRef.current) return;
      if (Math.abs(deltaX.current) < 6) return;
      const dir: 1 | -1 = deltaX.current < 0 ? 1 : -1; // geser kiri → next, geser kanan → prev
      gsap.set(nextImgRef.current, {
        xPercent: dir === 1 ? 20 : -20,
        opacity: 0.0001,
        zIndex: 2,
      });
      gsap.set(currentImgRef.current, {
        xPercent: (deltaX.current / el.clientWidth) * 20,
      });
    };
    const onPointerUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const threshold = (el.clientWidth || 1) * 0.1; // 10% lebar
      const traveled = deltaX.current;

      // reset live transform
      gsap.set(currentImgRef.current, { xPercent: 0 });

      if (Math.abs(traveled) > threshold) {
        if (traveled < 0) nextImage();
        else prevImage();
      } else {
        // snap balik kalau kurang threshold
        gsap.to(currentImgRef.current, { xPercent: 0, duration: 0.2, ease: "power1.out" });
        schedule();
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  return (
    <div
      className={`group relative overflow-hidden rounded-md ${className ?? ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="region"
      aria-label="image carousel"
    >
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden bg-neutral-200 aspect-[2/3]"
      >
        {/* layer current */}
        <img
          ref={currentImgRef}
          alt={`Slide ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover select-none"
          draggable={false}
        />
        {/* layer incoming */}
        <img
          ref={nextImgRef}
          alt="incoming"
          className="absolute inset-0 w-full h-full object-cover select-none"
          draggable={false}
          style={{ opacity: 0 }}
        />
      </div>

      {/* Controls */}
      {showControls && (
        <div
          className="
            pointer-events-none absolute bottom-7 left-0 z-20 w-full px-4
            flex justify-between
            md:opacity-0 md:group-hover:opacity-100
            transition-opacity duration-200
          "
        >
          <button
            onClick={prevImage}
            className="pointer-events-auto bg-[#ede6d966] text-white border-white border-2 px-4 py-4 rounded-md transition hover:opacity-100 opacity-80"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextImage}
            className="pointer-events-auto  bg-[#ede6d966] border-[#ede6d8] border-2 text-white px-4 py-4 rounded-md transition hover:opacity-100 opacity-80"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === index) return;
                const dir: 1 | -1 = i > index ? 1 : -1;
                animateTo(i, dir);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
