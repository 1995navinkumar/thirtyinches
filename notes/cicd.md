
## Jobs: 
- code-check
- containerize and push to hub (docker)
- pull and deploy to cluster (k8s)
- functional tests

- Quality Gate 2
- Security-vulnerabilty check: Quality Gate 1


## Events: 
- on MR to master branch: code-check, 
- on Merge/Push master: code-check, containerize and publish, deploy, functional tests


## Branching Strategy: 
- main/master is base branch, feature branches are based from it.
  - push/merged:  containerize, deploy, functional tests
- feature branch
  -Push: code-check
  -MRtoMaster: code-check,
- release branch created from main 
  - deploy staging, UAT, Performance testing, Regression 
  - push: code-check, containerize, deply staging, regression, performance testing..

https://learn.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops

Note: 
We dont merge release back to main. release branches are locked at different versions. so we can still add/support a specific version.
changes made to release are brough back to master through cherry picking.


## Variables
Better to use Context for variables ${{ }}. $Variable has gotchas

Q: should i build project in Docker or in pipeline
Its fine to buid project in a containerized jobs and copy the build directory alone to Docker image. 

Things to Note: 
While building, build context `.` in `docker build -t image-name .` sends the Dockerfile and all the 
contents in that path to docker daemon which can be slower. to avoid this make sure to use `.dockerignore` to avoid sending unneccessary files

ref: https://karuppiah7890.github.io/blog/posts/using-ci-cd-artifacts-for-faster-docker-image-builds/

Q: should i run jobs in containers? why? 
Running jobs in containers ensures all our process/jobs run in the same env setup. This can prevent any compatibilty issues


TODO: 
- ~merge_ready~
- post merge
- run only one similar job (concurrency)
- Copy build from repo rather than building in Docker daemon, use dockerignore

