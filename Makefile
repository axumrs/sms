.PHONY: build
build: clean
	cd sms-ui && \
	yarn build --outDir ${PWD}/assets

.PHONY: release
release: clean
	cd sms-ui && \
	yarn build --dotenv .env.production --outDir ${PWD}/assets

.PHONY: clean
clean:
	rm -rf ${PWD}/assets