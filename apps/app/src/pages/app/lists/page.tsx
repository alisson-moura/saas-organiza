import { trpc } from "@app/lib/trpc";
import { useParams } from "react-router-dom";
import { DataTable } from "./items/data-table";
import { columns, Item } from "./items/columns";
import { ItemForm } from "./items/new-item";

// eslint-disable-next-line react-refresh/only-export-components
export const items: Item[] = [
  {
    id: 1,
    title: "Finalizar o relatório mensal",
    assigned: {
      accountId: 101,
      name: "João Silva",
    },
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    title: "Revisar código do projeto X",
    assigned: {
      accountId: 102,
      name: "Ana Oliveira",
    },
    priority: "medium",
    status: "processing",
  },
  {
    id: 3,
    title: "Organizar reunião de planejamento",
    priority: "low",
    status: "pending",
  },
  {
    id: 4,
    title: "Corrigir bug na API de autenticação",
    assigned: {
      accountId: 103,
      name: "Carlos Mendes",
    },
    priority: "high",
    status: "processing",
  },
  {
    id: 5,
    title: "Atualizar documentação do sistema",
    priority: "medium",
    status: "done",
  },
  {
    id: 6,
    title: "Criar testes automatizados para o módulo Y",
    assigned: {
      accountId: 104,
      name: "Mariana Costa",
    },
    priority: "low",
    status: "pending",
  },
  {
    id: 7,
    title: "Implementar autenticação OAuth2",
    assigned: {
      accountId: 105,
      name: "Lucas Pereira",
    },
    priority: "high",
    status: "processing",
  },
  {
    id: 8,
    title: "Realizar backup semanal do banco de dados",
    priority: "medium",
    status: "done",
  },
  {
    id: 9,
    title: "Documentar o fluxo de CI/CD",
    assigned: {
      accountId: 106,
      name: "Fernanda Lima",
    },
    priority: "low",
    status: "pending",
  },
  {
    id: 10,
    title: "Ajustar layout do dashboard para dispositivos móveis",
    assigned: {
      accountId: 107,
      name: "Ricardo Gomes",
    },
    priority: "medium",
    status: "processing",
  },
  {
    id: 11,
    title: "Criar plano de testes para o novo módulo de pagamentos",
    priority: "high",
    status: "pending",
  },
  {
    id: 12,
    title: "Refatorar função de cálculo de impostos",
    assigned: {
      accountId: 108,
      name: "Sofia Alves",
    },
    priority: "medium",
    status: "done",
  },
  {
    id: 13,
    title: "Configurar alerta de segurança para tentativas de login inválidas",
    priority: "high",
    status: "pending",
  },
  {
    id: 14,
    title: "Atualizar dependências do projeto",
    assigned: {
      accountId: 109,
      name: "Gabriel Santos",
    },
    priority: "medium",
    status: "processing",
  },
  {
    id: 15,
    title: "Pesquisar novas tecnologias para otimizar a aplicação",
    priority: "low",
    status: "pending",
  },
  {
    id: 16,
    title: "Corrigir problema de performance no carregamento da home",
    assigned: {
      accountId: 110,
      name: "Juliana Nogueira",
    },
    priority: "high",
    status: "processing",
  },
  {
    id: 17,
    title: "Realizar treinamento com a equipe sobre TypeScript",
    priority: "low",
    status: "done",
  },
  {
    id: 18,
    title: "Desenvolver funcionalidade de exportação de dados em Excel",
    assigned: {
      accountId: 111,
      name: "Eduardo Souza",
    },
    priority: "medium",
    status: "pending",
  },
  {
    id: 19,
    title: "Testar integração com gateway de pagamento",
    assigned: {
      accountId: 112,
      name: "Bianca Ribeiro",
    },
    priority: "high",
    status: "processing",
  },
  {
    id: 20,
    title: "Criar dashboard de monitoramento de vendas",
    assigned: {
      accountId: 113,
      name: "Pedro Alves",
    },
    priority: "medium",
    status: "pending",
  },
];

export function ListPage() {
  const { listId, groupId } = useParams<{ listId: string; groupId: string }>();
  const { data } = trpc.lists.get.useQuery({
    id: parseInt(listId!),
  });

  if (!listId || !groupId) {
    return <h1>Nenhuma lista selecionada</h1>;
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{data?.title}</h2>
          <p className="text-muted-foreground">{data?.description}</p>
        </div>
        <ItemForm groupId={parseInt(groupId)} listId={parseInt(listId)} />
      </div>
      <div className="mx-auto">
        <DataTable columns={columns} data={items} />
      </div>
    </div>
  );
}
