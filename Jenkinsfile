pipeline {
    agent any

    stages {
       stage('delete Existing clone') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh '''rm -fr * .*'''
                }
            }
        }
        
        stage('Clone repository') {
            steps {
                sh '''git clone https://github.com/mlopProject/digiSync_backend.git .'''
            }
        }
        
        stage('Build image') {
            steps {
                script {
                    dockerImage = docker.build("anashameed/digisync_api:latest")
                }
            }
        }
        
        stage('Push image') {
            steps {
                script {
                    withDockerRegistry([credentialsId: "dockerHubCred", url: ""]) {
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Run image') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'MONGO_URL', variable: 'MONGO_URL'),
                        string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                        string(credentialsId: 'PORT', variable: 'PORT'),
                        string(credentialsId: 'APPID', variable: 'APPID'),
                        string(credentialsId: 'SECAPPID', variable: 'SECAPPID'),
                        string(credentialsId: 'FIREBASE_BUCKET', variable: 'FIREBASE_BUCKET'),
                        string(credentialsId: 'OPENAI_API_KEY', variable: 'OPENAI_API_KEY'),
                        string(credentialsId: 'EMAIL_USER', variable: 'EMAIL_USER'),
                        string(credentialsId: 'EMAIL_AUTH', variable: 'EMAIL_AUTH')
                    ]) {
                        sh 'docker stop weather-app || true'
                        sh 'docker rm weather-app || true'
                        sh '''
                            docker run -d --name weather-app -p 5000:5000 \
                            -e MONGO_URL=${MONGO_URL} \
                            -e JWT_SECRET=${JWT_SECRET} \
                            -e PORT=${PORT} \
                            -e APPID=${APPID} \
                            -e SECAPPID=${SECAPPID} \
                            -e FIREBASE_BUCKET=${FIREBASE_BUCKET} \
                            -e OPENAI_API_KEY=${OPENAI_API_KEY} \
                            -e EMAIL_USER=${EMAIL_USER} \
                            -e EMAIL_AUTH=${EMAIL_AUTH} \
                            anashameed/digisync_api:latest
                          '''
                    }
                }
            }
        }
    }
}
