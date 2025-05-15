# Caminhos
DIST_DIR=./dist
AAB_PATH=$(DIST_DIR)/app-release.aab
CONTAINER_ANDROID=sonhai-android

# Rodar os serviços web (frontend + backend)
up:
	docker compose up frontend backend

# Derrubar os serviços
down:
	docker compose down

# Build do app Android (via Docker)
android:
	docker compose up --build android

# Copiar .aab do container
copy-aab:
	mkdir -p ./dist && sudo chown -R $$(id -u):$$(id -g) ./dist
	docker cp $(CONTAINER_ANDROID):/work/android/app/build/outputs/bundle/release/app-release.aab $(AAB_PATH)

# Build + copiar aab
release: android copy-aab
	@echo "✅ AAB salvo em: $(AAB_PATH)"

# Limpar containers, volumes e diretório dist
clean:
	docker compose down -v --remove-orphans
	rm -rf $(DIST_DIR)

clean-builder:
	docker builder prune -f

# Build específicos
build-web:
	docker compose build frontend

build-back:
	docker compose build backend

# Atualizar pacotes no host
upgrade:
	cd frontend && \
	npm install -g npm@latest && \
	npm update && \
	npm audit fix --force && \
	echo "✅ Dependências atualizadas no host."

# Atualizar pacotes via container Docker (sem sujar o host)
upgrade-docker:
	docker run --rm -v "$$PWD/frontend":/app -w /app node:20-alpine sh -c "\
		npm install -g npm@latest && \
		npm update && \
		npm audit fix --force && \
		echo '✅ Dependências atualizadas dentro do Docker.'"

# Congelar versões exatas com shrinkwrap
freeze:
	cd frontend && \
	rm -f package-lock.json npm-shrinkwrap.json && \
	npm ci && \
	npm shrinkwrap && \
	echo "🔒 Versões travadas com shrinkwrap."

# Upgrade + commit automático
upgrade-commit: upgrade
	cd frontend && \
	git add package*.json && \
	git commit -m "chore: upgrade de dependências" || echo "⚠️ Nenhuma mudança para commitar"

# Preview estático (via serve)
preview:
	docker run --rm -v $(PWD)/frontend/out:/app -p 4000:4000 node:20-alpine sh -c "\
		npm install -g serve && \
		serve -s /app -l 4000"

# Publicar .aab na Google Play (via Fastlane)
publish-playstore:
	test -f $(AAB_PATH) || (echo "❌ Arquivo .aab não encontrado. Rode 'make release' primeiro."; exit 1)
	docker run --rm -v "$$(pwd)":/app -w /app \
		-e SUPPLY_PACKAGE_NAME=com.app.sonhai \
		-e SUPPLY_JSON_KEY_DATA="$$(cat android/fastlane/service-account.json | base64 -w 0)" \
		fastlane/fastlane \
		fastlane supply \
		--aab $(AAB_PATH) \
		--track internal \
		--skip_upload_metadata true \
		--skip_upload_changelogs true \
		--skip_upload_images true \
		--skip_upload_screenshots true && \
	echo "📤 Upload do .aab para Google Play (track: internal) concluído!"
