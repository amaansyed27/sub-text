import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-paper flex flex-col relative overflow-hidden">
            {/* Navbar */}
            <nav className="border-b-3 border-ink p-6 flex justify-between items-center bg-paper relative z-10 w-full">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="font-black text-3xl tracking-tighter flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => navigate("/")}
                >
                    <div className="relative">
                        <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center border-2 border-transparent relative z-10">
                            <span className="font-mono text-xl">S</span>
                        </div>
                        <div className="absolute inset-0 bg-gray-300 translate-x-1 translate-y-1 -z-0"></div>
                    </div>
                    <span className="relative">
                        SUBTEXT
                        <span className="absolute -bottom-1 left-0 w-full h-1 bg-ink opacity-0 hover:opacity-100 transition-opacity"></span>
                    </span>
                </motion.div>

                <div className="hidden md:flex gap-8 font-bold font-mono text-sm">
                    <button className="hover:underline decoration-2 underline-offset-4 decoration-wavy">MANIFESTO</button>
                    <button className="hover:underline decoration-2 underline-offset-4 decoration-wavy">HOW_IT_WORKS</button>
                    <button className="hover:underline decoration-2 underline-offset-4 decoration-wavy">PRICING</button>
                </div>

                <motion.button
                    onClick={() => navigate("/upload")}
                    initial={{ x: 0, y: 0, boxShadow: '4px 4px 0px 0px #000' }}
                    whileHover={{ x: 4, y: 4, boxShadow: '0px 0px 0px 0px #000' }}
                    whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px #000' }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-paper text-ink border-3 border-ink px-8 py-3 font-bold font-mono uppercase tracking-wider relative overflow-hidden"
                >
                    Start Audit
                </motion.button>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center text-center p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl space-y-8"
                >
                    <div className="inline-block bg-gray-100 border-2 border-ink px-4 py-1 font-mono text-xs font-bold shadow-brutal-sm mb-4 transform -rotate-2">
                        BETA v1.0 • NO SIGNUP REQUIRED
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
                        DON'T SIGN <br />
                        <span className="bg-ink text-paper px-4 decoration-wavy underline decoration-paper">YOUR SOUL.</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto font-mono text-gray-900 border-l-4 border-ink pl-6 text-left md:text-center md:border-l-0 md:pl-0">
                        AI-powered contract auditing that highlights predatory clauses,
                        hidden fees, and data risks in seconds.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
                        <motion.button
                            onClick={() => navigate("/upload")}
                            whileHover={{ scale: 0.98, x: 4, y: 4, boxShadow: '0px 0px 0px 0px #000' }}
                            whileTap={{ scale: 0.95, x: 6, y: 6, boxShadow: '0px 0px 0px 0px #000' }}
                            initial={{ x: 0, y: 0, boxShadow: '4px 4px 0px 0px #000' }}
                            className="relative overflow-hidden w-full md:w-auto bg-white border-3 border-ink px-8 py-4 text-xl font-bold flex items-center gap-3 justify-center group"
                        >
                            {/* Shimmer Overlay */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] animate-shimmer" />

                            <span className="relative z-10 flex items-center gap-3">
                                UPLOAD CONTRACT <ArrowRight className="w-6 h-6" />
                            </span>
                        </motion.button>

                        <div className="text-sm font-mono text-gray-500">
                            * Supports PDF up to 50MB
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Scrolling Ticker */}
            <div className="border-t-3 border-b-3 border-ink bg-gray-100 py-3 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap font-mono font-bold text-lg flex gap-12 text-ink/80">
                    <span>⚠️ HIDDEN FEES DETECTED</span>
                    <span>👁️ DATA PRIVACY RISKS</span>
                    <span>⚖️ WAIVER OF LIABILITY</span>
                    <span>🚫 FORCED ARBITRATION</span>
                    <span>📄 IP OWNERSHIP LOSS</span>
                    <span>⚠️ HIDDEN FEES DETECTED</span>
                    <span>👁️ DATA PRIVACY RISKS</span>
                    <span>⚖️ WAIVER OF LIABILITY</span>
                    <span>🚫 FORCED ARBITRATION</span>
                    <span>📄 IP OWNERSHIP LOSS</span>
                </div>
            </div>

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] -z-0 opacity-50" />
        </div>
    );
}
