import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageSquare, Database, Plus, FileText } from "lucide-react";
import type { Paper } from "@/types";
import { mockApi } from "@/mockApi";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [recentPapers, setRecentPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, papersData] = await Promise.all([
          mockApi.getKnowledgeBaseStats(),
          mockApi.getKnowledgeBasePapers(),
        ]);
        setStats(statsData);
        setRecentPapers(papersData.slice(0, 3));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // const quickActions = [
  //   {
  //     icon: Search,
  //     label: "Search Papers",
  //     description: "Find research papers by keywords",
  //     path: "/search",
  //     color: "bg-blue-500",
  //   },
  //   {
  //     icon: MessageSquare,
  //     label: "Chat",
  //     description: "Ask questions about papers",
  //     path: "/chat",
  //     color: "bg-green-500",
  //   },
  //   {
  //     icon: BookOpen,
  //     label: "Knowledge Base",
  //     description: "Manage indexed papers",
  //     path: "/knowledge-base",
  //     color: "bg-purple-500",
  //   },
  // ];

  // const StatCard = ({
  //   icon: Icon,
  //   label,
  //   value,
  // }: {
  //   icon: React.ReactNode;
  //   label: string;
  //   value: string | number;
  // }) => (
  //   <Card className="p-6 bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors">
  //     <div className="flex items-center gap-4">
  //       <div className="text-3xl">{Icon}</div>
  //       <div>
  //         <p className="text-slate-400 text-sm">{label}</p>
  //         <p className="text-2xl font-bold text-white">{value}</p>
  //       </div>
  //     </div>
  //   </Card>
  // );

  return (
    <div className="p-8 space-y-8">
      <div className="rounded-2xl p-8 bg-linear-to-r from-slate-900  to-green-900 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to ResearchAI</h2>
        <p className="text-gray-300 mb-6">
          Your intelligent assistant for research paper discovery and analysis
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/search">
            <Button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg shadow">
              <Search />
              Search Papers
            </Button>
          </Link>
          <Link to="/chat">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow">
              <MessageSquare />
              Start Chat
            </Button>
          </Link>
          <Link to="/knowledge-base">
            <Button
              variant="outline"
              className="border-gray-400 text-gray-200 hover:bg-gray-800 px-5 py-2 rounded-lg"
            >
              <Database />
              Manage Knowledge Base
            </Button>
          </Link>
        </div>
      </div>
      {recentPapers.length > 0 && (
        <section className="text-gray-200">
          <h2 className="text-xl font-semibold mb-4">Recent Papers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPapers.map((paper, index) => (
              <Card
                key={index}
                className="bg-zinc-800/50 border border-zinc-700 hover:border-zinc-500 transition-all"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    {paper.title}
                    <Badge className="bg-blue-700 text-white">
                      {paper.source}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-400">{paper.authors}</p>
                  <p className="text-sm text-gray-500">{paper.year}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                    {paper.abstract}
                  </p>
                  <div className="flex items-center gap-3">
                    {paper.addedToKB ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-gray-700 text-gray-300 cursor-not-allowed"
                      >
                        In Knowledge Base
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-[#13795b] hover:bg-[#179b70] text-white flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add to KB
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" /> View PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
