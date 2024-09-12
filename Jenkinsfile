pipeline {
    agent any
    environment {
        NODE_ENV = 'development' // Or 'production' based on your setup
    }
    tools {
        NodeJS '18.19.1' // Make sure this matches the name in Jenkins
    }
    stages {
        stage('Test Node.js Version') {
            steps {
                sh 'node -v' // Check Node.js version
                sh 'npm version' // Check NPM version
            }
        }
    }
    // stages {
    //     stage('Install Dependencies') {
    //         steps {
    //             // Install Node.js dependencies
    //             sh 'npm install'
    //         }
    //     }
    //     stage('Run Tests') {
    //         steps {
    //             // Run tests (if any)
    //             sh 'npm test'
    //         }
    //     }
    //     stage('Run Node.js Server') {
    //         steps {
    //             // Start your Node.js server
    //             sh 'nohup npm start &'
    //         }
    //     }
    // }
    // post {
    //     always {
    //         // Clean up workspace after build
    //         cleanWs()
    //     }
    //     failure {
    //         // Notify if the build fails
    //         echo 'Build failed!'
    //     }
    //     success {
    //         // Notify if the build succeeds
    //         echo 'Node.js server is running!'
    //     }
    // }
}