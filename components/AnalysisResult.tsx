
"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Plot: any = dynamic(() => import("react-plotly.js"), { ssr: false });

interface AnalysisResultProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: [number, number, [string, number, string][], string, string, any] | null;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  if (!result) return null;

  const [age_months, corrected_height, z_score_data, status_output, rekomendasi, fig] = result;

  const statusMatch = status_output.match(/(.*) \((\d+\.?\d*)\/100\)/);
  const statusLabel = statusMatch ? statusMatch[1] : status_output;
  const statusScore = statusMatch ? statusMatch[2] : "";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-l-4 border-l-teal-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">Hasil Analisa Ekspert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-stone-500">Usia</span>
              <span className="font-semibold text-lg">{age_months} Bulan</span>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500">Tinggi Terkoreksi</span>
              <span className="font-semibold text-lg">{corrected_height} cm</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
             <div className="text-center">
                <span className="block text-sm text-stone-500 dark:text-stone-400">Keputusan Sistem (Fuzzy Logic)</span>
                <span className="block text-2xl font-bold text-teal-700 dark:text-teal-400 mt-1">{statusLabel}</span>
                {statusScore && <span className="text-xs font-mono text-stone-400">Score: {statusScore}/100</span>}
             </div>
          </div>

           <div className="mt-4">
                <h4 className="font-semibold mb-2">Rekomendasi Penanganan:</h4>
                <p className="text-sm bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded border border-yellow-200 dark:border-yellow-800 text-stone-700 dark:text-stone-300">
                    {rekomendasi}
                </p>
           </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Rincian Z-Score</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indikator</TableHead>
                    <TableHead>Nilai (SD)</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {z_score_data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row[0]}</TableCell>
                      <TableCell>{typeof row[1] === 'number' ? row[1].toFixed(2) : row[1]}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
      </Card>

      <Card className="overflow-hidden">
          <CardHeader>
               <CardTitle>Visualisasi Pertumbuhan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="w-full h-[400px]">
                <Plot
                    data={fig.data}
                    layout={{
                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ...fig.layout as any,
                        autosize: true,
                        margin: { l: 40, r: 20, t: 30, b: 40 },
                        height: 400,
                    }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                    config={{ responsive: true, displayModeBar: false }}
                />
             </div>
          </CardContent>
      </Card>
    </div>
  );
}
