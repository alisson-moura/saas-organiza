import { AppAbility } from "@organiza/authorization";
import { Can } from "@casl/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeleteListAlert } from "./delete-list-alert";
import { EditListForm } from "@app/pages/app/lists/edit-list-form";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface ListProps {
  title: string;
  description: string | null | undefined;
  createdAt: Date;
  ownerName: string;
  id: number;
}
interface ListCardProps extends ListProps {
  ability: AppAbility;
}

export function ListCard({
  title,
  description,
  createdAt,
  ownerName,
  ability,
  id,
}: ListCardProps) {
  return (
    <Card className="h-[200px] flex flex-col transition-transform hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="truncate flex-1 mr-2" title={title}>
          {title}
        </CardTitle>
        <Can ability={ability} I="manage" a="List">
          <div className="flex space-x-1">
            <EditListForm
              id={id}
              createdAt={createdAt}
              description={description}
              ownerName={ownerName}
              title={title}
            />
            <DeleteListAlert id={id} />
          </div>
        </Can>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow overflow-hidden">
        <p
          className="text-sm text-muted-foreground mb-2 line-clamp-3"
        >
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm flex flex-col gap-4text-xs text-muted-foreground mt-auto">
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
        <Link to={`${id}`}>
          <Button variant="outline" size="icon">
            <ArrowRight />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
