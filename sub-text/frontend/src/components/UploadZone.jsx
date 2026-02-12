import { useRef, useState } from "react";
import { Upload, File, Loader2, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function UploadZone({ onUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const processFile = async (file) => {
        if (file.type !== "application/pdf") {
            setError("INVALID_FILE_TYPE: PDF_ONLY");
            return;
        }

        setIsLoading(true);
        setError(null);
        setUploadProgress(0); // Reset progress at the start

        const formData = new FormData();
        formData.append("file", file);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(`${apiUrl}/analyze`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            onUpload(response.data, file);
        } catch (err) {
            console.error(err);
            setError("SERVER_ERROR: ANALYSIS_FAILED");
        } finally {
            setIsLoading(false);
            setUploadProgress(0); // Reset progress on completion or error
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence>
                {error && (
                    <motion.div className="mb-4 bg-red-100 border-2 border-red-500 text-red-600 p-3 font-mono text-sm font-bold flex items-center gap-3 shadow-brutal-sm">
                        <AlertOctagon className="w-5 h-5" /> {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                onClick={() => !isLoading && fileInputRef.current?.click()}
                initial={{ x: 0, y: 0, boxShadow: '8px 8px 0px 0px #000' }}
                whileHover={!isLoading ? { x: 4, y: 4, boxShadow: '4px 4px 0px 0px #000' } : {}}
                whileTap={!isLoading ? { x: 8, y: 8, boxShadow: '0px 0px 0px 0px #000' } : {}}
                animate={isDragging ? { x: 4, y: 4, boxShadow: '4px 4px 0px 0px #000', scale: 1.02 } : isLoading ? { boxShadow: '0px 0px 0px 0px #000', y: 8, x: 8 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`group relative h-80 bg-white border-3 border-ink transition-colors duration-200 flex flex-col items-center justify-center p-8 text-center overflow-hidden
        ${isDragging ? "bg-gray-50 border-dashed" : ""}
        ${isLoading ? "cursor-wait bg-gray-50" : "cursor-pointer"}
        `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                }}
            >
                {/* Shimmer Overlay */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-100%] animate-shimmer pointer-events-none" />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center w-full max-w-sm gap-6 relative z-10">
                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest">
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                    Scanning...
                                </motion.span>
                                <span>PROCESSING</span>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="h-6 border-3 border-ink p-1 bg-white shadow-brutal-sm relative overflow-hidden">
                                {/* Striped Background */}
                                <div className="absolute inset-0 opacity-10 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]"></div>

                                {/* Fill Animation */}
                                <motion.div
                                    className="h-full bg-ink relative"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${Math.max(uploadProgress, 5)}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    {/* Glitch Effect Overlay */}
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="font-mono text-xs text-gray-500 text-center space-y-1">
                            <CyclingText texts={[
                                "EXTRACTING_TEXT_LAYERS...",
                                "VECTORIZING_CLAUSES...",
                                "DETECTING_LIABILITIES...",
                                "CALCULATING_RISK_SCORE..."
                            ]} />
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-ink text-paper flex items-center justify-center mb-6 border-2 border-transparent group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-2">Upload Contract</h3>
                        <p className="font-mono text-gray-500 text-sm mb-6">
                            [DRAG PDF HERE] or [CLICK TO BROWSE]
                        </p>
                        <div className="border-t-2 border-ink pt-4 w-full">
                            <div className="flex justify-between text-xs font-mono text-gray-400 uppercase gap-4">
                                <span>Max 50MB</span>
                                <span>PDF Only</span>
                                <span>Secured</span>
                            </div>
                        </div>
                    </div>
                )}

                <input type="file" ref={fileInputRef} onChange={(e) => processFile(e.target.files[0])} accept=".pdf" className="hidden" />
            </motion.div>
        </div>
    );
}

function CyclingText({ texts }) {
    const [index, setIndex] = useState(0);

    // Cycle through texts
    if (index < texts.length - 1) {
        setTimeout(() => setIndex(index + 1), 600);
    }

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="uppercase tracking-wider"
        >
            {texts[index]}
        </motion.div>
    );
}
