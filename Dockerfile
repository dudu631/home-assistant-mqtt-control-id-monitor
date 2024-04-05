ARG BUILD_FROM
FROM $BUILD_FROM

COPY . .

RUN apk add --update npm

RUN npm install -g yarn

RUN yarn install

ENV DEBUG "control-id-ha-integration:server"

RUN chmod a+x /docker_entrypoint.sh

CMD [ "/docker_entrypoint.sh" ]

EXPOSE 3000