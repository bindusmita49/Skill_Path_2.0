"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { PathwayCourse } from "@/lib/types";

interface Props {
  courses: PathwayCourse[];
  onCourseClick?: (index: number) => void;
}

export default function PathwayTimeline({ courses, onCourseClick }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !courses.length) return;
    const el = ref.current;
    d3.select(el).selectAll("*").remove();

    const W = el.parentElement?.clientWidth || 600;
    const H = 130;
    const nodeR = 22;
    const padding = 50;
    const spacing = Math.min(110, (W - padding * 2) / Math.max(courses.length - 1, 1));
    const cy = H / 2 - 8;

    const levelColor = (l: string) =>
      l === "beginner" ? "#10b981" :
      l === "intermediate" ? "#f59e0b" : "#ef4444";

    const cx = (i: number) => padding + i * spacing;

    const svg = d3.select(el)
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("height", H);

    const defs = svg.append("defs");

    // Gradient connectors
    courses.forEach((c, i) => {
      if (i >= courses.length - 1) return;
      const grd = defs.append("linearGradient")
        .attr("id", `lg-sp-${i}`)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
      grd.append("stop").attr("offset", "0%")
        .attr("stop-color", levelColor(c.level))
        .attr("stop-opacity", 0.5);
      grd.append("stop").attr("offset", "100%")
        .attr("stop-color", levelColor(courses[i + 1].level))
        .attr("stop-opacity", 0.5);
      svg.append("line")
        .attr("x1", cx(i) + nodeR).attr("y1", cy)
        .attr("x2", cx(i + 1) - nodeR).attr("y2", cy)
        .attr("stroke", `url(#lg-sp-${i})`)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5 3");
    });

    // Nodes
    courses.forEach((course, i) => {
      const col = levelColor(course.level);
      const g = svg.append("g")
        .attr("transform", `translate(${cx(i)},${cy})`)
        .style("cursor", "pointer")
        .on("click", () => onCourseClick?.(i));

      // Glow halo
      g.append("circle").attr("r", nodeR + 6)
        .attr("fill", col).attr("opacity", 0.08);

      // Main circle
      g.append("circle").attr("r", nodeR)
        .attr("fill", "var(--color-bg, #f5f3ec)")
        .attr("stroke", col).attr("stroke-width", 2);

      // Number
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "var(--font-display), sans-serif")
        .attr("font-size", 12).attr("font-weight", 700)
        .attr("fill", col)
        .text(String(i + 1));

      // Title below
      const words = course.title.split(" ").slice(0, 3).join(" ");
      g.append("text")
        .attr("y", nodeR + 14)
        .attr("text-anchor", "middle")
        .attr("font-size", 7.5)
        .attr("font-family", "var(--font-body), sans-serif")
        .attr("fill", "currentColor")
        .attr("opacity", 0.55)
        .text(words + (course.title.split(" ").length > 3 ? "…" : ""));

      // Duration above
      g.append("text")
        .attr("y", -nodeR - 7)
        .attr("text-anchor", "middle")
        .attr("font-size", 7.5)
        .attr("font-family", "var(--font-body), sans-serif")
        .attr("fill", col)
        .text(course.duration);

      // Hover
      g.on("mouseover", function () {
        d3.select(this).select("circle:nth-child(2)")
          .attr("fill", col).attr("fill-opacity", 0.15);
      }).on("mouseout", function () {
        d3.select(this).select("circle:nth-child(2)")
          .attr("fill", "var(--color-bg, #f5f3ec)")
          .attr("fill-opacity", 1);
      });
    });
  }, [courses, onCourseClick]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={ref} className="w-full" />
    </div>
  );
}
