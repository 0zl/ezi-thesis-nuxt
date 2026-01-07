
"use client";

import { useState } from "react";
import { AnalysisForm } from "@/components/AnalysisForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { analyzeGizi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Save } from "lucide-react";
import { toast } from "sonner";
import { SaveResultModal } from "@/components/SaveResultModal";


export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inputData, setInputData] = useState<any | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnalyze = async (data: any) => {
    setIsLoading(true);
    setResult(null);
    setInputData(data);

    try {
      const apiResult = await analyzeGizi(data);
      if (apiResult) {
        setResult(apiResult);
        toast.success("Analisa berhasil!");
      } else {
         toast.error("Gagal mendapatkan respon dari server.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalysisDataForSave = () => {
    if (!result || !inputData) return null;
    
    const z_score_data = result[2];
    const status_output = result[3];
    const findZ = (key: string) => {
       const found = z_score_data.find((row: any[]) => row[0].includes(key));
       return found ? (typeof found[1] === 'number' ? found[1] : parseFloat(found[1])) : undefined;
    };

    const zScoreWeight = findZ("BB/U");
    const zScoreHeight = findZ("TB/U");

    return {
        nama: inputData.nama,
        dob_str: inputData.dob_str,
        gender: inputData.gender,
        weight: typeof inputData.weight === 'string' ? parseFloat(inputData.weight) : inputData.weight,
        height: typeof inputData.height === 'string' ? parseFloat(inputData.height) : inputData.height,
        nutritionStatus: status_output,
        zScoreWeight,
        zScoreHeight
    };
  };

  return (
    <div className="w-full">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-t-4 border-t-teal-600 shadow-lg">
                    <CardHeader>
                        <CardTitle>Data Balita</CardTitle>
                        <CardDescription>Masukkan data antropometri balita.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-8">
                 {!result && !isLoading && (
                     <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center dark:border-stone-800 dark:bg-stone-950/50">
                        <Activity className="h-12 w-12 text-stone-300 mb-4" />
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">Belum ada data analisa</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mt-2">
                            Silahkan isi formulir disebelah kiri dan klik tombol &quot;Analisa&quot; untuk melihat hasil disini.
                        </p>
                     </div>
                 )}

                 {result && (
                    <div className="mb-4 flex justify-end">
                        <Button onClick={() => setIsSaveModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Data
                        </Button>
                    </div>
                 )}

                 <AnalysisResult result={result} />
            </div>
       </div>

       <SaveResultModal 
         isOpen={isSaveModalOpen} 
         onClose={() => setIsSaveModalOpen(false)} 
         analysisData={getAnalysisDataForSave()}
       />
    </div>
  );
}
