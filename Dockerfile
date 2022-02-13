FROM node:16.13-alpine

ARG WORKDIR

WORKDIR ${WORKDIR}

COPY package.json yarn.lock ./
RUN yarn install --no-progress

COPY . .
CMD [ "yarn", "dev" ]