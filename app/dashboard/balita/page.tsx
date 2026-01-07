import { getBalitaList } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search } from "@/components/Search";
import { Pagination } from "@/components/Pagination";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeleteBalitaButton } from "@/components/DeleteBalitaButton";

export const dynamic = 'force-dynamic';

interface BalitaPageProps {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}

export default async function BalitaPage(props: BalitaPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const { data: balitaList, totalPages, total } = await getBalitaList({ 
      query, 
      page: currentPage 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Data Balita</h2>
      </div>

      <div className="flex items-center gap-4">
          <Search placeholder="Cari NIK atau Nama..." />
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daftar Riwayat ({total} Data)</CardTitle>
        </CardHeader>
        <CardContent>
            {balitaList.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                    Tidak ada data balita ditemukan.
                </div>
            ) : (
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIK</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Tanggal Lahir</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Nama Orang Tua</TableHead>
                                <TableHead>Status Gizi Terakhir</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {balitaList.map((balita: any) => {
                                const latestMeasurement = balita.pemeriksaan[0];
                                return (
                                    <TableRow key={balita.id}>
                                        <TableCell className="font-medium">{balita.nik}</TableCell>
                                        <TableCell>{balita.name}</TableCell>
                                        <TableCell>{format(new Date(balita.dob), 'd MMMM yyyy', { locale: id })}</TableCell>
                                        <TableCell>{balita.gender}</TableCell>
                                        <TableCell>{balita.parentName}</TableCell>
                                        <TableCell>
                                            {latestMeasurement ? (
                                                <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                                    {latestMeasurement.nutritionStatus}
                                                </span>
                                            ) : (
                                                <span className="text-stone-400 italic">Belum ada data</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DeleteBalitaButton id={balita.id} name={balita.name} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    
                    {totalPages > 1 && (
                        <div className="pt-4 border-t">
                            <Pagination totalPages={totalPages} />
                        </div>
                    )}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
