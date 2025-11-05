import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { mockApi } from "@/mockApi";
import type { Paper, KnowledgeBaseStats } from "@/types";

const KnowledgeBase = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  //   const { toast } = useToast();

  useEffect(() => {
    const loadKBData = async () => {
      try {
        setLoading(true);
        const [papersData, statsData] = await Promise.all([
          mockApi.getKnowledgeBasePapers(),
          mockApi.getKnowledgeBaseStats(),
        ]);
        setPapers(papersData);
        setStats(statsData);
      } catch (error) {
        console.log(error);
        // toast({
        //   title: "Failed to load knowledge base",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

    loadKBData();
  }, []);

  const getStatusIcon = (status: Paper["indexingStatus"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="text-green-500" size={18} />;
      case "processing":
        return <Loader2 className="text-yellow-500 animate-spin" size={18} />;
      case "failed":
        return <AlertCircle className="text-red-500" size={18} />;
      default:
        return <Clock className="text-slate-500" size={18} />;
    }
  };

  const handleSelectAll = () => {
    if (selectedPapers.length === papers.length) {
      setSelectedPapers([]);
    } else {
      setSelectedPapers(papers.map((p) => p.id));
    }
  };

  const handleSelectPaper = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const handleDeletePapers = async () => {
    try {
      setPapers((prev) => prev.filter((p) => !selectedPapers.includes(p.id)));
      setSelectedPapers([]);
      //   toast({
      //     title: `${selectedPapers.length} paper(s) deleted`,
      //   });
    } catch (error) {
      console.log(error);
      //   toast({
      //     title: "Failed to delete papers",
      //     variant: "destructive",
      //   });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">
          Knowledge Base [DEMO DATA FOR NOW WILL BE IMPLEMENTED]
        </h1>
        <p className="text-slate-400">
          Manage and monitor indexed research papers
        </p>
      </section>

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Papers</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalPapers}
                </p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Chunks</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalChunks}
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Processing</p>
                <p className="text-3xl font-bold text-white">
                  {stats.processingCount}
                </p>
              </div>
              <div className="text-4xl">⚙️</div>
            </div>
          </Card>
        </section>
      )}

      {/* Table */}
      <section>
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Indexed Papers</h2>
            {selectedPapers.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeletePapers}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Selected ({selectedPapers.length})
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedPapers.length === papers.length &&
                        papers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="text-white">Title</TableHead>
                  <TableHead className="text-white">Authors</TableHead>
                  <TableHead className="text-white">Year</TableHead>
                  <TableHead className="text-white">Chunks</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {papers.map((paper) => (
                  <TableRow
                    key={paper.id}
                    className="border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedPapers.includes(paper.id)}
                        onChange={() => handleSelectPaper(paper.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="text-white font-medium max-w-xs truncate">
                      {paper.title}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {paper.authors.slice(0, 2).join(", ")}
                      {paper.authors.length > 2 && "..."}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {paper.year}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {paper.chunks}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(paper.indexingStatus)}
                        <span className="text-sm text-slate-400 capitalize">
                          {paper.indexingStatus}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {papers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-slate-400">
                No papers in knowledge base. Search and add papers to get
                started.
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

export default KnowledgeBase;
