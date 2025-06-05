
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ComparisonTableProps {
  items: Array<{ id: string; name: string }>;
  title: string;
  description: string;
  getValue: (item1Id: string, item2Id: string) => number;
  updateValue: (item1Id: string, item2Id: string, value: number) => void;
  type: 'criteria' | 'alternative';
}

const satyScale = [
  { value: 1, label: "1", description: "Sama penting" },
  { value: 3, label: "3", description: "Sedikit lebih penting" },
  { value: 5, label: "5", description: "Lebih penting" },
  { value: 7, label: "7", description: "Sangat penting" },
  { value: 9, label: "9", description: "Mutlak lebih penting" }
];

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  items,
  title,
  description,
  getValue,
  updateValue,
  type
}) => {
  const getScaleColor = (value: number) => {
    switch (value) {
      case 1: return 'bg-gray-100 text-gray-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 5: return 'bg-orange-100 text-orange-800';
      case 7: return 'bg-red-100 text-red-800';
      case 9: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getValueText = (value: number) => {
    if (value === 1) return "1 (Sama)";
    if (value < 1) return `1/${1/value} (Kurang)`;
    return `${value} (Lebih)`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Scale Legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg">
        {satyScale.map((scale) => (
          <div key={scale.value} className="text-center">
            <Badge variant="outline" className="mb-1">{scale.label}</Badge>
            <div className="text-xs text-gray-600">{scale.description}</div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Perbandingan</TableHead>
              <TableHead className="font-semibold text-center">Nilai</TableHead>
              <TableHead className="font-semibold text-center">Pilihan Skala</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item1, i) => 
              items.slice(i + 1).map((item2, j) => {
                const currentValue = getValue(item1.id, item2.id);
                return (
                  <TableRow key={`${item1.id}-${item2.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={type === 'criteria' ? 'bg-blue-100' : 'bg-green-100'}>
                          {type === 'criteria' ? `K${i + 1}` : `A${i + 1}`}
                        </Badge>
                        <span>{item1.name}</span>
                        <span className="text-gray-500">vs</span>
                        <Badge variant="secondary" className={type === 'criteria' ? 'bg-blue-100' : 'bg-green-100'}>
                          {type === 'criteria' ? `K${i + j + 2}` : `A${i + j + 2}`}
                        </Badge>
                        <span>{item2.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getScaleColor(currentValue)}>
                        {getValueText(currentValue)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-1">
                        {satyScale.map((scale) => (
                          <Button
                            key={scale.value}
                            variant={currentValue === scale.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateValue(item1.id, item2.id, scale.value)}
                            className="min-w-[40px] text-xs"
                            title={scale.description}
                          >
                            {scale.value}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {items.length < 2 && (
        <div className="text-center py-8 text-gray-500">
          <p>Minimal 2 {type === 'criteria' ? 'kriteria' : 'alternatif'} diperlukan untuk melakukan perbandingan</p>
        </div>
      )}
    </div>
  );
};
