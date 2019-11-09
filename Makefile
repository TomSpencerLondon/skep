all: dev=0
all:
	cd app && $(MAKE) dev=${dev}
	cd agent && $(MAKE) dev=${dev}
	cd monitor && $(MAKE) dev=${dev}
	cd charts && $(MAKE) dev=${dev}
	docker push skep/agent
	docker push skep/monitor
	docker push skep/app
	docker push skep/charts
