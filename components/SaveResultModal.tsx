"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getBalitaByNik, saveMeasurement } from "@/app/actions";

interface AnalysisResult {
  nama: string;
  dob_str: string;
  gender: string;
  weight: number;
  height: number;
  zScoreWeight?: number;
  zScoreHeight?: number;
  nutritionStatus: string;
}

interface SaveResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: AnalysisResult | null;
}

export function SaveResultModal({
  isOpen,
  onClose,
  analysisData,
}: SaveResultModalProps) {
  const [nik, setNik] = useState("");
  const [parentName, setParentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingNik, setIsCheckingNik] = useState(false);

  const handleNikBlur = async () => {
    if (!nik || nik.length < 16) return;
    setIsCheckingNik(true);
    try {
      const balita = await getBalitaByNik(nik);
      if (balita) {
        setParentName(balita.parentName);
        toast.info("Data balita ditemukan. Nama orang tua terisi otomatis.");
      }
    } catch (error) {
      console.error("Error checking NIK:", error);
    } finally {
      setIsCheckingNik(false);
    }
  };

  const handleSave = async () => {
    if (!analysisData || !nik || !parentName) {
      toast.error("Mohon lengkapi NIK dan Nama Orang Tua");
      return;
    }

    setIsLoading(true);
    try {
      const result = await saveMeasurement({
        nik,
        name: analysisData.nama,
        dob: analysisData.dob_str,
        gender: analysisData.gender,
        parentName,
        weight: analysisData.weight,
        height: analysisData.height,
        zScoreWeight: analysisData.zScoreWeight,
        zScoreHeight: analysisData.zScoreHeight,
        nutritionStatus: analysisData.nutritionStatus,
      });

      if (result.success) {
        toast.success("Data berhasil disimpan!");
        onClose();
        setNik("");
        setParentName("");
      } else {
        toast.error(result.error || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simpan Hasil Analisa</DialogTitle>
          <DialogDescription>
            Masukkan NIK dan Nama Orang Tua untuk menyimpan data ini ke database.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nik" className="text-right">
              NIK
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="nik"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                onBlur={handleNikBlur}
                placeholder="16 digit NIK"
                maxLength={16}
                disabled={isLoading}
              />
              {isCheckingNik && (
                 <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-gray-500" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parentName" className="text-right">
              Nama Ortu
            </Label>
            <Input
              id="parentName"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Nama Ibu/Ayah"
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
