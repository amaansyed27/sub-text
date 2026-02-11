import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryView from "./SummaryView";
import ChatInterface from "./ChatInterface";
import DocumentFocusView from "./DocumentFocusView";
import { LayoutDashboard, MessageSquare, FileText, ArrowLeft, Home } from "lucide-react";

export default function Dashboard({ report, fileUrl }) {
    const [activeTab, setActiveTab] = useState("summary");
    const navigate = useNavigate();

    // Safety check if accessed directly without report
    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <div className="font-mono text-xl font-bold text-red-500 uppercase">No Report Data Found</div>
                <Link to="/upload" className="bg-ink text-paper px-6 py-3 font-bold font-mono shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    GO_TO_UPLOAD
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* TOP BAR */}
            <header className="bg-paper border-b-3 border-ink p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/upload")}
                        className="flex items-center gap-2 font-mono text-sm hover:underline decoration-wavy font-bold"
                    >
                        <ArrowLeft size={16} /> NEW_UPLOAD
                    </button>
                    <div className="h-6 w-0.5 bg-ink mx-2 hidden md:block"></div>
                    <h1 className="font-black text-2xl tracking-tighter italic hidden md:block">SUBTEXT_REPORT</h1>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    <TabButton
                        active={activeTab === "summary"}
                        onClick={() => setActiveTab("summary")}
                        icon={<LayoutDashboard size={18} />}
                        label="SUMMARY"
                    />
                    <TabButton
                        active={activeTab === "chat"}
                        onClick={() => setActiveTab("chat")}
                        icon={<MessageSquare size={18} />}
                        label="AI_CHAT"
                    />
                    <TabButton
                        active={activeTab === "focus"}
                        onClick={() => setActiveTab("focus")}
                        icon={<FileText size={18} />}
                        label="DEEP_DIVE"
                    />
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-grow overflow-hidden">
                {activeTab === "summary" && <SummaryView report={report} />}
                {activeTab === "chat" && <div className="p-4 md:p-8 h-full"><ChatInterface /></div>}
                {activeTab === "focus" && <DocumentFocusView report={report} fileUrl={fileUrl} />}
            </main>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 flex items-center gap-2 font-mono font-bold text-sm border-2 transition-all whitespace-nowrap
                ${active
                    ? "bg-ink text-paper border-ink shadow-brutal-sm translate-y-[2px] translate-x-[2px] shadow-none"
                    : "bg-white text-ink border-transparent hover:border-ink hover:bg-gray-100"
                }
            `}
        >
            {icon}
            {label}
        </button>
    );
}
