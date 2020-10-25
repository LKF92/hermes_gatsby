FROM node:12

ENV PORT=80
ENV HOST=0.0.0.0

WORKDIR /var/www/html/
RUN npm install -g gatsby-cli prettier

#ToDo : Use a real way to keep this container alive ! 
# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
#
# To get SSR : 
#   - Enter into the container
#   - `gatsby develop --host=0.0.0.0 -p 80`
##
EXPOSE 80
ENTRYPOINT ["tail", "-f", "/dev/null"]