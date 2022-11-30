docker:
	docker build -t darall-menu .
	docker run -it -p 9000:9000 -p 80:80 darall-menu