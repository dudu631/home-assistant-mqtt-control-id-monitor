ARG BUILD_FROM
FROM $BUILD_FROM

COPY . .

RUN apk add --update npm

RUN npm install -g yarn

RUN yarn install

ENV DEBUG "control-id-ha-integration:server"

CMD [ "yarn", "start-debug" ]

EXPOSE 3000