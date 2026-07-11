export const SortIcon = ({ 
  columnKey, 
  config 
}: { 
  columnKey: string; 
  config: { key: string; direction: 'asc' | 'desc' } | null 
}) => {
  if (config?.key !== columnKey) return <span className="ml-1 opacity-20 text-[10px]">↕</span>;
  return <span className="ml-1 text-[10px] text-orange-400">{config.direction === 'asc' ? '▲' : '▼'}</span>;
};
