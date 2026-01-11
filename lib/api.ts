
import { Client } from "@gradio/client";

export interface AnalysisResponseData {
  age_months: number;
  corrected_height: number;
  z_score_data: [string, number, string][];
  status_output: string;
  rekomendasi: string;
  fig: Record<string, unknown>; // Plotly JSON object
}

export const analyzeGizi = async (data: {
  nama: string;
  dob_str: string;
  gender: string;
  weight: number;
  height: number;
  measure_mode: string;
}) => {
  const client = await Client.connect("https://gizi.ezii.my.id/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await client.predict("/analyze_gizi", data);

  const rawData = result.data;

  const age_months = rawData[0];
  const corrected_height = rawData[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zScoreRaw: any = rawData[2];
  const z_score_data = zScoreRaw?.data || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusRaw: any = rawData[3];
  const status_output = typeof statusRaw === 'object' && statusRaw.label ? statusRaw.label : String(statusRaw);

  const rekomendasi = rawData[4];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const figRaw: any = rawData[5];
  let fig = {};
  try {
    if (typeof figRaw === 'object' && figRaw.plot) {
      fig = JSON.parse(figRaw.plot);
    } else {
      fig = figRaw;
    }
  } catch (e) {
    console.error("Failed to parse Plotly JSON (Fig 1)", e);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fig2Raw: any = rawData[6];
  let fig2 = {};
  try {
    if (typeof fig2Raw === 'object' && fig2Raw.plot) {
      fig2 = JSON.parse(fig2Raw.plot);
    } else {
      fig2 = fig2Raw;
    }
  } catch (e) {
    console.error("Failed to parse Plotly JSON (Fig 2)", e);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fig3Raw: any = rawData[7];
  let fig3 = {};
  try {
    if (typeof fig3Raw === 'object' && fig3Raw.plot) {
      fig3 = JSON.parse(fig3Raw.plot);
    } else {
      fig3 = fig3Raw;
    }
  } catch (e) {
    console.error("Failed to parse Plotly JSON (Fig 3)", e);
  }

  return [age_months, corrected_height, z_score_data, status_output, rekomendasi, fig, fig2, fig3] as [number, number, [string, number, string][], string, string, Record<string, unknown>, Record<string, unknown>, Record<string, unknown>];
};
