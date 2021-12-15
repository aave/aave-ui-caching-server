FROM node:16

WORKDIR /app/

ADD package.json package-lock.json /app/

RUN npm ci

ADD ./ /app/

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "prod"]
