"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SkillAnalysis } from "@/lib/types";

interface Props {
  skills: SkillAnalysis[];
}

export default function RadarChart({ skills }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !skills.length) return;
    const el = ref.current;
    d3.select(el).selectAll("*").remove();

    // Increase size so labels fit better
    const size = 320; 
    const cx = size / 2;
    const cy = size / 2;
    const R = 90; // slightly smaller relative to size to fit big labels
    const data = skills.slice(0, 8);
    const N = data.length;
    if (N < 2) return;

    const levelVal = (s: string) =>
      s === "advanced" ? 1 : s === "intermediate" ? 0.6 :
      s === "beginner" ? 0.3 : 0;

    // Neon variants for graph nodes
    const statusColor = (s: string) =>
      s === "present" ? "#34d399" : s === "partial" ? "#fbbf24" : "#f87171";

    const svg = d3.select(el)
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("overflow", "visible"); // Ensure labels don't clip

    const defs = svg.append("defs");
    
    // Core radial gradient
    const grad = defs.append("radialGradient").attr("id", "rg-skillpath");
    grad.append("stop").attr("offset", "0%")
      .attr("stop-color", "#f97316").attr("stop-opacity", 0.3);
    grad.append("stop").attr("offset", "100%")
      .attr("stop-color", "#f97316").attr("stop-opacity", 0.05);

    // Filter for node glow
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Grid rings (web)
    [0.25, 0.5, 0.75, 1].forEach(r => {
      const pts = data.map((_, i) => {
        const a = (i / N) * 2 * Math.PI - Math.PI / 2;
        return [cx + r * R * Math.cos(a), cy + r * R * Math.sin(a)];
      });
      svg.append("polygon")
        .attr("points", pts.map(p => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.08)")
        .attr("stroke-width", 1);
    });

    // Spokes
    data.forEach((_, i) => {
      const a = (i / N) * 2 * Math.PI - Math.PI / 2;
      svg.append("line")
        .attr("x1", cx).attr("y1", cy)
        .attr("x2", cx + R * Math.cos(a))
        .attr("y2", cy + R * Math.sin(a))
        .attr("stroke", "rgba(255,255,255,0.08)")
        .attr("stroke-width", 1);
    });

    // Required level polygon (dashed target)
    const reqPts = data.map((s, i) => {
      const a = (i / N) * 2 * Math.PI - Math.PI / 2;
      // All required skills default to 'advanced' equivalent for the target visual
      const r = levelVal("advanced");
      return [cx + r * R * Math.cos(a), cy + r * R * Math.sin(a)];
    });
    
    svg.append("polygon")
      .attr("points", reqPts.map(p => p.join(",")).join(" "))
      .attr("fill", "rgba(249,115,22,0.05)")
      .attr("stroke", "rgba(249,115,22,0.4)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4 4");

    // Candidate polygon
    const candPts = data.map((s, i) => {
      const a = (i / N) * 2 * Math.PI - Math.PI / 2;
      // Convert qualitative status to quantitative radius
      const r = levelVal(
        s.status === "present" ? "advanced" :
        s.status === "partial" ? "intermediate" : "beginner"
      );
      return [cx + r * R * Math.cos(a), cy + r * R * Math.sin(a)];
    });
    
    svg.append("polygon")
      .attr("points", candPts.map(p => p.join(",")).join(" "))
      .attr("fill", "url(#rg-skillpath)")
      .attr("stroke", "#f97316")
      .attr("stroke-width", 2.5)
      .style("filter", "url(#glow)")
      .style("mix-blend-mode", "screen");

    // Glowy Dots for Candidate Current Stats
    candPts.forEach((p, i) => {
      const c = statusColor(data[i].status);
      // Glow underlay
      svg.append("circle")
        .attr("cx", p[0]).attr("cy", p[1]).attr("r", 10)
        .attr("fill", c)
        .attr("opacity", 0.4)
        .attr("pointer-events", "none")
        .style("filter", "blur(4px)");

      // Core dot
      svg.append("circle")
        .attr("cx", p[0]).attr("cy", p[1]).attr("r", 4.5)
        .attr("fill", c)
        .attr("stroke", "#080810") // match dark bg
        .attr("stroke-width", 1.5)
        .append("title")
        .text(`${data[i].skill} — ${data[i].status.toUpperCase()}`);
    });

    // Enhanced Nomenclature (Labels)
    data.forEach((s, i) => {
      const a = (i / N) * 2 * Math.PI - Math.PI / 2;
      const radiusOffset = 24;
      const lx = cx + (R + radiusOffset) * Math.cos(a);
      const ly = cy + (R + radiusOffset) * Math.sin(a);
      
      let anchor = "middle";
      if (Math.cos(a) > 0.1) anchor = "start";
      else if (Math.cos(a) < -0.1) anchor = "end";

      let dx = anchor === "start" ? 2 : anchor === "end" ? -2 : 0;
      let dy = Math.sin(a) > 0.1 ? 4 : Math.sin(a) < -0.1 ? -4 : 0;

      svg.append("text")
        .attr("x", lx + dx).attr("y", ly + dy)
        .attr("text-anchor", anchor)
        .attr("dominant-baseline", "middle")
        .attr("font-size", 10)
        .attr("font-weight", 700)
        .attr("font-family", "var(--font-mono), monospace")
        .attr("fill", "#f8fafc")
        .style("text-shadow", "0 0 10px rgba(248,250,252,0.5)")
        .text(s.skill.toUpperCase());
    });

    // Enhanced Legend
    const leg = [
      ["Candidate Actual", "#f97316", false], 
      ["Target Requirement", "rgba(249,115,22,0.6)", true]
    ];
    leg.forEach(([label, col, dashed], i) => {
      const g = svg.append("g").attr("transform", `translate(5,${size - 25 + i * 14})`);
      g.append("line").attr("x1", 0).attr("y1", 0)
        .attr("x2", 16).attr("y2", 0)
        .attr("stroke", col as string)
        .attr("stroke-width", dashed ? 1.5 : 2.5)
        .attr("stroke-dasharray", dashed ? "4 3" : "none");
      g.append("text").attr("x", 24).attr("y", 4)
        .attr("font-size", 9)
        .attr("font-weight", 600)
        .attr("font-family", "var(--font-mono), monospace")
        .attr("fill", "#94a3b8")
        .text(label as string);
    });
  }, [skills]);

  return (
    <div className="w-full flex justify-center items-center">
      <svg
        ref={ref}
        className="w-full max-w-[340px] drop-shadow-[0_0_20px_rgba(249,115,22,0.05)]"
      />
    </div>
  );
}
