
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

interface Alternative {
  id: string;
  name: string;
  values?: { [criteriaId: string]: number };
}

interface AlternativeBlocksProps {
  alternatives: Alternative[];
  onEdit: (alternative: Alternative) => void;
  onDelete: (id: string) => void;
}

const AlternativeBlocks: React.FC<AlternativeBlocksProps> = ({ 
  alternatives, 
  onEdit, 
  onDelete 
}) => {
  if (alternatives.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        Belum ada alternatif yang ditambahkan
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {alternatives.map((alt, index) => (
        <div
          key={alt.id}
          className="group relative bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors min-w-fit"
        >
          <Badge variant="secondary" className="bg-green-600 text-white text-xs px-2 py-1">
            A{index + 1}
          </Badge>
          <div className="text-sm max-w-32">
            <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
              {alt.name || `Alternatif ${index + 1}`}
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(alt)}
              className="h-6 w-6 p-0 hover:bg-green-200 dark:hover:bg-green-700"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(alt.id)}
              className="h-6 w-6 p-0 hover:bg-red-200 dark:hover:bg-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlternativeBlocks;
