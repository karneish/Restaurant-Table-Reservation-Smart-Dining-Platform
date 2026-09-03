import React from 'react';
interface Props { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode; }
const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {icon && <div className="mb-4 text-gray-300">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);
export default EmptyState;
