FROM debian:stretch
MAINTAINER be-ys <architecture_entreprise@almerys.com>

RUN apt-get update && apt-get install -y openjdk-8-jre openjdk-8-jdk maven git

RUN git clone https://github.com/be-ys/columbia-front.git compil && cd compil
WORKDIR ./compil/middleware
RUN mvn clean && mvn package
RUN mkdir /opt/application && cp ./target/prod_columbia.jar /opt/application
COPY application.properties /opt/application/application.properties

EXPOSE 8888
WORKDIR /opt/application
CMD ["java", "-jar", "prod_columbia.jar"]