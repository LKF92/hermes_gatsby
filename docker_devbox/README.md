# HECATE

## AWS Localstack

### Description
Local stack is a local replication of the AWS architecture (CloudFront <> S3)

## How to start in local
1. your local .env should have the `LOCALSTACK_API_KEY` entry (if you do not have one, plz contact damien.lote@mydropteam.com)
2. start your docker

```
docker-compose up -d
```

3. enter in the container and create the ressources

For information, the whole project is under `/var/hecate`
```
docker exec -ti hecate_localstack_1 bash
awslocal s3 mb s3://ssg
awslocal s3 cp --recursive //PATH/TO/ARTEFACT s3://ssg/
awslocal cloudfront create-distribution --origin-domain-name ssg.s3.amazonaws.com
```
The last command will return the cloudfront configuration, you will see the entry `DomainName` that will give you a localhost path for cloudfront.

## To Do 
- default file = index.html
- Lambda@Edge integration

## Ressources 

- https://app.localstack.cloud/docs#installation
- https://github.com/localstack/awscli-local