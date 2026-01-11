
"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";

const Plot: any = dynamic(() => import("react-plotly.js"), { ssr: false });

interface AnalysisResultProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: [number, number, [string, number, string][], string, string, any, any, any] | null;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<'height' | 'weight' | 'wfh'>('height');

  if (!result) return null;

  const [age_months, corrected_height, z_score_data, status_output, rekomendasi, fig, fig2, fig3] = result;

  const statusMatch = status_output.match(/(.*) \((\d+\.?\d*)\/100\)/);
  const statusLabel = statusMatch ? statusMatch[1] : status_output;
  const statusScore = statusMatch ? statusMatch[2] : "";

  const getStatusColor = (label: string) => {
    if (label.includes("Gizi Buruk")) return "text-red-700 dark:text-red-400";
    if (label.includes("Gizi Kurang")) return "text-orange-700 dark:text-orange-400";
    if (label.includes("Gizi Lebih")) return "text-yellow-700 dark:text-yellow-400";
    return "text-teal-700 dark:text-teal-400"; // Gizi Baik
  };

  const getStatusBg = (label: string) => {
    if (label.includes("Gizi Buruk")) return "bg-red-50 dark:bg-red-900/20";
    if (label.includes("Gizi Kurang")) return "bg-orange-50 dark:bg-orange-900/20";
    if (label.includes("Gizi Lebih")) return "bg-yellow-50 dark:bg-yellow-900/20";
    return "bg-teal-50 dark:bg-teal-900/20";
  };

  const currentTextColor = getStatusColor(statusLabel);
  const currentBgColor = getStatusBg(statusLabel);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className={`border-l-4 shadow-md ${statusLabel.includes('Buruk') ? 'border-l-red-500' : statusLabel.includes('Kurang') ? 'border-l-orange-500' : statusLabel.includes('Lebih') ? 'border-l-yellow-500' : 'border-l-teal-500'}`}>
        <CardHeader>
          <CardTitle className="text-xl">Hasil Analisa Ekspert</CardTitle>
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

          <div className={`mt-4 p-4 rounded-lg ${currentBgColor}`}>
            <div className="text-center">
              <span className="block text-sm text-stone-500 dark:text-stone-400">Keputusan Sistem (Fuzzy Logic)</span>
              <span className={`block text-2xl font-bold mt-1 ${currentTextColor}`}>{statusLabel}</span>
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
          <div className="flex border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setActiveTab('height')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'height'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50 dark:bg-teal-900/10'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
            >
              Tinggi/Umur (TB/U)
            </button>
            <button
              onClick={() => setActiveTab('weight')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'weight'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50 dark:bg-teal-900/10'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
            >
              Berat/Umur (BB/U)
            </button>
            <button
              onClick={() => setActiveTab('wfh')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'wfh'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50 dark:bg-teal-900/10'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
            >
              Berat/Tinggi (BB/TB)
            </button>
          </div>
          <div className="w-full h-[500px] p-4">
            <Plot
              data={activeTab === 'height' ? fig.data : activeTab === 'weight' ? (fig2 ? fig2.data : []) : (fig3 ? fig3.data : [])}
              layout={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(activeTab === 'height' ? fig.layout : activeTab === 'weight' ? (fig2 ? fig2.layout : {}) : (fig3 ? fig3.layout : {})) as any,
                autosize: true,
                margin: { l: 40, r: 20, t: 30, b: 40 },
                height: 450,
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
