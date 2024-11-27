import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import { Button } from "@app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";

interface ListCardProps {
  title: string;
  description: string;
  createdAt: Date;
  ownerName: string;
}

export function ListCard({
  title,
  description,
  createdAt,
  ownerName,
}: ListCardProps) {
  return (
    <Card className="h-[200px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="truncate flex-1 mr-2" title={title}>
          {title}
        </CardTitle>
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Editar lista">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar lista</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Remover lista">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remover lista</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow overflow-hidden">
        <p
          className="text-sm text-muted-foreground mb-2 line-clamp-3"
          title={description}
        >
          {description}
        </p>
        <div className="flex justify-between text-xs text-muted-foreground mt-auto">
          <span className="truncate" title={`Criado por: ${ownerName}`}>
            Criado por: {ownerName}
          </span>
          <span>
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
