
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_PROJECT_NAME = 'taskflow-cloud-native-platform'
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
    }

    post {
        success {
            echo 'TaskFlow CI completed successfully!'
        }

        failure {
            echo 'TaskFlow CI failed. Check the console output.'
        }
    }
}
