pipeline {
    agent any
    environment {
        NODE_ENV = 'development' // Or 'production' based on your setup
    }
    tools {
        nodejs 'Nodejs-tool' // Make sure this matches the name in Jenkins
    }

    stages {
        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                // Run tests (if any)
                sh 'npm test'
            }
        }
        stage('Deploy k3d') {
            steps {
                // Start your Node.js server
                sh 'docker build -t backend-server:latest .'
                sh 'docker tag backend-server:latest studio-registry:5000/backend-server:latest'
                sh 'docker push studio-registry:5000/backend-server:latest'
                sh 'kubectl delete -f ./tools/k3d/backend/dep.yml'
                sh 'kubectl apply -f ./tools/k3d/backend/dep.yml'
            }
        }
    }
}