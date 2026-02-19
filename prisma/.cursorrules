# 🗺️ MAPA DE CONSTRUÇÃO: VELLUI ONE (SaaS)

## [cite_start]1. VISÃO DO PRODUTO [cite: 3]
[cite_start]O Vellui One é uma plataforma SaaS Multi-tenant de Gestão de Atendimento e Operação, centralizando canais como WhatsApp e PABX, transformando conversas em processos auditáveis (Tickets/SLA)[cite: 4].

## 2. REGRAS DE OURO (DIRETRIZES DO CURSOR)
- [cite_start]**Isolamento Total:** Toda entidade no banco deve possuir um `company_id` para garantir o isolamento entre clientes.
- [cite_start]**Segurança:** Nunca exponha chaves de API no código; use sempre arquivos `.env`[cite: 36].
- [cite_start]**Modularidade:** Mantenha o código de cada módulo (CRM, Tickets, Chat) separado e organizado[cite: 37].
- [cite_start]**Mobile First:** A interface deve ser perfeita tanto no desktop quanto no telemóvel[cite: 38].
- [cite_start]**Clean Code:** Comente o código de forma que um usuário não técnico entenda a lógica básica[cite: 39].

## [cite_start]3. STACK TECNOLÓGICA [cite: 5]
- [cite_start]**Frontend:** Next.js (React) + Tailwind CSS + ShadcnUI[cite: 6].
- [cite_start]**Backend:** Node.js + NestJS[cite: 7].
- [cite_start]**Banco de Dados:** PostgreSQL com Prisma ORM[cite: 8].
- **Hospedagem Recomendada:** Vercel (Frontend) e Supabase ou AWS para o Banco.

## [cite_start]4. ARQUITETURA DE DADOS (Entidades) [cite: 13]
- [cite_start]**Companies:** Nome, CNPJ, Plano e Status[cite: 14].
- [cite_start]**Users:** Nome, Email, Senha (Hashed), Role (Admin/Agente) e `company_id`[cite: 15].
- [cite_start]**Customers:** Dados de contato, Histórico e Contratos[cite: 16].
- [cite_start]**Tickets:** Assunto, Status, Responsável, SLA e `company_id`[cite: 17].
- [cite_start]**Proposals/Contracts:** PDF da proposta e Status de Assinatura[cite: 18].

## [cite_start]5. ROTEIRO DE DESENVOLVIMENTO (Fases) [cite: 19]
### [cite_start]Fase 1: Fundação & CRM (Início) [cite: 20]
- [cite_start]Setup de pastas, Auth (Login/Logout) e CRM Operacional (Cadastro de Clientes e Contratos)[cite: 21, 22, 23].
- [cite_start]Visualização Kanban para Funil de Vendas[cite: 24].

### [cite_start]Fase 2: Motor de Atendimento [cite: 25]
- [cite_start]Chat Omnichannel (WhatsApp API) e Módulo de Tickets[cite: 26, 27].
- [cite_start]Gestão de Tarefas e Follow-up[cite: 28].

### [cite_start]Fase 3: Integrações de Voz e Documentos [cite: 29]
- [cite_start]Log de chamadas Yeastar e Gerador de Propostas com assinatura digital[cite: 30, 31].

### [cite_start]Fase 4: Inteligência & Dashboards [cite: 32]
- [cite_start]IA Vellui para resumos e Gráficos de SLA/Produtividade[cite: 33, 34].
