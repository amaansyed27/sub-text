import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export default function RiskList({ report }) {
    return (
        <div className="space-y-4">
            {report.red_flags.length === 0 ? (
                <div className="border-3 border-ink p-8 text-center font-mono bg-white shadow-brutal">
                    <p>NO_RISKS_DETECTED. SYSTEM_CLEAR.</p>
                </div>
            ) : (
                report.red_flags.map((flag, index) => (
                    <RiskItem key={index} flag={flag} />
                ))
            )}
        </div>
    );
}

function RiskItem({ flag }) {
    const [isOpen, setIsOpen] = useState(false);

    let borderClass = "border-ink";
    let bgClass = "bg-white";
    let label = "LOW_RISK";

    if (flag.risk_level === "High") {
        bgClass = "bg-red-50";
        label = "HIGH_RISK";
    } else if (flag.risk_level === "Medium") {
        bgClass = "bg-amber-50";
        label = "MED_RISK";
    }

    return (
        <motion.div
            layout
            className={`border-3 border-ink shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer ${bgClass}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="p-4 flex items-start gap-4">
                <div className={`mt-1 w-3 h-3 border border-ink ${flag.risk_level === 'High' ? 'bg-red-500' : flag.risk_level === 'Medium' ? 'bg-amber-400' : 'bg-green-400'}`} />

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-lg leading-tight uppercase">{flag.category}</h4>
                        <span className="font-mono text-xs border border-ink px-1 bg-white whitespace-nowrap hidden sm:block">
                            {label}
                        </span>
                    </div>
                    <p className="font-mono text-sm text-gray-700 leading-relaxed">
                        {flag.description}
                    </p>
                </div>

                <div>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && flag.quote && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t-2 border-ink bg-gray-100"
                    >
                        <div className="p-4 font-mono text-xs italic text-gray-600 border-l-4 border-ink ml-4 my-4 bg-white shadow-sm">
                            "{flag.quote}"
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
