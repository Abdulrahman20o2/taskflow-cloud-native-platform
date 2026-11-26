
pipeline {
    agent any

    options {
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
}

    environment {
        COMPOSE_PROJECT_NAME = 'taskflow-cloud-native-platform'
        DOCKER_CONFIG = '/var/jenkins_home/.docker'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                sh 'git --version'
                sh 'docker --version'
                sh 'docker compose version'
                sh 'docker buildx version'
            }
        }

        stage('Validate and Build') {
            steps {
                sh '''
                    set -eu

                    cat > .env <<'EOF'
POSTGRES_DB=taskflow_db
POSTGRES_USER=taskflow_user
POSTGRES_PASSWORD=ci_build_only_placeholder
DATABASE_URL=postgresql+psycopg://taskflow_user:ci_build_only_placeholder@database:5432/taskflow_db
SECRET_KEY=ci_build_only_placeholder_secret_key
EOF

                    trap 'rm -f .env' EXIT

                    docker compose config --quiet
                    docker compose build backend frontend
                '''
            }
        }


stage('Security Scan') {
    steps {
        sh '''
            trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 taskflow-cloud-native-platform-backend:latest
            trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 taskflow-cloud-native-platform-frontend:latest
        '''
    }
}


        stage('Deploy TaskFlow') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'taskflow-env',
                        variable: 'TASKFLOW_ENV_FILE'
                    )
                ]) {
                    sh '''
                        set -eu
                        umask 077
                        cp "$TASKFLOW_ENV_FILE" .env

                        trap 'rm -f .env' EXIT

                        docker compose up -d --no-build
                        docker compose ps
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'TaskFlow CI/CD completed successfully!'
        }

        failure {
            echo 'TaskFlow pipeline failed. Check the console output.'
        }
    }
}
