all:
	@npm install
	@(cd test; component install && component build)

server:
	node test/server.js

clean:
	rm -rf node_modules test/build test/components
