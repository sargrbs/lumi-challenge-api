    Documentação da Aplicação de Gerenciamento de Faturas

    1. Visão Geral
        Esta aplicação Express.js foi desenvolvida para gerenciar faturas de energia elétrica. Suas principais funcionalidades incluem:

        Upload de faturas em formato PDF
        Extração automática de informações das faturas
        Armazenamento das informações extraídas em um banco de dados
        Filtragem e paginação de faturas
        Exclusão de faturas

    2. Estrutura do Projeto
        root/
        │
        ├── dist/
        ├── node_modules/
        ├── prisma/
        │   ├── migrations/
        │   └── schema.prisma
        ├── src/
        │   ├── Config/
        │   │   └── Database.ts
        │   ├── Controllers/
        │   │   └── InvoiceController.ts
        │   ├── Manager/
        │   │   └── InvoiceManager.ts
        │   ├── Middlewares/
        │   │   ├── ErrorHandler.ts
        │   │   └── MulterConfig.ts
        │   ├── Models/
        │   │   └── InvoiceModel.ts
        │   ├── Repository/
        │   │   └── InvoiceRepository.ts
        │   ├── Routes/
        │   │   └── InvoiceRoutes.ts
        │   ├── Tests/
        │   │   ├── data/
        │   │   ├── libs/
        │   │   ├── invoiceCalculations.test.ts
        │   │   ├── invoiceCreate.test.ts
        │   │   └── pdfExtractor.test.ts
        │   ├── Types/
        │   │   └── express.d.ts
        │   ├── Utils/
        │   │   └── PdfExtractor.ts
        │   ├── app.ts
        │   └── server.ts
        ├── .env
        ├── .gitignore
        ├── .prettierrc
        ├── package-lock.json
        ├── package.json
        ├── README.md
        └── tsconfig.json


    3. Rotas da API
        3.1 Upload de Fatura

            Método: POST
            Endpoint: /upload
            Descrição: Faz o upload de um arquivo PDF de fatura e extrai suas informações.
            Parâmetros:

            invoice (file): Arquivo PDF da fatura (enviado como multipart/form-data)


            Resposta: Detalhes da fatura extraída e salva

        3.2 Filtrar Faturas

            Método: POST
            Endpoint: /filter
            Descrição: Filtra faturas com base em critérios específicos.
            Corpo da Requisição: Critérios de filtragem (a serem especificados)
            Resposta: Lista de faturas que atendem aos critérios

        3.3 Listar Todas as Faturas

            Método: GET
            Endpoint: /
            Descrição: Retorna todas as faturas armazenadas.
            Resposta: Lista de todas as faturas

        3.4 Paginação de Faturas

            Método: GET
            Endpoint: /page/:page/:clientNumber?/:referenceMonth?
            Descrição: Retorna faturas paginadas, com opção de filtrar por número do cliente e mês de referência.
            Parâmetros de URL:

            page: Número da página
            clientNumber (opcional): Número do cliente para filtrar
            referenceMonth (opcional): Mês de referência para filtrar


            Resposta: Lista paginada de faturas

        3.5 Excluir Fatura

            Método: DELETE
            Endpoint: /delete/:id
            Descrição: Exclui uma fatura específica.
            Parâmetros de URL:

            id: ID da fatura a ser excluída


            Resposta: Confirmação de exclusão

    4. Modelo de Dados
        Invoice = {
            id?: string
            clientName: string
            clientNumber: string
            installationNumber: string
            referenceMonth: string
            electricityQuantity: number
            electricityTotal: number
            energySceeeQuantity: number
            energySceeeTotal: number
            economyGDIQuantity: number
            economyGDITotal: number
            publicLighting: number
            totalCost: number
            invoiceDueDate: Date
            paymentCode: string
            totalConsumption: number
            totalWithoutGD: number
            createdAt?: Date
            updatedAt?: Date
        }

    5. Configuração e Instalação
        Requisitos do Sistema

        Node.js versão v18.20.3
        PostgreSQL

        Banco de Dados

        Desenvolvimento: PostgreSQL
        Produção: CockroachDB (utilizando um cluster no Cockroach Labs)

        Passos para Instalação

        Clone o repositório do projeto
        Navegue até o diretório do projeto
        Execute npm install para instalar as dependências
        Configure as variáveis de ambiente no arquivo .env (veja a seção de Variáveis de Ambiente abaixo)
        Execute npm run dev para iniciar o servidor de desenvolvimento

        Variáveis de Ambiente
        Crie um arquivo .env na raiz do projeto e configure as seguintes variáveis:
        DATABASE_URL=sua_url_de_conexao_com_o_banco_de_dados
        PORT=porta_do_servidor (ex: 3000)

    6. Scripts Úteis
        O projeto inclui vários scripts npm úteis para desenvolvimento, teste e implantação:

        npm run dev: Inicia o servidor de desenvolvimento usando nodemon e tsx
        npm run build: Compila o projeto TypeScript
        npm start: Inicia o servidor de produção (após a compilação)
        npm test: Executa os testes usando Vitest
        npm run format: Formata o código usando Prettier

        Para usar esses scripts, execute-os no terminal a partir do diretório raiz do projeto.
    7. Testes
        A aplicação utiliza Vitest como framework de teste. Os arquivos de teste estão localizados no diretório src/Tests/.
        Para executar os testes, use o comando:
        
        npm test

    8. Dependências Principais

        Express.js: ^4.17.1
        Prisma: ^3.0.0
        Multer: ^1.4.3
        PDF.js: ^2.9.359
        [Outras dependências relevantes]

    9. Processo de Extração de PDF
        A aplicação utiliza a biblioteca PDF.js para extrair informações das faturas em PDF. O processo envolve:

            Upload do arquivo PDF via Multer
            Parsing do PDF usando PDF.js
            Extração de texto e dados relevantes
            Processamento e estruturação dos dados extraídos
            Armazenamento dos dados estruturados no banco de dados

    10. Fluxo de Dados

        Cliente faz upload do PDF da fatura
        Middleware Multer processa o upload
        InvoiceController chama o PdfExtractor para extrair informações
        Dados extraídos são validados e processados
        InvoiceRepository salva os dados no banco PostgreSQL/CockroachDB
        Resposta é enviada ao cliente com os detalhes da fatura processada

    11. Deployment
        Para fazer deploy da aplicação em produção:

        Compile o projeto usando npm run build
        Configure as variáveis de ambiente necessárias no servidor de produção
        Inicie a aplicação usando npm start