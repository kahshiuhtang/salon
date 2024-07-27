build:
	go build -o build/salon cmd/main.go

run:
	build/salon
	
testrun:	
	bin/salon -test

test: build testrun

all: build run