# Organiza - SaaS para Gestão de Listas em Grupo

**Organiza** é um SaaS projetado para facilitar a criação e o compartilhamento de listas em grupos informais, como amigos, familiares ou colegas. Ele pode ser usado para gerenciar listas de compras, tarefas, presença e muito mais. O foco principal é promover a organização em grupo, com diferentes papéis e permissões para gerenciar as ações.

---

## Funcionalidades

As funcionalidades estão descritas como histórias de usuários, detalhadas para ilustrar os objetivos e o propósito de cada recurso. O progresso de cada funcionalidade é indicado com status:

- 🟥 **Pendente**
- 🟨 **Desenvolvendo**
- 🟩 **Concluído**

---

### Funcionalidades Gerais

1. **Cadastro de Usuário**  
   **Como um** novo usuário, **eu quero** criar uma conta com e-mail e senha **para que** eu possa acessar o sistema.  
   **Status:** 🟩 **Concluído**

2. **Login no Sistema**  
   **Como um** usuário cadastrado, **eu quero** fazer login com meu e-mail e senha **para que** eu possa acessar minhas listas e grupos.  
   **Status:** 🟩 **Concluído**

3. **Recuperação de Senha**  
   **Como um** usuário, **eu quero** solicitar um e-mail para redefinir minha senha **para que** eu possa recuperar o acesso à minha conta.  
   **Status:** 🟥 **Pendente**
4. **Alteração de Perfil**
   **Como um** usuário, **eu quero** editar minhas informações pessoais, como nome, e-mail ou senha, para que meu perfil esteja atualizado.
   **Status:** 🟥 **Pendente**

---

### Funcionalidades de Grupos

5. **Criação de Grupo**  
   **Como um** usuário, **eu quero** criar um grupo com nome e descrição **para que** eu possa compartilhar listas com outras pessoas.  
   **Status:** 🟥 **Pendente**

6. **Visualizar Grupos**  
   **Como um** membro de um grupo, **eu quero** ver os detalhes do grupo, incluindo membros e listas, **para que** eu possa acompanhar suas atividades.  
   **Status:** 🟥 **Pendente**

7. **Editar Grupos**  
   **Como um** Líder ou Organizador, **eu quero** editar as informações do grupo, como nome e descrição, **para que** elas reflitam as necessidades do grupo.  
   **Status:** 🟥 **Pendente**

---

### Funcionalidades de Membros

8. **Convidar Membros**  
   **Como um** Líder ou Organizador, **eu quero** enviar convites para que outras pessoas participem do grupo **para que** possam colaborar nas listas.  
   **Status:** 🟥 **Pendente**

9. **Cancelar Convites**  
   **Como um** Líder, **eu quero** cancelar convites enviados **para que** convites incorretos sejam anulados.  
   **Status:** 🟥 **Pendente**

10. **Gerenciar Membros**  
   **Como um** Líder, **eu quero** alterar funções ou remover membros do grupo **para que** o grupo tenha a configuração ideal.  
   **Status:** 🟥 **Pendente**

---

### Funcionalidades de Listas

11. **Criar Lista**  
    **Como um** Líder ou Organizador, **eu quero** criar uma lista com nome e descrição **para que** o grupo possa organizar tarefas, compras ou outras atividades.  
    **Status:** 🟥 **Pendente**

12. **Adicionar Itens à Lista**  
    **Como um** Líder ou Organizador, **eu quero** adicionar itens à lista **para que** os membros saibam as tarefas, itens ou atividades a serem realizadas.  
    **Status:** 🟥 **Pendente**

13. **Marcar Itens como Concluídos**  
    **Como um** Participante ou superior, **eu quero** marcar itens da lista como concluídos **para que** o grupo saiba o que já foi feito.  
    **Status:** 🟥 **Pendente**

14. **Finalizar Lista**  
    **Como um** Líder ou Organizador, **eu quero** finalizar uma lista **para que** ela seja arquivada quando todas as atividades estiverem concluídas.  
    **Status:** 🟥 **Pendente**

---

### Funcionalidades Adicionais

15. **Notificações**  
    **Como um** membro de um grupo, **eu quero** receber notificações sobre eventos importantes, como convites ou listas finalizadas **para que** eu esteja sempre atualizado.  
    **Status:** 🟥 **Pendente**

16. **Gerenciamento de Perfil**  
    **Como um** usuário, **eu quero** atualizar minhas informações pessoais no perfil **para que** meus dados estejam corretos e atualizados.  
    **Status:** 🟥 **Pendente**

---

## Permissões por Papel

| Funcionalidade                     | Líder | Organizador | Participante | Observador |
|------------------------------------|-------|-------------|--------------|------------|
| Convidar membros                   | ✅    | ✅          | ❌           | ❌         |
| Cancelar convite                   | ✅    | ❌          | ❌           | ❌         |
| Criar listas                       | ✅    | ✅          | ❌           | ❌         |
| Finalizar listas                   | ✅    | ✅          | ❌           | ❌         |
| Dar check/uncheck em itens         | ✅    | ✅          | ✅           | ❌         |
| Ver listas e itens                 | ✅    | ✅          | ✅           | ✅         |
