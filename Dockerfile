FROM node:16.13-alpine

ARG WORKDIR

WORKDIR ${WORKDIR}

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
CMD [ "yarn", "dev" ]