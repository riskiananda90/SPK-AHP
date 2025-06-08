
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonTableProps {
  items: Array<{ id: string; name: string }>;
  title: string;
  description: string;
  getValue: (item1Id: string, item2Id: string) => number;
  updateValue: (item1Id: string, item2Id: string, value: number) => void;
  type: 'criteria' | 'alternative';
  criteriaId?: string;
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
  type,
  criteriaId
}) => {
  const isMobile = useIsMobile();

  const getScaleColor = (value: number) => {
    switch (value) {
      case 1: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 5: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 7: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 9: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getValueText = (value: number) => {
    if (value === 1) return "1 (Sama)";
    if (value < 1) return `1/${1/value} (Kurang)`;
    return `${value} (Lebih)`;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Scale Legend - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 sm:p-3 bg-muted rounded-lg">
        {satyScale.map((scale) => (
          <div key={scale.value} className="text-center">
            <Badge variant="outline" className="mb-1 text-[10px] sm:text-xs">{scale.label}</Badge>
            <div className="text-[10px] sm:text-xs text-muted-foreground break-words">{scale.description}</div>
          </div>
        ))}
      </div>

      {/* Comparison Table - Mobile Responsive */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-foreground min-w-[200px] text-xs sm:text-sm">Perbandingan</TableHead>
                  <TableHead className="font-semibold text-center text-foreground min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Nilai</TableHead>
                  <TableHead className="font-semibold text-center text-foreground min-w-[200px] sm:min-w-[250px] text-xs sm:text-sm">Pilihan Skala</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item1, i) => 
                  items.slice(i + 1).map((item2, j) => {
                    const currentValue = getValue(item1.id, item2.id);
                    return (
                      <TableRow key={`${item1.id}-${item2.id}-${criteriaId || 'criteria'}`}>
                        <TableCell className="font-medium p-2 sm:p-4">
                          <div className="flex flex-col space-y-1 sm:space-y-2">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Badge variant="secondary" className={`text-[10px] sm:text-xs ${type === 'criteria' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                {type === 'criteria' ? `K${i + 1}` : `A${i + 1}`}
                              </Badge>
                              <span className="text-foreground text-xs sm:text-sm truncate">{item1.name}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-muted-foreground text-xs">vs</span>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Badge variant="secondary" className={`text-[10px] sm:text-xs ${type === 'criteria' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                {type === 'criteria' ? `K${i + j + 2}` : `A${i + j + 2}`}
                              </Badge>
                              <span className="text-foreground text-xs sm:text-sm truncate">{item2.name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center p-2 sm:p-4">
                          <Badge className={`text-[10px] sm:text-xs ${getScaleColor(currentValue)}`}>
                            {isMobile ? currentValue.toString() : getValueText(currentValue)}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <div className="flex justify-center space-x-1 overflow-x-auto pb-1 sm:pb-2">
                            {satyScale.map((scale) => (
                              <Button
                                key={scale.value}
                                variant={currentValue === scale.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateValue(item1.id, item2.id, scale.value)}
                                className="min-w-[28px] sm:min-w-[32px] lg:min-w-[40px] text-[10px] sm:text-xs flex-shrink-0 h-7 sm:h-8"
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
        </div>
      </div>

      {items.length < 2 && (
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          <p className="text-xs sm:text-sm">Minimal 2 {type === 'criteria' ? 'kriteria' : 'alternatif'} diperlukan untuk melakukan perbandingan</p>
        </div>
      )}
    </div>
  );
};
