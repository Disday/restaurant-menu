docker:
	docker build -t darall-menu .
	docker run -it -p 5173:5173 -p 80:80 darall-menu