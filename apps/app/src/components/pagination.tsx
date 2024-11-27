import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

export function Pagination({
  currentPage,
  goToPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </Button>
    </div>
  );
}
