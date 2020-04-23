# TV Show Reminder

A simple web application to remind one person about his or her TV shows.

It uses the TVMaze API:s to retrieve information about TV shows and episodes.

## Set up

Run it on Kubernetes with Traefik as the Ingress controller!

Requires that a Letsencrypt ClusterIssuer is installed.

1. Set up a PostgreSQL database and a domain name
2. Update the connection string, domain name, password etc in deployment/tv-show-reminder-chart/values.yaml

## Deploy using helm

    cd deployment
    kubectl create ns tv-show-reminder
    helm install tv-show-reminder tv-show-reminder-chart/ --namespace tv-show-reminder
