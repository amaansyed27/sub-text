import { motion } from "framer-motion";
import { Check, X, AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function SafetyGauge({ score }) {
    let label = "SAFE";
    let colorClass = "bg-emerald-400"; // Success

    if (score < 50) {
        label = "CRITICAL";
        colorClass = "bg-red-500"; // Danger
    } else if (score < 80) {
        label = "CAUTION";
        colorClass = "bg-amber-400"; // Warning
    }

    return (
        <div className="w-full bg-white border-3 border-ink shadow-brutal p-6 flex flex-col items-center justify-center gap-4">
            <div className="font-mono text-sm font-bold uppercase tracking-widest border-b-2 border-ink pb-1 w-full text-center">
                Safety Score
            </div>

            <div className="relative w-full h-16 bg-gray-200 border-2 border-ink overflow-hidden">
                {/* Progress Bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className={`h-full ${colorClass} border-r-3 border-ink relative`}
                >
                    {/* Striped Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]"></div>
                </motion.div>

                {/* Percentage Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center font-black font-mono text-4xl tracking-tighter z-10 mix-blend-difference text-white">
                    {score}/100
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-black font-mono text-4xl tracking-tighter z-10 text-ink opacity-30 mt-0.5 ml-0.5 pointer-events-none">
                    {score}/100
                </div>
            </div>

            <div className={`px-4 py-1 border-2 border-ink font-bold font-mono text-sm ${colorClass} shadow-brutal-sm`}>
                STATUS: {label}
            </div>
        </div>
    );
}
