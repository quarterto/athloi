IGNORE_A11Y = true

node_modules/@financial-times/n-gage/index.mk:
	npm install @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

# unit-test:
# 	export NODE_ENV=test; mocha 'tests/**/*.spec.js'

# unit-test-coverage:
	# nyc --reporter=$(if $(CIRCLECI),lcovonly,lcov) make unit-test

test: verify