.PHONY: ui\:build
ui\:build: clean
	cd sms-ui && \
	yarn build --outDir ${PWD}/assets

.PHONY: ui\:release
ui\:release: clean
	cd sms-ui && \
	yarn build --dotenv .env.production --outDir ${PWD}/assets

.PHONY: clean
clean:
	rm -rf ${PWD}/assets