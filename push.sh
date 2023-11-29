# 이용방법: image-push.sh 5
# $1 : 첫번째 파라미터

docker image build --tag yuje123/fe:0.$1 .
docker image push yuje123/fe:0.$1
# 커밋 git commit -m "CLD-22 <message>"