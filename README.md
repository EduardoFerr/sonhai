    # 🌙 Sonha AI

    Um diário de sonhos com inteligência artificial, que interpreta seus relatos com base em psicologia simbólica (Jung, Freud e esoterismo). Registre seus sonhos por data, receba interpretações e acesse seu histórico como uma agenda pessoal.

    ---

    ## 🚀 Funcionalidades

    - 📅 Registro de sonhos com calendário
    - 🤖 Interpretação simbólica com IA (via OpenAI)
    - ⭐ Marcar sonhos como favoritos
    - 🧠 Armazenamento local (localStorage)
    - 📱 Suporte a Android via Capacitor
    - 🧾 Documentação automática via TypeDoc
    - 🔄 CI/CD com GitHub Actions
    - 🐳 Execução local com Docker

    ---

    ## 🧱 Estrutura do Projeto
    ```
    sonhador-ai/
    ├── frontend/ # App Next.js + Capacitor
    ├── backend/ # API FastAPI com OpenAI
    └── docker-compose.yml # Orquestração local para 
    ```


    ---

    ## ⚙️ Como Executar Localmente

    ### Pré-requisitos
    - [Docker](https://www.docker.com/) instalado
    - Conta na [OpenAI](https://platform.openai.com/signup) para gerar sua chave de API

    ### 1. Clone o projeto
    ```bash
    git clone https://github.com/seu-usuario/sonhador-ai.git
    cd sonhador-ai
    ```

    ### 2. Configure as variáveis de ambiente
    Crie os arquivos .env:

    > frontend/.env
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```
    > backend/.env
    ```bash
    OPENAI_API_KEY=sua-chave-aqui
    ```

    ### 3. Inicie os containers
    ```bash
    docker-compose up --build
    ```

    ### 4. Acesse no navegador:

    - App: http://localhost:3000

    - API: http://localhost:8000/docs

