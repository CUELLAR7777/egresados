import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

const Card = ({ children, className = '', title, subtitle, actions }: CardProps) => {
  return (
    <div className={`bg-card rounded-lg card-shadow border border-border ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            {title && <h3 className="font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
