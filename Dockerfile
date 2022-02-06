FROM node:alpine

EXPOSE 4200

RUN apk update && apk add bash

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR "/root/project"

CMD ["/bin/bash"]