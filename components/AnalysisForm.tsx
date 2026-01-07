
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";


interface AnalysisFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnalyze: (data: any) => void;
  isLoading: boolean;
}

export function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [formData, setFormData] = useState({
    nama: "",
    dob_str: "",
    gender: "Laki-laki",
    weight: "",
    height: "",
    measure_mode: "Berdiri",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.dob_str || !formData.weight || !formData.height) {
        alert("Mohon lengkapi semua data.");
        return;
    }
    
    onAnalyze({
      ...formData,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Balita</Label>
          <Input
            id="nama"
            name="nama"
            placeholder="Masukkan nama lengkap"
            value={formData.nama}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob_str">Tanggal Lahir</Label>
          <Input
            id="dob_str"
            name="dob_str"
            type="date"
            value={formData.dob_str}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-3">
          <Label>Jenis Kelamin</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(val) => handleRadioChange("gender", val)}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Laki-laki" id="gender-male" />
              <Label htmlFor="gender-male">Laki-laki</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Perempuan" id="gender-female" />
              <Label htmlFor="gender-female">Perempuan</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Berat Badan (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Tinggi Badan (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Posisi Pengukuran</Label>
          <RadioGroup
            value={formData.measure_mode}
            onValueChange={(val) => handleRadioChange("measure_mode", val)}
            className="flex flex-row gap-4"
          >
           <div className="flex items-center space-x-2">
              <RadioGroupItem value="Terlentang" id="measure-terlentang" />
              <Label htmlFor="measure-terlentang">Terlentang</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Berdiri" id="measure-berdiri" />
              <Label htmlFor="measure-berdiri">Berdiri</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menganalisa...
          </>
        ) : (
          "Analisa Status Gizi"
        )}
      </Button>
    </form>
  );
}
