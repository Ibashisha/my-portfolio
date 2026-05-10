"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rx = useRef(0);
  const ry = useRef(0);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const onMove = (e: MouseEvent) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };

    document.addEventListener("mousemove", onMove);

    // Smooth ring lerp
    let animId: number;
    const lerp = () => {
      const dx = parseFloat(dot.style.left || "0");
      const dy = parseFloat(dot.style.top || "0");
      rx.current += (dx - rx.current) * 0.12;
      ry.current += (dy - ry.current) * 0.12;
      ring.style.left = rx.current + "px";
      ring.style.top = ry.current + "px";
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);

    // Hover Expand
    const interactables = "a, button, .skill-card, .project-card, .nav-link";
    const onEnter = () => {
      dot.classList.add("hovered");
      ring.classList.add("hovered");
    };
    const onLeave = () => {
      dot.classList.remove("hovered");
      ring.classList.remove("hovered");
    };

    const attach = () => {
      document.querySelectorAll<HTMLElement>(interactables).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();

    // Re-attach on DOM changes (for dynamic content)
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    // Change color on hover over text
    const textNodes = document.querySelectorAll(".text-zone");

    const onTextEnter = () => {
      dot.classList.add("text-hover");
      ring.classList.add("text-hover");
    };

    const onTextLeave = () => {
      dot.classList.remove("text-hover");
      ring.classList.remove("text-hover");
    };

    textNodes.forEach((el) => {
      el.addEventListener("mouseenter", onTextEnter);
      el.addEventListener("mouseleave", onTextLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
      mo.disconnect();

      textNodes.forEach((el) => {
        el.removeEventListener("mouseenter", onTextEnter);
        el.removeEventListener("mouseleave", onTextLeave);
      });
    };
  }, []);

  return (
    <>
      <h1 className="text-zone">Portfolio</h1>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
