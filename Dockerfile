FROM node:16.13.1

ENV LANG=C.UTF-8
ENV INSTANCE=3

WORKDIR /home/marco

ADD . /home/marco

RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pm2 && \
    npm install -g ts-node && \
    npm install && \
    npm run build-ts

ENTRYPOINT ["sh", "run.sh"]