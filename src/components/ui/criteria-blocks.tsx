
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

interface Criteria {
  id: string;
  name: string;
  weight?: number;
  type?: 'benefit' | 'cost';
}

interface CriteriaBlocksProps {
  criteria: Criteria[];
  onEdit: (criteria: Criteria) => void;
  onDelete: (id: string) => void;
  showWeight?: boolean;
  showType?: boolean;
}

const CriteriaBlocks: React.FC<CriteriaBlocksProps> = ({ 
  criteria, 
  onEdit, 
  onDelete, 
  showWeight = false, 
  showType = false 
}) => {
  if (criteria.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        Belum ada kriteria yang ditambahkan
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {criteria.map((crit, index) => (
        <div
          key={crit.id}
          className="group relative bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors min-w-fit"
        >
          <Badge variant="secondary" className="bg-blue-600 text-white text-xs px-2 py-1">
            K{index + 1}
          </Badge>
          <div className="text-sm max-w-32">
            <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
              {crit.name || `Kriteria ${index + 1}`}
            </div>
            {(showWeight || showType) && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex space-x-2">
                {showWeight && crit.weight !== undefined && (
                  <span>W: {crit.weight}</span>
                )}
                {showType && crit.type && (
                  <span>({crit.type === 'benefit' ? 'B' : 'C'})</span>
                )}
              </div>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(crit)}
              className="h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-blue-700"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(crit.id)}
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

export default CriteriaBlocks;
