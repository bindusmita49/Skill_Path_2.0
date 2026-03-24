"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { analyzeResume } from "@/lib/api";
import { AnalysisResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import RadarChart from "@/components/RadarChart";
import PathwayTimeline from "@/components/PathwayTimeline";

export default function LiveDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [status, setStatus] = useState<"idle" | "upload_error" | "parsing" | "analyzing" | "generating" | "success" | "api_error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [activeCourse, setActiveCourse] = useState<number>(0);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setStatus("idle");
      setErrorMsg("");
    } else {
      setStatus("upload_error");
      setErrorMsg("Please upload a PDF file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setStatus("idle");
      setErrorMsg("");
    } else {
      setStatus("upload_error");
      setErrorMsg("Please upload a PDF file.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setStatus("upload_error");
      setErrorMsg("Resume missing.");
      return;
    }
    if (!jd.trim()) {
      setStatus("upload_error");
      setErrorMsg("Job Description missing.");
      return;
    }

    let tAnalyzing: ReturnType<typeof setTimeout> | undefined;
    let tGenerating: ReturnType<typeof setTimeout> | undefined;
    try {
      setStatus("parsing");
      tAnalyzing = setTimeout(() => setStatus("analyzing"), 1500);
      tGenerating = setTimeout(() => setStatus("generating"), 3500);

      const data = await analyzeResume(file, jd);
      clearTimeout(tAnalyzing);
      clearTimeout(tGenerating);
      console.log("API RESPONSE:", JSON.stringify(data).slice(0, 500));
      setResult(data);
      setStatus("success");
    } catch (err: any) {
      if (tAnalyzing) clearTimeout(tAnalyzing);
      if (tGenerating) clearTimeout(tGenerating);
      console.error("FULL ERROR:", err);
      setStatus("api_error");
      setErrorMsg(err.message || "An error occurred");
    }
  };

  return (
    <section id="demo" className="py-24 bg-bg dark:bg-bg-dark border-t border-ruler">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
          Experience the <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">Engine</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          
          {/* Input Panel */}
          <div className="bg-white/60 dark:bg-ink/60 border border-ruler backdrop-blur hover-card rounded-2xl p-8 shadow-xl flex flex-col gap-6">
            <h3 className="font-display font-bold uppercase tracking-widest text-sm text-ink-muted">1. Input Context</h3>
            
            <div 
              ref={dropRef}
              onDragOver={(e) => { e.preventDefault(); dropRef.current?.classList.add("border-accent", "bg-accent/10", "scale-[1.02]", "shadow-[0_0_30px_rgba(249,115,22,0.15)]"); }}
              onDragLeave={(e) => { e.preventDefault(); dropRef.current?.classList.remove("border-accent", "bg-accent/10", "scale-[1.02]", "shadow-[0_0_30px_rgba(249,115,22,0.15)]"); }}
              onDrop={handleDrop}
              className={cn(
                "group relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer overflow-hidden",
                file ? "border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-green-500/30" : "border-ruler hover:border-accent/80 hover:bg-accent/5 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)] hover:-translate-y-1",
                status === "upload_error" && !file ? "animate-[shake_0.5s_ease-in-out] border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : ""
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <input type="file" id="resume-upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center w-full z-10 transition-transform duration-300 group-hover:scale-105">
                {file ? (
                  <>
                    <FileText className="w-12 h-12 text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                    <div className="font-mono text-sm break-all font-bold text-green-400">{file.name}</div>
                    <div className="text-xs text-green-500/70 mt-3 font-mono tracking-widest uppercase">● Context Loaded</div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-ink-muted mb-4 group-hover:text-accent group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-300" />
                    <div className="font-bold mb-2 group-hover:text-accent transition-colors text-lg">Drop your Resume here</div>
                    <div className="text-xs text-ink-muted/80 font-mono tracking-wider">or click to browse local files</div>
                  </>
                )}
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-ink-muted mb-2">Job Description</label>
              <textarea 
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the target JD here..."
                className={cn(
                  "w-full h-32 bg-transparent border border-ruler rounded-xl p-4 text-sm focus:outline-none focus:border-accent resize-none",
                  status === "upload_error" && !jd ? "animate-[shake_0.5s_ease-in-out] border-red-500" : ""
                )}
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={["parsing", "analyzing", "generating"].includes(status)}
              className="w-full py-4 bg-ink text-bg font-bold rounded-xl btn-primary-shimmer hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {["parsing", "analyzing", "generating"].includes(status) ? (
                <span className="font-mono uppercase text-sm tracking-widest flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-bg border-t-transparent animate-spin"/>
                  Processing
                </span>
              ) : (
                "Analyze Profile →"
              )}
            </button>

            {status === "upload_error" || status === "api_error" ? (
              <div className="text-red-500 text-sm font-mono flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </div>
            ) : null}
          </div>

          {/* Render State / Output Panel */}
          <div className="bg-bg-dark border border-ruler rounded-2xl p-8 shadow-xl text-white flex flex-col relative overflow-hidden">
            <h3 className="font-display font-bold uppercase tracking-widest text-sm text-ink-muted mb-6">2. Execution Trace</h3>
            
            {!result && !["parsing", "analyzing", "generating", "api_error"].includes(status) && (
              <div className="flex-1 flex flex-col items-center justify-center text-ink-muted font-mono text-sm opacity-50">
                [ Waiting for input payload ]
              </div>
            )}

            {(["parsing", "analyzing", "generating"].includes(status)) && (
              <div className="flex-1 flex flex-col justify-center space-y-6 font-mono text-sm">
                <div className={cn("transition-opacity flex items-center gap-3", status === "parsing" ? "text-accent" : "text-green-500")}>
                  {status === "parsing" ? <div className="w-2 h-2 bg-accent rounded-full animate-pulse"/> : <CheckCircle2 className="w-4 h-4"/>}
                  1/3 Parsing unstructured resume data...
                </div>
                <div className={cn("transition-opacity flex items-center gap-3", ["idle", "parsing"].includes(status) ? "opacity-20" : status === "analyzing" ? "text-accent" : "text-green-500")}>
                  {status === "analyzing" ? <div className="w-2 h-2 bg-accent rounded-full animate-pulse"/> : ["generating"].includes(status) ? <CheckCircle2 className="w-4 h-4"/> : <div className="w-2 h-2 border border-white rounded-full"/>}
                  2/3 AI mapping skills graph...
                </div>
                <div className={cn("transition-opacity flex items-center gap-3", ["idle", "parsing", "analyzing"].includes(status) ? "opacity-20" : "text-accent")}>
                  {status === "generating" ? <div className="w-2 h-2 bg-accent rounded-full animate-pulse"/> : <div className="w-2 h-2 border border-white rounded-full"/>}
                  3/3 Generating zero-redundancy pathway...
                </div>
              </div>
            )}

            {status === "success" && result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-ruler">
                  <div>
                    <div className="text-xs uppercase text-ink-muted">Readiness Score</div>
                    <div className="text-4xl font-display text-green-400">{result.readiness_score}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase text-ink-muted">Days Saved</div>
                    <div className="text-4xl font-display text-accent">{result.reasoning_trace.total_days_saved}d</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-5">

                  {/* Radar Chart */}
                  <div>
                    <div className="text-xs font-mono uppercase text-ink-muted mb-2">
                      // Skill Readiness Radar
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-center">
                      <RadarChart skills={result.skills_analysis} />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <div className="text-xs font-mono uppercase text-ink-muted mb-2">
                      // Learning Pathway - Click a node
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <PathwayTimeline
                        courses={result.pathway}
                        onCourseClick={(i) => setActiveCourse(i)}
                      />
                    </div>
                  </div>

                  {/* Course Detail Cards */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-ink-muted mb-1">// Proposed Pathway</div>
                    {result.pathway.map((course, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveCourse(i)}
                        className={[
                          "p-3 border rounded-lg cursor-pointer transition-all",
                          activeCourse === i
                            ? "bg-accent/10 border-accent/50"
                            : "bg-white/5 border-white/10 hover:border-accent/30"
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-white font-bold">
                            {i + 1}. {course.title}
                          </span>
                          <span className={[
                            "text-xs px-2 py-0.5 rounded-full flex-shrink-0",
                            course.level === "beginner"
                              ? "bg-green-500/20 text-green-400"
                              : course.level === "intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          ].join(" ")}>
                            {course.level}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-ink-muted">{course.domain}</span>
                          <span className="text-accent">{course.duration}</span>
                        </div>
                        {activeCourse === i && (
                          <div className="mt-2 pt-2 border-t border-white/10 text-ink-muted leading-relaxed">
                            <span className="text-accent/70 font-bold">// reasoning: </span>
                            {course.reasoning}
                          </div>
                        )}
                      </div>
                    ))}
                    {result.pathway.length === 0 && (
                      <div className="text-green-500 p-4 bg-green-500/10 rounded">
                        Candidate exceeds all requirements. Ready for deployment.
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
