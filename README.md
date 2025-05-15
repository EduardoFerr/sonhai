# 🌙 Sonha AI

Um diário de sonhos com inteligência artificial, que interpreta seus relatos com base em psicologia simbólica (Jung, Freud e esoterismo). Registre seus sonhos por data, receba interpretações e acesse seu histórico como uma agenda pessoal.

---

## 🚀 Funcionalidades

* 🗕️ Registro de sonhos com calendário
* 🤖 Interpretação simbólica com IA (via OpenAI)
* ⭐ Marcar sonhos como favoritos
* 🧠 Armazenamento local (localStorage)
* 📱 Suporte a Android via Capacitor
* 🗞️ Documentação automática via TypeDoc
* ↻ CI/CD com GitHub Actions
* 🐳 Execução local com Docker

---

## 🧱 Estrutura do Projeto

```
sonhador-ai/
├── frontend/           # App Next.js + Capacitor
├── backend/            # API FastAPI com OpenAI
├── docker-compose.yml  # Orquestração local
└── dist/               # Geração do bundle Android (.aab e .apk)
```

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

* [Docker](https://www.docker.com/) instalado
* Conta na [OpenAI](https://platform.openai.com/signup) para gerar sua chave de API

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/sonhador-ai.git
cd sonhador-ai
```

### 2. Configure as variáveis de ambiente

Crie os arquivos `.env`:

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

### 4. Acesse no navegador

* Frontend: [http://localhost:3000](http://localhost:3000)
* API: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📱 Gerar e testar o app Android

### 1. Gerar o bundle `.aab` com Docker

```bash
make release
```

Isso criará o arquivo `dist/app-release.aab`.

### 2. Criar um keystore manual (uma vez só)

```bash
keytool -genkey -v \
  -keystore my-release-key.jks \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Gerar o `.apks` com o [Bundletool](https://developer.android.com/studio/command-line/bundletool)

```bash
make install
```

### 4. Extrair o APK universal para testes

```bash
unzip dist/app.apks -d dist/apks
adb install dist/apks/universal.apk
```

> Certifique-se de que o [ADB](https://developer.android.com/tools/adb) está instalado e com um dispositivo/emulador conectado.

---

## 📤 Publicar na Google Play (ISSUE - testar publicação)

Configure o arquivo `android/fastlane/service-account.json` com a conta de serviço e execute:

```bash
make publish-playstore
```

---

## 📖 Licença

MIT © \[Seu Nome ou Organização]
