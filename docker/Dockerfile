FROM node

# install yarn
RUN apt-get update
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get -y install apt-transport-https apt-utils vim
RUN apt-get update
RUN apt-get -y install yarn

# make dir
RUN mkdir /app

VOLUME /app
EXPOSE 7024 7025

CMD sh -c "cd /app; exec /bin/bash"

