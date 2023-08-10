FROM openjdk:17
ARG JAR_FILE=build/libs/springboard-0.0.1-SNAPSHOT.jar
# app.jar로 복사해둔다.
COPY ${JAR_FILE} app.jar
# dl
ENTRYPOINT ["java", "-jar", "app.jar"]