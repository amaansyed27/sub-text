import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, AlertTriangle, AlertCircle, Info, Quote } from "lucide-react";

export default function DocumentFocusView({ report, fileUrl }) {
    const [currentRiskIndex, setCurrentRiskIndex] = useState(0);
    const risks = report.red_flags;
    const currentRisk = risks[currentRiskIndex];

    const nextRisk = () => {
        if (currentRiskIndex < risks.length - 1) setCurrentRiskIndex(prev => prev + 1);
    };

    const prevRisk = () => {
        if (currentRiskIndex > 0) setCurrentRiskIndex(prev => prev - 1);
    };

    const getRiskColor = (level) => {
        if (level === "High") return "bg-red-500";
        if (level === "Medium") return "bg-yellow-400";
        return "bg-blue-400";
    };

    // Construct the PDF URL with page fragment
    // Note: We use a key on the iframe to force reload if needed, 
    // but typically changing src hash might not trigger reload in all browsers.
    // However, for blobs, it often works or requires a slight trick.
    // Let's rely on standard #page=X behavior first.
    const pdfSrc = currentRisk?.page_number
        ? `${fileUrl}#page=${currentRisk.page_number}`
        : fileUrl;

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 p-6">
            {/* LEFT: PDF VIEWER */}
            <div className="w-2/3 h-full bg-gray-200 border-3 border-ink shadow-brutal overflow-hidden relative">
                {fileUrl ? (
                    <iframe
                        key={currentRiskIndex} // Force re-render to ensure jump happens
                        src={pdfSrc}
                        className="w-full h-full"
                        title="Document Viewer"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full font-mono text-gray-500">
                        DOCUMENT_PREVIEW_UNAVAILABLE
                    </div>
                )}
            </div>

            {/* RIGHT: RISK CONTROLLER */}
            <div className="w-1/3 min-w-[350px] flex flex-col gap-4">
                {/* CONTROLS */}
                <div className="bg-white border-3 border-ink shadow-brutal p-4 flex justify-between items-center">
                    <button
                        onClick={prevRisk}
                        disabled={currentRiskIndex === 0}
                        className="p-2 border-2 border-ink hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft />
                    </button>

                    <div className="font-mono font-bold text-center">
                        <div>ISSUE {currentRiskIndex + 1} / {risks.length}</div>
                        {currentRisk.page_number && (
                            <div className="text-xs text-gray-500">PAGE {currentRisk.page_number}</div>
                        )}
                    </div>

                    <button
                        onClick={nextRisk}
                        disabled={currentRiskIndex === risks.length - 1}
                        className="p-2 border-2 border-ink hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
                    >
                        <ArrowRight />
                    </button>
                </div>

                {/* CARD */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentRiskIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-grow bg-white border-3 border-ink shadow-brutal p-6 flex flex-col gap-4 overflow-y-auto"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-start border-b-2 border-ink pb-4">
                            <span className="font-black text-xl uppercase leading-tight">
                                {currentRisk.category}
                            </span>
                            <span className={`px-2 py-1 font-mono text-xs font-bold border-2 border-ink shadow-brutal-sm text-white ${getRiskColor(currentRisk.risk_level)}`}>
                                {currentRisk.risk_level}
                            </span>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="flex-grow">
                            <div className="font-bold mb-2 uppercase text-sm text-gray-500">Analysis</div>
                            <p className="font-mono text-sm leading-relaxed mb-6">
                                {currentRisk.description}
                            </p>

                            {/* QUOTE */}
                            <div className="bg-gray-100 p-4 border-l-4 border-ink font-mono text-xs italic relative mt-auto">
                                <Quote className="w-4 h-4 absolute -top-2 -left-2 bg-white text-ink" />
                                "{currentRisk.quote}"
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
