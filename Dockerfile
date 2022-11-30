FROM node:16-slim

# RUN apt-get update && apt-get install -yq \
#   build-essential \
  # python3

# RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

# ENV NODE_ENV=development
# RUN make prepare
# RUN make build
RUN npm run start-backend
RUN npm run start-frontend

# CMD ["bash", "-c", "make db-migrate && npm start"]
CMD ["bash", "-c", "pwd"]